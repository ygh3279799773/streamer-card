# 流光卡片API 使用文档



## 项目说明

此项目使用 Node.js、Express 和 Puppeteer 构建，通过提供一组 API 来生成和保存带有特定信息的卡片图像。确保你的 Node.js 版本大于 18 以保证项目正常运行。

项目跑起来后，可以使用ApiPost使用或其他工具



## 技术栈

- **Node.js** (必须大于 18)
- **Express**
- **Puppeteer**



## 使用方式

```bash
# 安装依赖：
yarn install

#运行示例：
node example1.js 
```



## 接口说明

### POST /saveImg

#### 请求字段

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

#### switchConfig参数说明

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

#### color参数说明

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



#### 请求示例

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



#### 响应示例

> 会直接响应二进制图片

