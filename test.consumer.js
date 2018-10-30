
var kafka = require('kafka-node'),
    client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'}),
    consumer = new kafka.Consumer(client, [{
        topic: 'hello',
        offset: 0, 
        partition: 0 // default 0
     }], {
         // fromOffset = true: force to read from offset (0). 
         // If offset 0 isn't available, problem don't continue
         fromOffset: false
     });

client.on("connect", x => {
    console.log("*** client connected ***");
})

consumer.on('message', function (message) {
    try {
        let obj = JSON.parse(message.value)
        console.log(`${message.offset} ${obj.side[0].toUpperCase()} ${obj.product_id} price: ${obj.price} vol: ${obj.last_size} ${obj.time}`)
    } catch (error) {
        console.log(message);
    }
});