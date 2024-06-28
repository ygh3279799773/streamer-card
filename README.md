<div align="center">
<a href="https://fastgpt.in/"><img src="./assets/logo.png" width="120" height="120" alt="fastgpt logo"></a>
</div>

<h2 align="center">流光卡片 API</h2>

通过流光卡片 API 你可以通过使用将精美卡片生成对接到您的程序，或者业务流中，例如批量生成精美卡片营销内容等等

<p align="center">
  <a href="./README_en.md">English</a> |
  <a href="./README.md">简体中文</a>
</p>

<h2>🧩视频教程</h2>

在根据目录下的 .video 后缀就是演示了

<a href='./tudemo_video.mp4' >教程演示</a>



## 🛸 在线使用

- 海外版：https://www.streamertextcard.com/en
- 国内版：https://fireflycard.shushiai.com/zh

| ![image-20240628123650052](./assets/image-20240628123650052.png) | ![image-20240628123820134](./assets/image-20240628123820134.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20240628123715055](./assets/image-20240628123715055.png) | ![image-20240628123741010](./assets/image-20240628123741010.png) |



## 👨‍💻 使用

项目技术栈：Node + Express + Puppeteer

注意node版本必须大于18

##### 使用方式

```bash
# 安装依赖：
yarn install

#运行示例：
node example1.js 
```

##### 接口说明 POST /saveImg

##### 参数说明

| 字段名        | 类型   | 描述                                    |
| ------------- | ------ | --------------------------------------- |
| temp          | String | 模板选择，目前仅有：tempA、tempB、tempC |
| `color`       | String | 颜色，请看下方颜色配置                  |
| `icon`        | String | 图标                                    |
| `title`       | String | 卡片 title                              |
| `date`        | String | 时间显示                                |
| `content`     | String | 卡片正文                                |
| `foreword`    | String | 前言                                    |
| `author`      | String | 作者                                    |
| `qrcodetitle` | String | 二维码头部                              |
| `qrcodetext`  | String | 二维码描述文字                          |
| `qrcode`      | String | 你的二维码链接                          |
| `watermark`   | String | 水印                                    |
| switchConfig  | Object | 展示控制                                |

##### switchConfig 参数说明

| 字段名        | 类型    | 描述     |
| ------------- | ------- | -------- |
| showIcon      | Boolean | 图标显示 |
| showDate      | Boolean | 日期显示 |
| showTitle     | Boolean | 标题显示 |
| showContent   | Boolean | 文本显示 |
| showAuthor    | Boolean | 作者显示 |
| showTextCount | Boolean | 文本计数 |
| showQRCode    | Boolean | 二维码   |
| showForeword  | Boolean | 前言     |

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



## 如果你对我们感兴趣

推特：@huangzh65903362

即刻：https://web.okjike.com/u/ec41d7d5-407d-4395-ac8a-bd0f04fb202c

<img src="./assets/hzy_wx.jpg" alt="hzy_wx" style="zoom: 33%;" />



在根据目录下的 .video 后缀就是演示了

<a href='./tudemo_video.mp4' >教程演示</a>



## 🛸 在线使用

- 海外版：https://www.streamertextcard.com/en
- 国内版：https://fireflycard.shushiai.com/zh

| ![image-20240628123650052](./assets/image-20240628123650052.png) | ![image-20240628123820134](./assets/image-20240628123820134.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20240628123715055](./assets/image-20240628123715055.png) | ![image-20240628123741010](./assets/image-20240628123741010.png) |



## 👨‍💻 使用

项目技术栈：Node + Express + Puppeteer

注意node版本必须大于18

##### 使用方式

```bash
# 安装依赖：
yarn install

#运行示例：
node example1.js 
```

##### 接口说明 POST /saveImg

##### 参数说明

| 字段名        | 类型   | 描述                                    |
| ------------- | ------ | --------------------------------------- |
| temp          | String | 模板选择，目前仅有：tempA、tempB、tempC |
| `color`       | String | 颜色，请看下方颜色配置                  |
| `icon`        | String | 图标                                    |
| `title`       | String | 卡片 title                              |
| `date`        | String | 时间显示                                |
| `content`     | String | 卡片正文                                |
| `foreword`    | String | 前言                                    |
| `author`      | String | 作者                                    |
| `qrcodetitle` | String | 二维码头部                              |
| `qrcodetext`  | String | 二维码描述文字                          |
| `qrcode`      | String | 你的二维码链接                          |
| `watermark`   | String | 水印                                    |
| switchConfig  | Object | 展示控制                                |

##### switchConfig 参数说明

| 字段名        | 类型    | 描述     |
| ------------- | ------- | -------- |
| showIcon      | Boolean | 图标显示 |
| showDate      | Boolean | 日期显示 |
| showTitle     | Boolean | 标题显示 |
| showContent   | Boolean | 文本显示 |
| showAuthor    | Boolean | 作者显示 |
| showTextCount | Boolean | 文本计数 |
| showQRCode    | Boolean | 二维码   |
| showForeword  | Boolean | 前言     |

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



## 如果你对我们感兴趣

推特：@huangzh65903362

即刻：https://web.okjike.com/u/ec41d7d5-407d-4395-ac8a-bd0f04fb202c

<img src="./assets/hzy_wx.jpg" alt="hzy_wx" style="zoom: 33%;" />

