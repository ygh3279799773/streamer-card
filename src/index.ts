// 引入 Puppeteer Cluster 库，用于并发浏览器任务
import MarkdownIt from "markdown-it"; // 引入 Markdown-It 库，用于解析 Markdown 语法
import cors from 'cors'; // 引入 cors 中间件

// 引入 Express 框架
import {Cluster} from "puppeteer-cluster";
import express from "express";
// 初始化 Markdown-It，并设置换行符解析选项
import {LRUCache} from "lru-cache"; // 引入 LRU 缓存库，并注意其导入方式
import {markdownItTable} from 'markdown-it-table';

const md = new MarkdownIt({
    html: true, // 允许 markdown 文本使用 html 标签
    linkify: false, // 禁用自动转换 URL
    typographer: true,// 智能排版
}).use(markdownItTable);

const port = 3003; // 设置服务器监听端口
let url = 'https://fireflycard.shushiai.com/zh/reqApi'; // 要访问的目标 URL
// let url = 'http://localhost:3001/zh/reqApi'; // 要访问的目标 URL
const scale = 2; // 设置截图的缩放比例，图片不清晰就加大这个数值
const maxRetries = 3; // 设置请求重试次数
const maxConcurrency = 10; // 设置 Puppeteer 集群的最大并发数
const app = express(); // 创建 Express 应用

// 配置 CORS 中间件，允许所有跨域请求
app.use(cors({
    origin: '*', // 允许任何来源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));

app.use(express.json()); // 使用 JSON 中间件
app.use(express.urlencoded({extended: false})); // 使用 URL 编码中间件

let cluster; // 定义 Puppeteer 集群变量

// 设置 LRU 缓存，最大缓存项数和最大内存限制
const cache = new LRUCache({
    max: 100, // 缓存最大项数，可以根据需要调整
    maxSize: 50 * 1024 * 1024, // 最大缓存大小 50MB
    sizeCalculation: (value: any, key: any) => {
        return value.length; // 缓存项大小计算方法
    },
    ttl: 600 * 1000, // 缓存项 10 分钟后过期
    allowStale: false, // 不允许使用过期的缓存项
    updateAgeOnGet: true, // 获取缓存项时更新其年龄
});

// 初始化 Puppeteer 集群
async function initCluster() {
    cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT, // 使用上下文并发模式
        maxConcurrency: maxConcurrency, // 设置最大并发数
        puppeteerOptions: {
            args: [
                '--disable-dev-shm-usage', // 禁用 /dev/shm 使用
                '--disable-setuid-sandbox', // 禁用 setuid sandbox
                '--no-first-run', // 禁止首次运行流程，例如导入书签，设置默认引擎等等
                '--no-sandbox', // 禁用沙盒模式
                '--no-zygote' // 禁用 zygote
            ],
            headless: true, // 无头模式
            protocolTimeout: 120000 // 设置协议超时
        }
    });

    // 处理任务错误
    cluster.on('taskerror', (err, data) => {
        console.error(`任务处理错误: ${data}: ${err.message}`);
    });

    console.log('Puppeteer 集群已启动');
}

// 生成请求唯一标识符
function generateCacheKey(body) {
    return JSON.stringify(body); // 将请求体序列化为字符串
}

// 处理请求的主要逻辑
async function processRequest(body) {
    const cacheKey = generateCacheKey(body); // 生成缓存键

    // 检查缓存中是否有结果
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        console.log('从缓存中获取结果');
        return cachedResult; // 返回缓存结果
    }

    // 根据语言初始化链接
    let language = body?.language;
    if (language) {
        url = url.replace('zh',language)
    }

    console.log('处理请求，内容为:', JSON.stringify(body));
    // 是否使用字体
    let useLoadingFont = body.useLoadingFont;

    let params = new URLSearchParams(); // 初始化 URL 查询参数

    params.append("isApi", "true")

    let blackArr: string[] = ['icon', 'translate', 'content']; // 定义不需要加入查询参数的键

    let translate = body.translate;
    if (!translate) {
        translate = body?.form?.translate
    }

    let content = body.content;
    if (!content) {
        content = body?.form?.content
    }

    let iconSrc = body.icon;
    if (!iconSrc) {
        iconSrc = body?.form?.icon
    }

    for (const key in body) {
        let value = body[key];
        if (!blackArr.includes(key)) {
            if (key === 'switchConfig' || key === 'fonts' || key === 'style') {
                let valueStr = JSON.stringify(value);
                console.log('valueStr',valueStr)
                params.append(key, valueStr); // 序列化 switchConfig
            } else if(key === 'form'){
                delete value.content;
                delete value.translate;
                delete value.iconSrc;
                let valueStr = JSON.stringify(value);
                console.log('FormValueStr',valueStr)
                params.append(key, valueStr);
            } else{
                params.append(key, value);
            }
        }
    }

    let finalUrl = url + '?' + params.toString();


    console.log('finalUrl', finalUrl);

    const result = await cluster.execute({
        url: url + '?' + params.toString(), // 拼接 URL 和查询参数
        body,
        iconSrc,
    }, async ({page, data}) => {
        const {url, body, iconSrc} = data;
        await page.setRequestInterception(true); // 设置请求拦截
        page.on('request', req => {
            req.continue();
        });

        const viewPortConfig = {width: 1920, height: 1080}; // 设置视口配置
        await page.setViewport(viewPortConfig); // 应用视口配置
        console.log('视口设置为:', viewPortConfig);

        await page.goto(url, {
            timeout: 120000, // 设置导航超时
            waitUntil: ['load', 'networkidle2'] // 等待页面加载完成
        });
        console.log('页面已导航至:', url);

        await delay(3000)

        // 这里因为字体是按需加载，所以前面的等待字体加载不太有效，这里增大等待时间，以免部分字体没有加载完成
        // const cardElement = await page.$(`#${body.temp || 'tempA'}`); // 查找卡片元素
        const cardElement = await page.$(`.${body.temp || 'tempA'}`); // 查找卡片元素
        // const cardElement = await page.$(`.content-mode`);
        if (!cardElement) {
            throw new Error('请求的卡片不存在'); // 抛出错误
        }
        console.log('找到卡片元素');

        if (translate) {
            await page.evaluate((translate: string) => {
                // 如果有英文翻译插入英文翻译
                const translateEl = document.querySelector('[name="showTranslation"]');
                if (translateEl) translateEl.innerHTML = translate;
            }, translate);
        }

        let isContentHtml: boolean = body.isContentHtml;
        if (content) {
            let html = content;
            if (!isContentHtml) {
                html = md.render(content);
                html = `<div data-v-fc3bb97c="" contenteditable="true" translate="no" name="editableText" class="editable-element md-class">${html}</div>`
            }
            await page.evaluate(html => {
                // 插入内容
                const contentEl = document.querySelector('[name="showContent"]');
                if (contentEl) contentEl.innerHTML = html;
            }, html);
            console.log('卡片内容已设置');
        }

        if (iconSrc && iconSrc.startsWith('http')) {
            await page.evaluate(function (imgSrc) {
                return new Promise(function (resolve) {
                    let imageElement: any = document.querySelector('#icon');
                    console.log("头像", imageElement);
                    if (imageElement) {
                        imageElement.src = imgSrc;
                        imageElement.addEventListener('load', function () {
                            resolve(true);
                        });
                        imageElement.addEventListener('error', function () {
                            resolve(true);
                        });
                    } else {
                        resolve(false);
                    }
                });
            }, iconSrc);
            console.log('图标已设置');
        }

        const boundingBox = await cardElement.boundingBox(); // 获取卡片元素边界框
        console.log('boundingBox', boundingBox);

        let imgScale = body.imgScale ? body.imgScale : scale;

        if (boundingBox.height > viewPortConfig.height) {
            console.log('卡片高度大于视口高度，需要截取图片',boundingBox.height);
            const newHeight = Math.max(Math.floor(boundingBox.height))+200;  // 确保最小高度为 2000px
            await page.setViewport({
                width: 1920,
                height: newHeight
            });
            console.log('调整视口高度:', newHeight);
        }

        console.log('图片缩放比例为:', imgScale)
        const buffer = await page.screenshot({
            type: 'png', // 设置截图格式为 PNG
            clip: {
                x: boundingBox.x,
                y: boundingBox.y,
                width: boundingBox.width,
                height: boundingBox.height,
                scale: imgScale // 设置截图缩放比例
            },
            timeout: 60000, // 设置截图超时
        });
        console.log('截图已捕获');

        return buffer; // 返回截图
    });

    // 检查缓存大小，确保不会超过限制
    const currentCacheSize = cache.size;
    if (currentCacheSize + result.length <= cache.maxSize) {
        // 将结果缓存
        cache.set(cacheKey, result);
    } else {
        console.warn('缓存已满，无法缓存新的结果');
    }

    return result; // 返回处理结果
}

