# nimnjs-node
JS implementation of nimn specification


## Benchmark

### Data size
NIMN string : 13
JSON string : 75
CBOR arr : 52
MSGPACK arr : 52

### Processing time
JSON.stringify : 1169794.6919116746 requests/second
nimn Encode : 1091362.3258166446 requests/second
notepack messagepack encode : 691799.2320991316 requests/second

JSON.parse : 700679.4015321195 requests/second
nimn Decode : 932112.281887193 requests/second
notepack messagepack decode : 400395.87049678445 requests/second