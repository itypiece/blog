---
title: 利用I2P实现匿名交流,
publish_date: 2022-05-07
---

I2P(Invisible Internet Project) 是一种匿名网络，我们可以使用`netcat`工具连接 I2P 网络进行通讯。使用本教程前，你需要提前安装并运行`i2pd`。

```shell
nc 127.0.0.1 7656
```

7656 是与 i2p 的 SAM API 进行通信的默认端口

然后

```shell
HELLO VERSION
```

应该会回应 HELLO REPLY RESULT=OK VERSION=3.1

接下来需要生成密钥

```shell
DEST GENERATE SIGNATURE_TYPE=7
```

i2p 路由器会回复带有密钥的信息

```shell
DEST REPLY PUB=pub PRIV=priv
SESSION CREATE STYLE=STREAM ID=ity DESTINATION=priv
```

显然，ity 应该改成其他内容（这是可读的标识符）；)

通常创建会话需要一些时间（不超过几秒）。响应应为：

```shell
SESSION STATUS RESULT=OK DESTINATION=...
```

然后，

```shell
STREAM ACCEPT ID=ity
```

来自另一台计算机,

```shell
STREAM CONNECT ID={YOUR ID} DESTINATION={PEER PUBLIC KEY}
```

互相发送消息！

现在这个会话在等待任何知道你的 pub 公钥的人连接