/**4
 * 写一个对象数组，包含三个属性
 * qrcodetitle 二维码头部
 * qrcodetext 二维码描述文字
 * qrcode 你的二维码链接
 */
const qrcodeArr:any[] = [
    {
        qrcodetitle: '流光卡片',
        qrcodetext: '让分享更美好',
        qrcode: 'https://textcard.shushiai.com/zh'
    },
    {
        qrcodetitle: '扫码添加微信',
        qrcodetext: '插件作者：嵬hacking',
        qrcode: 'https://u.wechat.com/MLY1YU64xqoNul2tibIJo6A'
    }
]


async function saveImgHandle(req: any, res: any, flag: boolean) {
    let body = req.body;
    if (flag) {
        // 随机从 qrcodeArr 中抽取一个元素
        const qrcodeObj = qrcodeArr[Math.floor(Math.random() * qrcodeArr.length)];
        // 覆盖 body 中对应的元素属性
        body.qrcodetitle = qrcodeObj.qrcodetitle;
        body.qrcodetext = qrcodeObj.qrcodetext;
        body.qrcode = qrcodeObj.qrcode;
    }
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            const buffer = await processRequest(body); // 处理请求
            res.setHeader('Content-Type', 'image/png'); // 设置响应头
            res.status(200).send(buffer); // 发送响应
            return;
        } catch (error) {
            console.error(`第 ${attempts + 1} 次尝试失败:`, error);
            attempts++;
            if (attempts >= maxRetries) {
                res.status(500).send(`处理请求失败，已重试 ${maxRetries} 次`); // 发送错误响应
            } else {
                await delay(1000); // 等待一秒后重试
            }
        }
    }
}

// 处理保存图片的 POST 请求
app.post('/api/saveImg', async (req: any, res: any) => {
    await saveImgHandle(req, res, false)
});

// 广告位请求
app.post('/api/wxSaveImg', async (req: any, res: any) => {
    await saveImgHandle(req, res, true)
});

// 写一个接口，不需要任何 uri，请求端口，返回 hello world
app.get('/api', (req, res) => {
    res.send('hello world');
});

// 处理进程终止信号
process.on('SIGINT', async () => {
    await cluster.idle(); // 等待所有任务完成
    await cluster.close(); // 关闭 Puppeteer 集群
    process.exit(); // 退出进程
});

// 启动服务器并初始化 Puppeteer 集群
app.listen(port, async () => {
    console.log(`监听端口 ${port}...`);
    await initCluster();
});

// 延迟函数，用于等待指定的毫秒数
function delay(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

