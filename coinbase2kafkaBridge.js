const WebsocketClient = require('websocket').client
const kafka = require('kafka-node')
const color = require('colors-cli')
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

function createProducer() {
    console.log('creating producer');
    return new Promise((resolve, reject) => {
        var Producer = kafka.Producer,
            client = new kafka.KafkaClient({kafkaHost: config.kafka.host }),
            producer = new Producer(client);

        producer.on('ready', function () {
            let sendSingleMessage = (key, topic, message, callback) => producer.send([
                { key, topic, messages: message }
            ], callback)
            resolve(sendSingleMessage);
        });

        producer.on('error', function (err) {
            console.error(err);
            reject(err);
        })
    })
}




const tradingConsoleAppender = (utf8Data) => {
    try {
        let obj = JSON.parse(utf8Data);
        if (obj.type && obj.type === 'ticker') {
            let log = `${obj.side[0].toUpperCase()} ${obj.product_id} price: ${obj.price} volume: ${obj.last_size}`;

            // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
            if (obj.side[0] == 'b') console.log(color.green(log))
            else console.log(color.magenta(log))
        } else {
            console.log(utf8Data);
        }
    } catch (error) {
        console.log(utf8Data);
    }
}


createProducer().then(sendSingleMessage => {
    const client = new WebsocketClient()
    client.on("connectFailed", console.error)

    client.connect(config.coinbaseWebsocket)

    client.on("connect", connection => {
        connection.on("error", console.error)
        connection.on("close", x => {
            // Note: Websocket Error 1006 happens randomly
            // Seems like an low-level error. Cause unknown (30. Oct 18)
            console.log("closing because of: ", x)
            console.log("try reconnecting ...");
            client.connect(config.coinbaseWebsocket);
        })
        connection.on("message", ({ utf8Data }) => {
            try {
                let obj = JSON.parse(utf8Data);
                if (obj.type && obj.type === 'ticker' && obj.side) {
                    sendSingleMessage(obj.product_id, config.kafka.topic, utf8Data, (err, data) => {
                        if (err) console.error(err)
                    });
                }
            } catch (error) {
                console.error(error);
            }
            tradingConsoleAppender(utf8Data);
        })

        console.log(config.subscriptionRequest)
        connection.send(JSON.stringify(config.subscriptionRequest));
    })
})