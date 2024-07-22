const express = require('express');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({ breaks: true });

const port = 3003;
// const url = 'https://fireflycard.shushiai.com/';
const url = 'http://192.168.113.93:3000/';
const scale = 2;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let browser;

async function launchBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            args: [
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote'
            ],
            headless: true
        });
    }
    return browser;
}

async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

app.post('/saveImg', async (req, res) => {
    let page;
    try {
        const body = req.body;
        let iconSrc = body.icon;
        let qrcodeSrc = body.qrcodeImg;
        let params = new URLSearchParams({ isAPI: true });
        let blackArr = ['icon', 'switchConfig', 'content'];

        for (const key in body) {
            if (!blackArr.includes(key)) {
                params.append(key, body[key]);
            } else if (key === 'switchConfig') {
                params.append(key, JSON.stringify(body[key]));
            }
        }

        await launchBrowser();
        page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', req => {
            if (req.resourceType() === 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        const viewPortConfig = { width: 1920, height: 1080 };
        await page.setViewport(viewPortConfig);
        await page.goto(url + '?' + params.toString(), {
            timeout: 60000,
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });

        const cardElement = await page.$(`#${body.temp || 'tempA'}`);
        if (!cardElement) {
            throw new Error('Requested card does not exist');
        }

        if (body.content) {
            const html = md.render(body.content).replace(/\n$/, '');
            await page.evaluate(html => {
                const contentEl = document.querySelector('[name="showContent"]');
                if (contentEl) contentEl.innerHTML = html;
            }, html);
        }

        if (iconSrc && iconSrc.startsWith('http')) {
            await page.evaluate(async imgSrc => {
                const loadImage = () => {
                    return new Promise(resolve => {
                        const imageElement = document.querySelector('#icon');
                        if (imageElement) {
                            imageElement.src = imgSrc;
                            imageElement.addEventListener('load', () => resolve(true));
                            imageElement.addEventListener('error', () => resolve(true));
                        } else {
                            resolve(false);
                        }
                    });
                };
                return loadImage();
            }, iconSrc);
        }
        if (qrcodeSrc && qrcodeSrc.startsWith('http')) {
            await page.evaluate(async imgSrc => {
                const loadImage = () => {
                    return new Promise(resolve => {
                        const imageElement = document.querySelector('[name="qrcodeImg"]');
                        if (imageElement) {
                            imageElement.src = imgSrc;
                            imageElement.addEventListener('load', () => resolve(true));
                            imageElement.addEventListener('error', () => resolve(true));
                        } else {
                            resolve(false);
                        }
                    });
                };
                return loadImage();
            }, qrcodeSrc);
        }

        const boundingBox = await cardElement.boundingBox();
        if (boundingBox.height > viewPortConfig.height) {
            await page.setViewport({ width: 1920, height: Math.ceil(boundingBox.height) });
        }

        const buffer = await page.screenshot({
            type: 'png',
            clip: {
                x: boundingBox.x,
                y: boundingBox.y + 0.5,
                width: boundingBox.width,
                height: boundingBox.height,
                scale: scale
            }
        });

        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send(error.toString());
    } finally {
        if (page) {
            await page.close();
        }
    }
});

process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit();
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
