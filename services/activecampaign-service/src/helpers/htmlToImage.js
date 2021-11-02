import puppeteer from "puppeteer";

export default async (html = "") => {
    const browser = await puppeteer.launch({
        // executablePath: '/usr/bin/chromium-browser',
        executablePath: '/usr/bin/chromium',
        headless: true,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    //Set ViewPort Size
    await page.setViewport({
        width: 500,
        height: 250,
        deviceScaleFactor: 1,
    });
    
    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            deviceScaleFactor: window.devicePixelRatio,
        };
    });
    
    console.log('Dimensions:', dimensions);
    
    
    await page.setContent(html);
    
    const content = await page.$("html");
    const imageBuffer = await content.screenshot({ omitBackground: true });
    
    await page.close();
    await browser.close();
    
    return imageBuffer;
};