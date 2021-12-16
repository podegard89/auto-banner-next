import Sheet from "../../../sheet";
import { msToHours } from "../../../functions/dateTime"

export default async function handler(req, res) {
    const sheet = new Sheet();
    await sheet.load();
    const currentShift = await sheet.getCurrentShift();

    if (req.method === 'POST') {
        try {
            const dateObject = new Date();
            const end = dateObject.toLocaleTimeString();
            const endMS = Date.now();

            currentShift.end = end;
            currentShift.endMS = endMS;
            currentShift.hours = msToHours(endMS - currentShift.startMS - 1);
            await currentShift.save();
            res.status(200).json({ end, status: "Clocked out!" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}

