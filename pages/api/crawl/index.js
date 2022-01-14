import crawl from '../../../functions/crawl'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const payPeriod = Number(req.body);
        const json = await crawl(payPeriod);
        if (json.loggedShifts && json.totalHours) {
            res.status(200).json(json);
        } else {
            res.status(400).json({ serverError: "Internal Server Error... ƒµçⓚ" });
        }
    }
}
