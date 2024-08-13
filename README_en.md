<div align="center">
<a href="https://fastgpt.in/"><img src="./assets/logo.png" width="120" height="120" alt="fastgpt logo"></a>
</div>

<h2 align="center">Streamer Card API</h2>

With the Streamer Card API, you can integrate the generation of beautiful cards into your applications or workflows, such as bulk generating marketing content with stunning cards.

<p align="center">
  <a href="./README_en.md">English</a> |
  <a href="./README.md">简体中文</a>
</p>

## 🛸 Online Usage

- Overseas version: https://www.streamertextcard.com/en
- Domestic version: https://fireflycard.shushiai.com/zh

| ![image-20240628123650052](./assets/image-20240628123650052.png) | ![image-20240628123820134](./assets/image-20240628123820134.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20240628123715055](./assets/image-20240628123715055.png) | ![image-20240628123741010](./assets/image-20240628123741010.png) |

## API Implementation Principles

### Project Tech Stack: Node.js + Express + Puppeteer

So, what exactly are Express and Puppeteer?

- **Express**: Used for creating web servers and handling HTTP requests.
- **Puppeteer**: Used for controlling headless browsers (like Chrome) to perform automated web operations. **(This is the key technology in this stack)**

In a nutshell, the principle behind this API is to use a library similar to a web scraper to automate tasks. It opens Puppeteer, modifies the text, images, and other information on a card, and then takes a screenshot of the card to send back to the frontend. You can achieve this functionality with other similar tech stacks, such as:

- Python + Flask/Django + Selenium/Playwright
- Java + Spring Boot + Selenium
- .....

In essence, you can rewrite this API in any language you prefer. The principle is straightforward: find a library that can open a browser, capture a screenshot of a specified element, and respond to the frontend.

However, in this open-source project, we've made some optimizations for concurrent scenarios, such as adding a retry mechanism and incorporating puppeteer-cluster to manage browser instances.

## 👨‍💻 Usage

##### Note:

- Node version must be greater than 18.
- If you are outside mainland China or have a VPN enabled, switch the server to the overseas version as indicated in the code to avoid request timeouts.

##### Usage Instructions

```bash
# Install dependencies:
yarn install

# Run example:
node index.ts 
```

##### API Endpoint: POST /saveImg

##### Parameters

| Field          | Type   | Description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| `temp`         | String | Template selection, currently available: tempA, tempB, tempC |
| `color`        | String | Color, see the color configuration below                     |
| `icon`         | String | Icon                                                         |
| `title`        | String | Card title                                                   |
| `date`         | String | Date display                                                 |
| `content`      | String | Card content                                                 |
| `foreword`     | String | Foreword                                                     |
| `author`       | String | Author                                                       |
| `qrcodetitle`  | String | QR code title                                                |
| `qrcodetext`   | String | QR code description text                                     |
| `qrcode`       | String | Your QR code link                                            |
| `qrcodeImg`    | String | Your QR code image (takes priority over `qrcode`, choose one) |
| `watermark`    | String | Watermark                                                    |
| `switchConfig` | Object | Display control                                              |
| `width`        | String | Width                                                        |
| `padding`      | String | Padding                                                      |
| `fontScale`    | String | Font size ratio (e.g., 1.2, 1.4, etc.)                       |

##### switchConfig Parameters

| Field           | Type    | Description        |
| --------------- | ------- | ------------------ |
| `showIcon`      | Boolean | Display icon       |
| `showDate`      | Boolean | Display date       |
| `showTitle`     | Boolean | Display title      |
| `showContent`   | Boolean | Display content    |
| `showAuthor`    | Boolean | Display author     |
| `showTextCount` | Boolean | Display text count |
| `showQRCode`    | Boolean | Display QR code    |
| `showForeword`  | Boolean | Display foreword   |

##### color Parameters

```
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

##### Request Example

```
{
    "temp": "tempB",
    "color": "dark-color-2",
    "icon": "https://img0.baidu.com/it/u=2752111444,4073693972&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1719507600&t=884a9a2b95e90dc7f959911fe3dc7613",
    "title": "👋 hi 你好",
    "date": "2024/6/24 14:41",
    "content": "This is a tool for generating beautiful cards that make your information stand out on social media. You are here for it. 💡 You can enter text here to try it out, **supporting Markdown syntax**, taking effect in real time.",
    "foreword": "Text Card Tool",
    "author": "魔王",
    "textcount": "Word Count",
    "qrcodetitle": "Streamer Card",
    "qrcodetext": "Scan the QR code",
    "qrcode": "https://fireflycard.shushiai.com/",
    "watermark": "Streamer Card",
    "switchConfig": {
        "showIcon": "false",
        "showForeword": "false"
    }
}
```

##### Response Example

> The response will be a binary image.

## If You Are Interested in Us

Twitter: @huangzh65903362

Jike: https://web.okjike.com/u/ec41d7d5-407d-4395-ac8a-bd0f04fb202c

<img src="./assets/hzy_wx.jpg" alt="hzy_wx" style="zoom: 33%;" /> ```
