<div align="center"> <a href="https://fastgpt.in/"><img src="./assets/logo.png" width="120" height="120" alt="fastgpt logo"></a> </div> <h2 align="center">Streamer Card API</h2>

With the Streamer Card API, you can integrate beautiful card generation into your programs or business workflows, such as batch generating attractive marketing content cards, and more.

<p align="center"> <a href="./README_en.md">English</a> | <a href="./README.md">简体中文</a> </p>

## 1. 🛸 Online Usage

- International version: https://www.streamertextcard.com/en
- China version: https://fireflycard.shushiai.com/zh

| ![image-20240628123650052](./assets/image-20240628123650052.png) | ![image-20240628123820134](./assets/image-20240628123820134.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20240628123715055](./assets/image-20240628123715055.png) | ![image-20240628123741010](./assets/image-20240628123741010.png) |


## 2. API Implementation Principle

Project tech stack: NodeJs + Express + Puppeteer

So, what are Express and Puppeteer?

- Express: Used for creating web servers and handling HTTP requests
- Puppeteer: Used for controlling headless browsers (like Chrome) for web page automation. **(This is the key technology stack)**

In short, the principle of this API is to use a library similar to web crawlers and automation to open Puppeteer, modify text, images, and other information on the card, and finally take a screenshot of the card to respond to the frontend. You can also implement this functionality using other similar tech stacks, such as:

- Python + Flask/Django + Selenium/Playwright
- Java + Spring Boot + Selenium
- .....

In essence, you can rewrite this API in your preferred language without any issues, as the principle is so simple: **Find a library that can open a browser, take a screenshot of a specific element, and then respond to the frontend.**

However, in this open-source project, some optimizations have been made for concurrent scenarios, such as adding a retry mechanism and introducing puppeteer-cluster to manage browser instances.

## 3. Common Issues

#### 3.1 Chinese Characters Garbled When Generating Images on Linux Deployment

The reason is that generally, the default fonts on Linux do not support Chinese. You need to install Chinese fonts yourself. For example, if you're using CentOS, you can try executing the following commands to solve the issue:

```sh
sudo yum install wqy-microhei-fonts.noarch -y
sudo yum install wqy-unibit-fonts.noarch -y
sudo yum install wqy-zenhei-fonts.noarch -y
```

Or you can search online for Chinese fonts.

<img src="./assets/image-20240729143113993.png" alt="image-20240729143113993" style="zoom:50%;" />

## 4. 👨‍💻 Usage

##### Note:

- Node version must be greater than 18
- If you are a non-mainland China user or have VPN enabled, please switch the server to the international version according to the prompts in the code to avoid request timeouts.

### Docker Execution

#### docker cli

#### Build

```bash
docker build -t ygh3279799773/streamer-card:latest .
```

#### Run

```bash
docker run -d --name streamer-card -p 3003:3003 --restart always ygh3279799773/streamer-card:latest
```

#### Stop

```bash
docker stop streamer-card
```

##### Usage Method

```bash
# Install dependencies:
yarn install

# Run example:
ts-node src/index.ts
or
node src/index.js
```

##### API Description POST /saveImg

##### Parameter Description

| Field Name       | Type    | Description                                                  |
| ---------------- | ------- | ------------------------------------------------------------ |
| `temp`           | String  | Template selection, currently only: tempA, tempB, tempC      |
| `color`          | String  | Color, see color configuration below                         |
| `icon`           | String  | Icon                                                         |
| `title`          | String  | Card title                                                   |
| `date`           | String  | Time display                                                 |
| `content`        | String  | Card body                                                    |
| `foreword`       | String  | Foreword                                                     |
| `author`         | String  | Author                                                       |
| `qrcodetitle`    | String  | QR code header                                               |
| `qrcodetext`     | String  | QR code description text                                     |
| `qrcode`         | String  | Your QR code link                                            |
| `qrcodeImg`      | String  | Your QR code image (higher priority than `qrcode`, choose one) |
| `watermark`      | String  | Watermark                                                    |
| `switchConfig`   | Object  | Display control                                              |
| `width`          | String  | Width, default is 340px                                      |
| `padding`        | String  | Inner padding                                                |
| `fontScale`      | String  | Text size ratio (e.g., 1.2 or 1.4)                           ****|****
| `useLoadingFont` | Boolean | Whether to load the template's default font, by default the API doesn't load fonts for faster requests |
| `useFont`        | String  | Specify font type, see font types below                      |
| `imgScale`       | String  | Image clarity, default is 2, higher value means clearer but longer download time |
| `isContentHtml`         | String  | Whether to use HTML parsing, default is false, uses MD syntax parsing |

#### useFont Font Types

| Font Name                 | Parameter Value           |
| ------------------------- | ------------------------- |
| Default                   | Source_Han_Sans_SC        |
| Source Han Serif-SemiBold | SourceHanSerifCN_SemiBold |
| Source Han Serif-Bold     | SourceHanSerifCN_Bold     |
| Canger Yuyang W03         | CangErYuYangTiW03         |
| Huiwen Mincho             | Huiwen_mingchao           |
| Zhuque Fangsong           | ZhuqueFangsong            |
| Xiaomi-Light              | MiSans-Light              |
| Xiaomi-Normal             | MiSans-Thin               |
| Xiaomi-ExtraLight         | MiSans-ExtraLight         |
| Douyin Beautiful          | DouyinSansBold            |

##### switchConfig Parameter Description

| Field Name      | Type                            | Description    |
| --------------- | ------------------------------- | -------------- |
| `showIcon`      | String, options: "true","false" | Icon display   |
| `showDate`      | String, options: "true","false" | Date display   |
| `showTitle`     | String, options: "true","false" | Title display  |
| `showContent`   | String, options: "true","false" | Text display   |
| `showAuthor`    | String, options: "true","false" | Author display |
| `showTextCount` | String, options: "true","false" | Text count     |
| `showQRCode`    | String, options: "true","false" | QR code        |
| `showForeword`  | String, options: "true","false" | Foreword       |

##### color Parameter Description

[List of color options omitted for brevity]

##### Request Example

```json
{
    "temp": "tempB",
    "color": "dark-color-2",
    "icon": "https://img0.baidu.com/it/u=2752111444,4073693972&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1719507600&t=884a9a2b95e90dc7f959911fe3dc7613",
    "title": "👋 hi Hello",
    "date": "2024/6/24 14:41",
    "content": "This is a beautiful card tool that can make your information stand out on social media. You're probably here for this reason. 💡 You can try entering text here, **Markdown syntax is supported**, and it takes effect in real-time.",
    "foreword": "Text Card Tool",
    "author": "By the Demon King",
    "textcount": "Word Count",
    "qrcodetitle": "Streamer Card",
    "qrcodetext": "Scan QR Code",
    "qrcode": "https://fireflycard.shushiai.com/",
    "watermark": "Firefly Card",
    "switchConfig": {
        "showIcon": "false",
        "showForeword": "false"
    }
}
```

##### Response Example

> Will directly respond with a binary image

## 5. If You're Interested in Us

Twitter: @huangzh65903362

Jike: https://web.okjike.com/u/ec41d7d5-407d-4395-ac8a-bd0f04fb202c

<img src="./assets/hzy_wx.jpg" alt="hzy_wx" style="zoom: 33%;" />
