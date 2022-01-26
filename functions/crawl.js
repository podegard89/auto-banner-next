import next from 'next';

const puppeteer = require('puppeteer');
const secrets = require('../secrets');
const Sheet = require('../data/sheet');

export default async function crawl(payPeriod) {

    //headless in prod
    //head in dev
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.goto(secrets.bannerUrl);

    const waitThenClick = async (selector, clicks) => {
        await page.waitForSelector(selector);
        const element = await page.$(selector);
        await element.click({ clickCount: clicks });
        return element;
    }

    try {
        //login
        const loginFormElements = await page.$$('input');
        await loginFormElements[0].type(secrets.USERNAME);
        await loginFormElements[1].type(secrets.PASSWORD);
        await loginFormElements[2].click();

        // get rows from selector sheet
        const sheet = new Sheet();
        await sheet.load();

        const selectors = await sheet.getRows(1);

        // crawl to banner time sheet
        for (let row of selectors) {
            await waitThenClick(row.selector, 1);
        }

        // grabs last payPeriod rows from spreadsheet
        const timeSheetRows = (await sheet.getRows(0)).slice(1).slice(-payPeriod);
        // console.log(timeSheetRows.length);

        // stores objects containing info about logged shifts
        const loggedShifts = [];
        let totalHours = 0;

        // then loop through the data and enter it into banner time sheet
        for (const row of timeSheetRows) {

            const { date, hours } = row;
            loggedShifts.push({ date, hours });
            totalHours += parseInt(hours);

            const timeInputSelector = `[title="Enter Hours for 015 Hourly Pay for ${date}"]`;

            let shouldPressNext = false;

            try {
                await page.waitForSelector(timeInputSelector, { timeout: 1000 });
            } catch (e) {
                shouldPressNext = true;
            }

            if (shouldPressNext) {
                try {
                    await page.waitForSelector('[value="Next"]', { timeout: 1000 });
                } catch (e) {
                    break;
                }
            }

            shouldPressNext ? await waitThenClick('[value="Next"]', 1) : null;
            await waitThenClick(timeInputSelector, 1);

            const hoursInput = await waitThenClick('input[name="Hours"]', 3);
            await hoursInput.type(hours);

            await waitThenClick('input[value="Save"]', 1);
        }

        return { loggedShifts, totalHours };

    } catch (e) {
        console.log(e);
        return {};
    } finally {
        await page.waitForNavigation();
        await page.click('input[value="Preview"]');
        await browser.close();
    }
}