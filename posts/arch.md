---
title: 较先进的 Arch Linux 安装指南
publish_date: 2023-08-09
tags: ["Linux"]
---

Arch Linux 是一个独立开发的 x86-64 通用 GNU/Linux 发行版, 采用滚动更新，它有轻量化、简单的特点，因此在个人用户中很受欢迎。

在接下来的学习中，你将感受到 Linux 及命令行的魅力，体验纯粹、自由、开放的系统体验。但自由意味着要能够控制自己的生活，当你用它们来做重要事情则更是如此。

# 安装前的准备

## 获取系统镜像

准备一个U盘。

Arch Linux 提供了官方的启动盘系统来支持系统的安装。虽然官网提供了种子和磁力链接来下载，但是在国内最好是从高校的开源软件镜像站里下载。下面以清华大学的镜像站为例：

打开官网 https://mirrors.tuna.tsinghua.edu.cn/

- 找到 获取下载链接
- 选择安装发行版为 Archlinux，并获取ISO文件
- 在 Windows 系统里下载Rufus
- 在 Rufus 软件里将系统刻录进U盘


## (可暂时跳过)终端编辑器的使用

### VIM

vim 是 Linux 最优雅最常用的编辑器。


vim 1.txt    #创建并编辑名为1.txt的文件
此时你处在 vim 的命令模式。在命令模式下，可以用一些快捷指令来对文本进行操作。 下面介绍一些在命令模式下常用的命令:

```shell
:w    # 保存
:wq    # 保存退出
:q!    # 不保存，强制退出
dd    # 删除一行
2dd    # 删除两行
gg    # 回到文本第一行
shift+g    # 转到文本最后一行
/xxx    # 在文中搜索内容'xxx' 回车搜索，按n键转到下一个
?xxx    # 反向搜索
u    # 撤销修改
```

按下v键进入选择模式，按y键完成拷贝，按p执行粘贴。

按下i键就可以进入插入模式，输入的文本会插入在光标后面。当我们编辑完成后，可以按 ESC 键回到命令模式，输入:wq再回车即可保存并退出编辑器。

需要完整教程的读者可以在终端中输入命令vimtutor来学习完整的 vim 教程。

### NANO
nano 被大多数 Linux 发行版内置。nano 十分简单，只要看软件内提示的快捷键就可以掌握。不熟悉 VIM 的可以用 nano 完成本教程。

## 进入主板 BIOS 进行设置
插入U盘并开机。在开机的时候，按 F10/DEL 等(取决与你的主板型号，具体请查阅你主板的相关信息)按键，进入主板的 BIOS 设置界面。

在类似名为 security 的选项卡中，找到一项名为 Secure Boot(名称可能略有差异)的选项，选择 Disable 将其禁用。

最后保存 BIOS 设置并退出，一般的按键是 F10。

# 安装系统

按 F9 (取决与你的主板型号，具体请查阅你主板的相关信息)按键，选择你的U盘。

基础安装
(可选)setfont ter-132b此命令将更改字体更大

## 连接网络

对于有线连接来说，直接插入网线即可。

对于无线连接，则需进行如下操作进行网络连接：

输入`iwctl`进入控制台。

```shell
device list    #列出设备名，比如无线网卡看到叫 wlan0
station wlan0 scan    #扫描网络
station wlan0 get-networks    #列出网络 比如想连接YOUR-WIRELESS-NAME这个无线
station wlan0 connect YOUR-WIRELESS-NAME    #进行连接 输入密码即可
exit    #成功后exit退出
ping www.gnu.org  # 测试网络连接
```

## 分区

这里总共设置两个分区，是一个常用的方案。

```shell
分区： /efi 512MB
根目录： / 剩余全部
```

如果你使用 NVME 的固态硬盘，磁盘名称可能为nvme0n1。

输入`lsblk`显示分区情况找到你想安装的磁盘名称。下面以nvme0n1来演示。

```shell
parted /dev/nvme0n1 -- mklabel gpt    # 将磁盘类型转换为gpt, 如磁盘有数据会警告，输入yes即可
parted /dev/nvme0n1 -- mkpart primary 512MB 100%    # 根目录分区
parted /dev/nvme0n1 -- mkpart ESP fat32 1MB 512MB    # EFI 分区
parted /dev/nvme0n1 -- set 2 esp on    # 设置 EFI system partition (ESP)
```

## 格式化

```shell
mkfs.f2fs -l arch /dev/nvme0n1p1    # 格式化根目录为f2fs文件系统
mkfs.fat -F 32 -n boot /dev/nvme0n1p2    # 格式化efi分区
```

##挂载

在挂载时，挂载是有顺序的，先挂载根分区，再挂载 EFI 分区。

```shell
mount /dev/disk/by-label/arch  /mnt
mount --mkdir /dev/disk/by-label/boot /mnt/boot
```

## 设定镜像源

### 手动设置

