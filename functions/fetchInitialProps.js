const Sheet = require('../data/sheet');
import { formatDate } from './dateTime';

export default async function fetchInitialProps() {
    const sheet = new Sheet();
    await sheet.load();
    try {
        const dateObject = new Date();
        const date = formatDate(dateObject);
        const currentShift = await sheet.getCurrentShift(date);
        const clockStatus = { date, clockedInOrOut: "Clocked out!" };

        if (currentShift.start && !currentShift.end) {
            clockStatus.clockedInOrOut = "Clocked in!";
            clockStatus.startTime = currentShift.start;
        } else if (currentShift.start && currentShift.end) {
            clockStatus.startTime = currentShift.start;
            clockStatus.endTime = currentShift.end;
            clockStatus.shiftHours = currentShift.hours;
            clockStatus.doneForDay = currentShift.end;
        }

        return clockStatus;
    } catch (error) {
        console.log(error);
        return { "status": "Server error" };
    }
}