const puppeteer = require('puppeteer');
const secrets = require('../secrets');
const Sheet = require('../data/sheet');

// this needs to be converted to crawl then simply submit the hours for approval

export default async function submitForApproval() {

    //headless in prod
    //head in dev
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(secrets.bannerUrl);

    //login
    const loginFormElements = await page.$$('input');
    await loginFormElements[0].type(secrets.USERNAME);
    await loginFormElements[1].type(secrets.PASSWORD);
    await loginFormElements[2].click();

    const waitThenClick = async (selector) => {
        await page.waitForSelector(selector);
        const element = await page.$(selector);
        await element.click();
    }

    // get rows from selector sheet
    const sheet = new Sheet();
    await sheet.load();

    const selectors = await sheet.getRows(1);

    // crawl to banner time sheet
    for (let row of selectors) {
        await waitThenClick(row.selector);
    }

    await waitThenClick('input[value="Submit for Approval"]');

    await page.waitForSelector('input[type=password]');
    const passwordInput = await page.$('input[type=password]');
    await passwordInput.click({ clickCount: 3 });
    await passwordInput.type(secrets.PASSWORD);

    await waitThenClick('input[value=Submit]');

    // I am not automatically closing the browser for now so I can confirm
    // everything is working and manually submit hours for approval.
    await page.waitForSelector('th[abbr=Approval]');
    await browser.close();

}