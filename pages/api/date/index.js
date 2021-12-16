import Sheet from "../../../sheet";
import { formatDate } from "../../../functions/dateTime"

export default async function handler(req, res) {

    if (req.method === 'GET') {
        try {
            const dateObject = new Date();
            const date = formatDate(dateObject);
            res.status(200).json({ date });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}

