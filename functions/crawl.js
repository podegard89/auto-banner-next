const puppeteer = require('puppeteer');
const secrets = require('../secrets');
const Sheet = require('../data/sheet');

export default async function crawl(payPeriod) {

    //headless in prod
    //head in dev
    const browser = await puppeteer.launch({ headless: false });
    try {
        const page = await browser.newPage();
        await page.goto(secrets.bannerUrl);

        //login
        const loginFormElements = await page.$$('input');
        await loginFormElements[0].type(secrets.USERNAME);
        await loginFormElements[1].type(secrets.PASSWORD);
        await loginFormElements[2].click();

        const waitThenClick = async (selector, clicks) => {
            await page.waitForSelector(selector);
            const element = await page.$(selector);
            await element.click({ clickCount: clicks });
            return element;
        }

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

        //get current day of the week
        const dayOfWeek = new Date().getDay();

        // then loop through the data and enter it into banner time sheet
        for (const [index, row] of timeSheetRows.entries()) {

            if (timeSheetRows.length > 5) {
                index === 5 ? await waitThenClick('[value="Next"]', 1) : null;
            }

            const shiftDate = row.date;
            const shiftHours = row.hours;
            loggedShifts.push({ shiftDate, shiftHours });
            totalHours += parseInt(shiftHours);

            await waitThenClick(`[title="Enter Hours for 015 Hourly Pay for ${shiftDate}"]`, 1);

            // await page.waitForSelector('input[name="Hours"]');

            // const hoursInput = await page.$('input[name="Hours"]');
            // await hoursInput.click({ clickCount: 3 });
            const hoursInput = await waitThenClick('input[name="Hours"]', 3);
            await hoursInput.type(shiftHours);

            await waitThenClick('input[value="Save"]', 1);
        }

        return { loggedShifts, totalHours };

    } catch (e) {
        console.log(e);
        return {};
    } finally {
        // I am not automatically closing the browser for now so I can confirm
        // everything is working and manually submit hours for approval.
        // trying to figure out why the browser closes before entering the final day!!!
        await browser.close();
    }
}