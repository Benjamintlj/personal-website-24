# MQTT (mosquito)

[MQTT Lib](C++/Library/MQTT%20Lib%20acc6868d70fa48a0a735f8ff2014dc8a.md)

![Untitled](MQTT%20(mosquito)/Untitled.png)

## Start

```bash
/usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
```

## Subscriber

```bash
mosquitto_sub -d -t 'topicName'
```

## Publisher

```bash
mosquitto_pub -d -t 'topicName' -m 'message'
```