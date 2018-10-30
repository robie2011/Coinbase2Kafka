var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' }),
    producer = new Producer(client);

producer.on('ready', function () {
    var payload2 = [{
        key: 'test',
        topic: 'hello', 
        messages: {
            name: 'Robert',
            surename: 'Rajakone'
        }
    }];

    console.log("sending");
    
    producer.send(payload2, function (err, data) {
        console.log(data);
    });
});

producer.on('error', function (err) { })
