<div align="center">
<a href="https://fastgpt.in/"><img src="./assets/logo.png" width="120" height="120" alt="fastgpt logo"></a>
</div>

<h2 align="center">流光卡片 API</h2>

通过流光卡片 API 你可以通过使用将精美卡片生成对接到您的程序，或者业务流中，例如批量生成精美卡片营销内容等等

<p align="center">
  <a href="./README_en.md">English</a> |
  <a href="./README.md">简体中文</a>
</p>
## 1、🛸 在线使用

- 海外版：https://www.streamertextcard.com/en
- 国内版：https://fireflycard.shushiai.com/zh

| ![image-20240628123650052](./assets/image-20240628123650052.png) | ![image-20240628123820134](./assets/image-20240628123820134.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20240628123715055](./assets/image-20240628123715055.png) | ![image-20240628123741010](./assets/image-20240628123741010.png) |



## 2、API 实现原理

项目技术栈：NodeJs + Express + Puppeteer

话说回来，Express 和 puppeteer 又是什么东西？

- Express：用于创建Web服务器和处理HTTP请求
- Puppeteer：用于控制无头浏览器（如Chrome）进行网页的自动化操作。**（重点是这个技术栈）**

一句话说明，这个 API 的原理就是通过类似爬虫，自动化的库，打开 Puppeteer 然后修改卡片上的文本，图像等信息，最后对卡片进行截图，响应给前端，你也可以通过其他相似的技术栈来实现这个功能，比如：

- Python + Flask/Django + Selenium/Playwright
- Java + Spring Boot + Selenium
- .....

总之你可以使用你喜欢的语言重写这个 API 也是完全没问题的，毕竟原理就是如此简单，**找一个库，可以打开浏览器，然后截图指定元素，最后响应前端。**

不过在本开源项目中还针对并发场景做了一些优化，比如增加了重试机制，引入了 puppeteer-cluster 来管理浏览器实例

## 3、常见问题

#### 3.1、部署 Linux 生成图片中文乱码

原因是因为一般 Linux 默认字体不支持中文，需要自己安装中文字体，比如你是 centOS，你可以尝试执行以下命令解决：

```sh
sudo yum install wqy-microhei-fonts.noarch -y
sudo yum install wqy-unibit-fonts.noarch -y
sudo yum install wqy-zenhei-fonts.noarch -y
```

或者自己上网搜一下中文字体即可

<img src="./assets/image-20240729143113993.png" alt="image-20240729143113993" style="zoom:50%;" />





## 4、👨‍💻 使用

##### 注意：

- node版本必须大于18
- 如果非中国大陆用户或开启了VPN，请根据代码中的提示将服务器切换至海外版避免请求超时

### Docker执行

#### docker cli

#### 编译

```bash
docker build -t ygh3279799773/streamer-card:latest .
```

#### 运行

```bash
docker run -d --name streamer-card -p 3003:3003 --restart always ygh3279799773/streamer-card:latest
```

#### 停止

```bash
docker stop streamer-card
```

##### 使用方式

```bash
# 安装依赖：
yarn install

#运行示例：
ts-node src/index.ts
or
node src/index.js
```

##### 接口说明 POST /saveImg

##### 参数说明

| 字段名              | 类型      | 描述                                    |
|------------------|---------|---------------------------------------|
| `temp`           | String  | 模板选择，目前仅有：tempA、tempB、tempC           |
| `color`          | String  | 颜色，请看下方颜色配置                           |
| `icon`           | String  | 图标                                    |
| `title`          | String  | 卡片 title                              |
| `date`           | String  | 时间显示                                  |
| `content`        | String  | 卡片正文                                  |
| `foreword`       | String  | 前言                                    |
| `author`         | String  | 作者                                    |
| `qrcodetitle`    | String  | 二维码头部                                 |
| `qrcodetext`     | String  | 二维码描述文字                               |
| `qrcode`         | String  | 你的二维码链接                               |
| `qrcodeImg`      | String  | 你的二维码图片（优先级比`qrcode`高，选其一即可）          |
| `watermark`      | String  | 水印                                    |
| `switchConfig`   | Object  | 展示控制                                  |
| `width`          | String  | 宽度，最小 300                             |
| `height`         | String  | 高度                                    |
| `padding`        | String  | 内边距                                   |
| `fontScale`      | String  | 文字大小比例（例如传入1.2或者1.4等）                 |
| `useLoadingFont` | Boolean | 是否加载模板默认字体，默认情况下 api 为了更快的请求速度是不加载字体的 |
| `useFont`        | String  | 指定字体类型，字体类型，往下翻                       |
| `imgScale`       | String  | 图片清晰度，默认为 2，数值越大越清晰，同时下载时间也更长         |
| `isContentHtml`  | String  | 是否使用 html 解析，默认为 false，使用 md 语法解析     |

