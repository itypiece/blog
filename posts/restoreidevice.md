---
title: 非 Mac 电脑还原另一台 Mac 电脑的 MacOS
publish_date: 2024-05-05
---

在少数情况下，MacOS 系统无法启动，甚至恢复模式也无法进入。而 [https://support.apple.com/mac/restore](https://support.apple.com/mac/restore) 告诉你需要另一台 Mac 电脑才能恢复。在没有 Mac 电脑情况下，我们也可以通过开源项目 idevicerestore 来恢复 MacOS 。

此方法不仅适用于 Mac 电脑，也适用于搭载 iOS, iPadOS 的设备。

你需要一个 Linux 系统环境（未测试 WSL ）。然后前往 [https://github.com/libimobiledevice/idevicerestore](https://github.com/libimobiledevice/idevicerestore) 和 [https://github.com/libimobiledevice/usbmuxd](https://github.com/libimobiledevice/usbmuxd) 编译安装`idevicerestore`和`usbmuxd`。

 
 > Arch Linux 用户请不要从 aur 下载 idevicerestore 。该版本不能用于较新的设备的恢复。

参考 [https://support.apple.com/en-us/108900](https://support.apple.com/en-us/108900) 进入 DFU 模式。建议准备一个倒计时（任何形式的都行），确保按照文档要求按 10 秒，这样才能保证进入 DFU 模式。

运行命令:

```
sudo usbmuxd
sudo idevicerestore --latest
```

根据序号，选择要安装的系统版本。然后等待一段时间，电脑就会重新启动，并进入系统。

如果你需要格式化硬盘，可以在`idevicerestore`加上`--erase`参数。

如果终端上显示的是Apple, Inc. Apple Mobile Device [Recovery Mode]，说明你没有进入到 DFU 模式。请再尝试一次，直到出现Apple, Inc. Mobile Device (DFU Mode)。

如果提示ERROR: Device failed to enter restore mode. Please make sure that usbmuxd is running.请尝试再次运行`sudo usbmuxd`命令。

