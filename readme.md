# coinbase2kafkaBridge
This NodeJs-Script subscribes to coinbase ticker channel through websocket feed (see https://docs.pro.coinbase.com/#protocol-overview) and produces messages for kafka. Coinbase websocket feed will also shown in console.

## Install
```bash
cd /repos/
git clone https://github.com/robie2011/coinbase2kafkaBridge.git
cd coinbase2kafkaBridge
npm install
```
## Start

    node coinbase2kafkaBridge.js

## Configuration

  * `kafka.host`: Kafka Broker Host
  * `kafka.topic`: topic name to write message in
  * `subscriptionRequest`: request object according to coinbase api. See https://docs.pro.coinbase.com/#subscribe

```json
{
    "coinbaseWebsocket": "wss://ws-feed.pro.coinbase.com",
    "kafka": {
        "host": "localhost:9092",
        "topic": "CoinbaseTicker"
    },
    "subscriptionRequest": {
        "type": "subscribe",
        "channels": [
            {
                "name": "ticker",
                "product_ids": [
                    "LTC-EUR"
                ]
            },
            {
                "name": "ticker",
                "product_ids": [
                    "ETH-EUR"
                ]
            },
            {
                "name": "ticker",
                "product_ids": [
                    "BTC-EUR"
                ]
            },
            {
                "name": "ticker",
                "product_ids": [
                    "ZRX-EUR"
                ]
            }
        ]
    }
}
```