#### useFont 字体类型

| 字体名称          | 参数value                  |
|---------------|--------------------------|
| 默认            | Source_Han_Sans_SC       |
| 思源宋体-SemiBold | SourceHanSerifCN_SemiBold |
| 思源宋体-Bold     | SourceHanSerifCN_Bold    |
| 仓耳渔阳体W03      | CangErYuYangTiW03        |
| 汇文明朝体         | Huiwen_mingchao          |
| 朱雀仿宋          | ZhuqueFangsong           |
| 小米-Light      | MiSans-Light             |
| 小米-Normal     | MiSans-Thin              |
| 小米-ExtraLight | MiSans-ExtraLight        |
| 抖音美好体         | DouyinSansBold           |

##### switchConfig 参数说明

| 字段名          | 类型                         | 描述     |
| --------------- | ---------------------------- | -------- |
| `showIcon`      | 字符串，可选："true","false" | 图标显示 |
| `showDate`      | 字符串，可选："true","false" | 日期显示 |
| `showTitle`     | 字符串，可选："true","false" | 标题显示 |
| `showContent`   | 字符串，可选："true","false" | 文本显示 |
| `showAuthor`    | 字符串，可选："true","false" | 作者显示 |
| `showTextCount` | 字符串，可选："true","false" | 文本计数 |
| `showQRCode`    | 字符串，可选："true","false" | 二维码   |
| `showForeword`  | 字符串，可选："true","false" | 前言     |

##### color参数说明

```js
[
    "dark-color-1",
    "dark-color-2",
    "light-blue-color-1",
    "light-blue-color-2",
    "light-blue-color-3",
    "light-blue-color-4",
    "light-blue-color-5",
    "light-blue-color-6",
    "light-blue-color-7",
    "light-blue-color-8",
    "light-blue-color-9",
    "light-blue-color-10",
    "light-blue-color-11",
    "light-blue-color-12",
    "light-blue-color-13",
    "light-blue-color-14",
    "light-blue-color-15",
    "light-blue-color-16",
    "light-red-color-1",
    "light-red-color-2",
    "light-red-color-3",
    "light-red-color-4",
    "light-red-color-5",
    "light-red-color-6",
    "light-red-color-7",
    "light-red-color-8",
    "light-red-color-9",
    "light-red-color-10",
    "light-red-color-11",
    "light-red-color-12",
    "light-red-color-13",
    "light-red-color-14",
    "light-red-color-15",
    "light-red-color-16",
    "light-green-color-1",
    "light-green-color-2",
    "light-green-color-3",
    "light-green-color-4",
    "light-green-color-5",
    "light-green-color-6",
    "light-green-color-7",
    "light-green-color-8",
    "light-green-color-9",
    "light-green-color-10",
    "light-green-color-11",
    "light-green-color-12",
    "light-green-color-13",
    "light-green-color-14",
    "light-green-color-15"
]
```

##### 请求示例

```json
{
    "temp": "tempB",
    "color": "dark-color-2",
    "icon": "https://img0.baidu.com/it/u=2752111444,4073693972&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1719507600&t=884a9a2b95e90dc7f959911fe3dc7613",
    "title": "👋 hi 你好",
    "date": "2024/6/24 14:41",
    "content": "这是一个能让你的信息在社交媒体一下子鹤立鸡群的精美卡片工具，相信你也是为此而来。💡 你可以在这里输入文字尝试一下，**支持 Markdown 语法**，实时生效。",
    "foreword": "文字卡片工具",
    "author": "是魔王的",
    "textcount": "字数",
    "qrcodetitle": "流光卡片",
    "qrcodetext": "扫描二维码",
    "qrcode": "https://fireflycard.shushiai.com/",
    "watermark": "流萤卡片",
    "switchConfig": {
        "showIcon": "false",
        "showForeword": "false"
    }
}
```

##### 响应示例

> 会直接响应二进制图片



## 5、如果你对我们感兴趣

推特：@huangzh65903362

即刻：https://web.okjike.com/u/ec41d7d5-407d-4395-ac8a-bd0f04fb202c

<img src="./assets/hzy_wx.jpg" alt="hzy_wx" style="zoom: 33%;" />























