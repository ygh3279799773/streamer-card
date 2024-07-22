const express = require('express');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt({
    breaks: true
})

// 请求端口
let port = 3003;
// 请求基础地址（末尾必须携带 / ）
// 如果你正在使用vpn，建议将服务器替换为：https://www.streamertextcard.com/en
const url = 'https://fireflycard.shushiai.com/';
// const url = 'http://192.168.113.75:3000/';
// 清晰度设置（值越大越清晰，同时也意味着图片尺寸越大）
const scale = 2

const app = express();

const jsonParser = express.json();
const urlEncodeParser = express.urlencoded({extended: false});

let browser = null
let page = null

let browserWSEndpoint = null
async function getBrowserWsEndpoint() {
    if (!browser) {
        const baseBrowser = await puppeteer.launch({
            // args: ['--no-sandbox', '--disable-setuid-sandbox'],
            args: [
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote'
            ],
            headless: true
        });
        browserWSEndpoint = baseBrowser.wsEndpoint();
    }
    return browserWSEndpoint
}

async function closeHandler() {
    try {
        if (page) {
            await page.close();
            page = null
        }
        if (browser) {
            await browser.close();
            browser = null
        }
    } catch {
        return Promise.resolve()
    }
}

app.post('/saveImg', [jsonParser, urlEncodeParser], async (req, res) => {
    try {
        const body = req.body;
        let iconSrc = body?.icon;
        let params = '';
        if (body) {
            params += '?isAPI=true&';
            let idleArr = [];
            let blackArr = ['icon', 'switchConfig', 'content'];
            for (const key in body) {
                if (!blackArr.includes(key)) {
                    idleArr.push(`${key}=${body[key]}`);
                } else if (key === 'switchConfig') {
                    idleArr.push(`${key}=${JSON.stringify(body[key])}`);
                }
            }
            params += idleArr.join('&');
        }
        await closeHandler()
        browser = await puppeteer.launch({
            args: [
                '--disable-gpu',
                '--disable-extensions',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '–single-process'
            ],
            headless: true
        });
        page = await browser.newPage();
        await page.setRequestInterception(true)
        page.on('request', req => {
            if (req.resourceType() === 'font') {
                req.abort()
            } else {
                req.continue()
            }
        })
        const viewPortConfig = {
            width: 1920,
            height: 1080
        }
        await page.setViewport(viewPortConfig);
        await page.goto(url + params, {
            timeout: 30000,
            // waitUntil: 'networkidle0'
            waitUntil: [
                'load',              //等待 “load” 事件触发
                'domcontentloaded',  //等待 “domcontentloaded” 事件触发
                'networkidle0',      //在 500ms 内没有任何网络连接
                'networkidle2'       //在 500ms 内网络连接个数不超过 2 个
            ]
        });
        // 项目中存在一些异步加载的情况，需要等待加载完成
        const cardElement = await page.$(`#${body.temp || 'tempA'}`);
        if (!cardElement) {
            await closeHandler()
            return res.status(500).send('请求的卡片不存在');
        }
        if (body?.content) {
            let html = ''
            try {
                html = md.render(body.content).replace(/\n$/, '');
            } catch (e) {
                console.log('转换失败！', e)
                html = body.content
            }
            await page.evaluate((html) => {
                const contentEl = document.body.querySelector('[name = showContent]')
                if (contentEl) {
                    try {
                        contentEl.innerHTML = html
                    } catch (e) {
                        contentEl.innerHTML = html
                    }
                }
            }, html)
        }
        if (iconSrc && iconSrc.startsWith('http')) {
            await page.evaluate(async (imgSrc) => {
                const loadImage = () => {
                    return new Promise((resolve) => {
                        const imageElement = document.querySelector('#icon');
                        if (imageElement) {
                            imageElement.src = imgSrc;
                            imageElement.addEventListener('load', () => {
                                resolve(true);
                            });
                            imageElement.addEventListener('error', () => {
                                resolve(true);
                            });
                        } else {
                            resolve(false);
                        }
                    });
                };
                return loadImage();
            }, iconSrc);
        }
        const boundingBox = await cardElement.boundingBox();
        if (boundingBox.height > viewPortConfig.height) {
            await page.setViewport({
                width: 1920,
                height: Math.floor(boundingBox.height)
            })
        }
        let buffer = null;
        if (boundingBox) {
            buffer = await page.screenshot({
                type: 'png',
                clip: {
                    scale,
                    x: boundingBox.x,
                    y: boundingBox.y + 0.5,
                    width: boundingBox.width,
                    height: boundingBox.height,
                }
            });
        }
        await closeHandler()
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(buffer);
    } catch (error) {
        await closeHandler()
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
