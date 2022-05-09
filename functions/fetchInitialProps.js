const Sheet = require('../data/sheet');
import { formatDate } from './dateTime';

export default async function fetchInitialProps() {
    const sheet = new Sheet();
    await sheet.load();
    try {
        const dateObject = new Date();
        const date = formatDate(dateObject);
        const currentShift = await sheet.getCurrentShift(date);

        const clockStatus = {
            "date": date,
            "clockedIn": currentShift.start && !currentShift.end,
            "startTime": currentShift.start,
            "endTime": currentShift.end,
            "shiftHours": currentShift.hours,
            "doneForDay": currentShift.start && currentShift.end
        }

        return clockStatus;
    } catch (error) {
        console.log(error);
        return { "status": "Server error" };
    }
}