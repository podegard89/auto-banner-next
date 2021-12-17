import crawl from '../../../functions/crawl'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const payPeriod = Number(req.body);
            await crawl(payPeriod);
            res.status(200).json({ status: "Success" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}