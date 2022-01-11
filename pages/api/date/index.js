import Sheet from "../../../data/sheet";
import { formatDate } from "../../../functions/dateTime"

export default async function handler(req, res) {
    const sheet = new Sheet();
    await sheet.load();


    if (req.method === 'GET') {
        try {
            const dateObject = new Date();
            const date = formatDate(dateObject);
            const currentShift = await sheet.getCurrentShift(date);

            const clockStatus = {
                date,
                clockedIn: currentShift.start && !currentShift.end,
                startTime: currentShift.start,
                endTime: currentShift.end,
                shiftHours: currentShift.hours,
                doneForDay: currentShift.start && currentShift.end
            }

            res.status(200).json(clockStatus);
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}

