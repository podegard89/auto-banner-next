import Sheet from "../../../data/sheet";
import { msToHours } from "../../../functions/dateTime"

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const sheet = new Sheet();
        await sheet.load();
        try {
            const dateObject = new Date();
            const end = dateObject.toLocaleTimeString();
            const endMS = Date.now();

            const currentShift = await sheet.getCurrentShift(req.body);
            currentShift.end = end;
            currentShift.endMS = endMS;
            currentShift.hours = msToHours(endMS - currentShift.startMS);
            await currentShift.save();
            res.status(200).json({ end, status: "Clocked out!", hours: currentShift.hours });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}

