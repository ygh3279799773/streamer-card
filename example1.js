const express = require('express');
const puppeteer = require('puppeteer')

const app = express();
const jsonParser = express.json()
const urlEncodeParser =express.urlencoded({ extended: false })

function waitForTransition(page, selector) {
    return page.evaluate(selector => {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) {
                const onTransitionEnd = () => {
                    element.removeEventListener('transitionend', onTransitionEnd);
                    resolve(true);
                };
                element.addEventListener('transitionend', onTransitionEnd);
            } else {
                resolve(false);
            }
        });
    }, selector);
}

app.post('/saveImg', [jsonParser, urlEncodeParser], async (req, res) => {
    const body = req.body
    let iconSrc = body?.icon
    let params = ''
    if (body) {
        params += '?'
        let idleArr = []
        let blackArr = ['icon', 'switchConfig']
        for (const key in body) {
            if (!blackArr.includes(key)) {
                idleArr.push(`${key}=${body[key]}`)
            } else if (key === 'switchConfig') {
                idleArr.push(`${key}=${JSON.stringify(body[key])}`)
            }
        }
        params += idleArr.join('&')
    }
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    const url = `https://fireflycard.shushiai.com/zh${params}`
    await page.goto(url)
    await page.setViewport({width: 1920, height: 1080});
    if (iconSrc && iconSrc.startsWith('http')) {
        await page.evaluate(async (imgSrc) => {
            const imageElement = document.querySelector('#icon')
            if (imageElement) {
                imageElement.src = imgSrc;
                await new Promise((resolve, reject) => {
                    imageElement.addEventListener('load', () => {
                        resolve(true)
                    })
                    imageElement.addEventListener('error', () => {
                        resolve(true)
                    })
                });
            }

        }, iconSrc);
    }
    // 等待动画渲染（由于我们的网站中切换也是使用到了一些动画，不等待的情况下无法切换颜色）
    await waitForTransition(page, 'body');
    const cardElement = await page.$(`#${body.temp || 'tempA'}`);
    if (!cardElement) {
        return res.status(500).send('请求的卡片不存在')
    }
    try {
        const boundingBox = await cardElement.boundingBox();
        let buffer = null
        if (boundingBox) {
            buffer = await page.screenshot({
                type: 'png',
                clip: {
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: boundingBox.width,
                    height: boundingBox.height,
                }
            })
        }
        await cardElement.dispose()
        await browser.close()
        res.setHeader('Content-Type', 'image/png')
        return res.status(200).send(buffer)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.listen(3000, () => {
    console.log('Listening on port 3000...');
})
