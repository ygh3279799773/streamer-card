// 导入所需模块
const express = require('express'); // 用于创建Express应用
const puppeteer = require('puppeteer'); // 用于控制无头浏览器
const MarkdownIt = require('markdown-it'); // 用于将Markdown转换为HTML
const md = new MarkdownIt({ breaks: true }); // 初始化MarkdownIt实例，配置换行符转换

// 配置常量
const port = 3003; // 服务器监听的端口号
const url = 'https://fireflycard.shushiai.com/'; // 要访问的目标URL
const scale = 2; // 截图的缩放比例，图片不清晰就加大这个参数
const maxRetries = 3; // 处理请求的最大重试次数
const maxPages = 5; // 浏览器中允许同时打开的最大页面数

// 创建Express应用实例
const app = express();
app.use(express.json()); // 使用JSON中间件解析请求体
app.use(express.urlencoded({ extended: false })); // 使用URL编码中间件解析请求体

let browser; // 浏览器实例

// 启动浏览器实例并预热
async function launchBrowser() {
    if (!browser) {
        // 配置并启动Puppeteer浏览器实例
        browser = await puppeteer.launch({
            args: [
                '--disable-dev-shm-usage', // 禁用/dev/shm使用，以防止某些Docker环境中的问题
                '--disable-setuid-sandbox', // 禁用setuid沙箱
                '--no-first-run', // 禁用首次运行优化
                '--no-sandbox', // 禁用沙箱模式
                '--no-zygote' // 禁用zygote进程
            ],
            headless: true, // 启用无头模式
            protocolTimeout: 120000 // 设置协议超时时间为120秒
        });
        console.log('浏览器已启动');

        // 预热浏览器
        const page = await browser.newPage();
        await page.goto('about:blank');
        await page.close();
        console.log('浏览器已预热');
    }
    return browser;
}

// 关闭浏览器实例
async function closeBrowser() {
    if (browser) {
        await browser.close(); // 关闭浏览器
        browser = null; // 置空浏览器实例
        console.log('浏览器已关闭');
    }
}

// 延迟函数，用于重试机制
function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

// 获取可用页面
async function getPage() {
    // 新建一个页面
    const page = await browser.newPage();
    return page;
}

// 处理请求的主要逻辑
async function processRequest(req) {
    let page;
    try {
        const body = req.body; // 获取请求体
        console.log('处理请求，内容为:', JSON.stringify(body));
        let iconSrc = body.icon; // 图标源地址
        let qrcodeSrc = body.qrcodeImg; // 二维码图片源地址
        let params = new URLSearchParams({ isAPI: true }); // 初始化URL参数
        let blackArr = ['icon', 'switchConfig', 'content']; // 黑名单参数，不会直接加入URL

        // 将请求体中的参数添加到URL参数中
        for (const key in body) {
            if (!blackArr.includes(key)) {
                params.append(key, body[key]);
            } else if (key === 'switchConfig') {
                params.append(key, JSON.stringify(body[key]));
            }
        }

        await launchBrowser(); // 启动浏览器
        page = await getPage(); // 获取新建页面
        console.log('新页面已创建');

        // 设置请求拦截，阻止字体文件请求
        await page.setRequestInterception(true);
        page.on('request', req => {
            if (req.resourceType() === 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        const viewPortConfig = { width: 1920, height: 1080 }; // 设置视口配置
        await page.setViewport(viewPortConfig); // 应用视口配置
        console.log('视口设置为:', viewPortConfig);

        // 导航到目标URL并等待页面加载完成
        await page.goto(url + '?' + params.toString(), {
            timeout: 60000,
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });
        console.log('页面已导航至:', url + '?' + params.toString());

        await delay(1000); // 等待页面稳定

        // 查找卡片元素
        const cardElement = await page.$(`#${body.temp || 'tempA'}`);
        if (!cardElement) {
            throw new Error('请求的卡片不存在');
        }
        console.log('找到卡片元素');

        // 设置卡片内容
        if (body.content) {
            const html = md.render(body.content).replace(/\n$/, '');
            await page.evaluate(html => {
                const contentEl = document.querySelector('[name="showContent"]');
                if (contentEl) contentEl.innerHTML = html;
            }, html);
            console.log('卡片内容已设置');
        }

        // 设置图标
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
            console.log('图标已设置');
        }

        // 设置二维码图片
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
            console.log('二维码已设置');
        }

        // 获取卡片的边界框并调整视口高度
        const boundingBox = await cardElement.boundingBox();
        if (boundingBox.height > viewPortConfig.height) {
            await page.setViewport({ width: 1920, height: Math.ceil(boundingBox.height) });
        }
        console.log('找到边界框并调整视口');

        // 截取卡片截图
        const buffer = await page.screenshot({
            type: 'png',
            clip: {
                x: boundingBox.x,
                y: boundingBox.y,
                width: boundingBox.width,
                height: boundingBox.height,
                scale: scale
            },
            timeout: 60000,
        });
        console.log('截图已捕获');

        return buffer;
    } catch (error) {
        console.error('处理请求时出错:', error);
        throw error;
    } finally {
        if (page) {
            await page.close(); // 关闭页面
            console.log('页面已关闭');
        }
    }
}

// 处理 /saveImg 请求并添加重试机制
app.post('/saveImg', async (req, res) => {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            const buffer = await processRequest(req); // 处理请求
            res.setHeader('Content-Type', 'image/png'); // 设置响应头
            res.status(200).send(buffer); // 发送图片响应
            return;
        } catch (error) {
            console.error(`第 ${attempts + 1} 次尝试失败:`, error);
            attempts++;
            if (attempts >= maxRetries) {
                res.status(500).send(`处理请求失败，已重试 ${maxRetries} 次`); // 超过重试次数后发送失败响应
            } else {
                await delay(1000); // 延迟后重试
            }
        }
    }
});

// 监听 SIGINT 信号以正确关闭浏览器实例
process.on('SIGINT', async () => {
    await closeBrowser(); // 关闭浏览器实例
    process.exit(); // 退出进程
});

// 启动服务器并启动浏览器
app.listen(port, async () => {
    console.log(`监听端口 ${port}...`); // 输出服务器启动信息
    await launchBrowser(); // 启动浏览器
});