```shell
echo 'Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch' > /etc/pacman.d/mirrorlist  # 这里填的是清华的镜像.
```
### 自动设置

```shell
reflector --country China --age 72 --sort rate --protocol https --save /etc/pacman.d/mirrorlist
```

完成后输入`pacman -Sy`更新本地的包数据库。

## 安装系统软件包

```shell
pacstrap /mnt base base-devel linux linux-headers linux-firmware git vim intel-ucode f2fs-tools networkmanager alsa-utils pipewire-pulse wqy-zenhei
```

如果电脑使用AMD芯片，则将intel-ucode改成amd-ucode。

(可选)你可以在 /etc/pacman.conf 配置文件中将 #ParallelDownloads = 5 中的注释#去掉以开启多线程下载。

## 生成 fstab 文件
 
fstab 用来定义磁盘分区。

```shell
genfstab -U /mnt >> /mnt/etc/fstab
```

## 切换环境到新系统

```shell
arch-chroot /mnt
```

## 本地化

如下设置上海时区:

```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

更新硬件时间

```shell
hwclock --systohc
```

设置语言：

```shell
vim /etc/locale.gen    # 删除"#en_US.UTF-8 UTF-8"和"#zh_CN.UTF-8 UTF-8"的"#"以取消注释. 命令模式下输入“/”可以搜索，比如/en_US，按下回车可以确定搜索内容.
locale-gen
echo 'LANG=en_US.UTF-8' > /etc/locale.conf
```

## 设置主机名

加入你想为主机取的主机名，这里比如叫 arch。

```shell
echo 'arch' > /etc/hostname
10.配置hosts
vim /etc/hosts
#    加入如下内容
#    127.0.0.1   localhost
#    ::1         localhost
#    127.0.1.1   arch
```

## 创建新用户

```shell
useradd -m -G wheel -s /bin/bash alice
```


-m: 这个属性会在没有用户文件夹时创建用户文件夹。文中这将给用户 “alice” 创建位于 /home/alice的用户文件夹。

-G wheel： 将用户添加到“wheel“组。

-s /bin/bash: 设置登录的shell程序。

## 设置用户密码

```shell
passwd root
#    请输入root的密码

passwd alice
#    请输入新建用户的密码
```

## 给用户设置sudo执行权限

```shell
EDITOR=vim visudo
#    找到下面这样的一行，把前面的注释符号 # 去掉，:wq 保存并退出即可
#    %wheel ALL=(ALL:ALL) ALL
```

## 配置引导程序

创建 EFI 引导

```shell
bootctl install
```

编辑 EFI 引导内容

```shell
vim /boot/loader/loader.conf 
#    内容如下：
#    default arch
#    timeout 0
#    console-mode max
#    editor no
```

Arch Linux 启动项配置

```shell
vim /boot/loader/entries/arch.conf
#    内容如下：
#    title       Arch Linux
#    linux       /vmlinuz-linux
#    initrd      /intel-ucode.img
#    initrd      /initramfs-linux.img
#    options     root=LABEL=arch rw quiet splash vt.global_cursor_default=0
```

## 更新内核时自动更新efi分区

```shell
systemctl enable systemd-boot-update
```

系统安装部分已经结束，请输入exit退出新系统再输入reboot之后拔掉U盘进入新系统。

# 安装后的配置

进入系统后，输入root并再输入root密码以登录root用户。

## 配置网络

```shell
systemctl enable NetworkManager --now    # 开启网络管理器服务
nmcli dev wifi connect YOUR-WIRELESS-NAME password ********    # 请将"YOUR-WIRELESS-NAME"和"********"分别更换成你的WiFi名和密码
```

```shell
ping www.gnu.org    # 测试网络是否连通
```

## 配置自定义镜像源

编辑 /etc/pacman.conf，并在最末尾加入以下内容：

```shell
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch

```
导入 GPG 签名以防止软件因为签名问题安装失败：

```shell
pacman -Sy
pacman -S archlinuxcn-keyring
```

## 安装 AUR 助手

AUR 助手可以帮助安装非官方镜像站提供的安装包，比如QQ。

```shell
pacman -S paru
```

## 安装 Hyprland 桌面以及相关插件

```shell
paru -S hyprland waybar rofi brightnessctl kitty hyprpaper
```

## 配置显示管理器

```shell
paru -S ly
systemctl enable ly
```

输入`reboot`重启电脑。

重启输入新建用户的用户名和密码，进入桌面，并按super键和Q键打开终端。

## 配置桌面

```shell
git clone https://github.com/ityspace/config.git    # 速度如果较慢可把链接改成 "https://ghproxy.com/https://github.com/ityspace/config.git"
mkdir -p ~/.local/share
mkdir ~/Pictures
cd config
cp -r hypr kitty rofi waybar ~/.config
cp -r fonts icons ~/.local/share
cp wallpaper.png ~/Pictures
```

现在可以正常使用了。
