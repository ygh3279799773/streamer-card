const express = require('express');
const puppeteer = require('puppeteer');

// 请求端口
let port = 3002;
// 请求基础地址（末尾必须携带 / ）
// 如果你正在使用vpn，建议将服务器替换为：https://www.streamertextcard.com/en
const url = 'https://fireflycard.shushiai.com/';
// 清晰度设置（值越大越清晰，同时也意味着图片尺寸越大）
const scale = 3

const app = express();

const jsonParser = express.json();
const urlEncodeParser = express.urlencoded({ extended: false });

function delayMission() {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    })
}

app.post('/saveImg', [jsonParser, urlEncodeParser], async (req, res) => {
    try {
        const body = req.body;
        let iconSrc = body?.icon;
        let params = '';
        if (body) {
            params += '?';
            let idleArr = [];
            let blackArr = ['icon', 'switchConfig'];
            for (const key in body) {
                if (key === 'content') {
                    idleArr.push(`${key}=${encodeURIComponent(body[key])}`);
                } else if (!blackArr.includes(key)) {
                    idleArr.push(`${key}=${body[key]}`);
                } else if (key === 'switchConfig') {
                    idleArr.push(`${key}=${JSON.stringify(body[key])}`);
                }
            }
            params += idleArr.join('&');
        }
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url + params);
        await page.setViewport({ width: 1920, height: 1080 });
        // 项目中存在一些异步加载的情况，需要等待加载完成
        await delayMission()
        const cardElement = await page.$(`#${body.temp || 'tempA'}`);
        if (!cardElement) {
            await browser.close();
            return res.status(500).send('请求的卡片不存在');
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
        let buffer = null;
        if (boundingBox) {
            buffer = await page.screenshot({
                type: 'png',
                clip: {
                    scale,
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: boundingBox.width,
                    height: boundingBox.height,
                }
            });
        }
        await browser.close();
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(buffer);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
