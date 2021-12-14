import crawl from '../../../crawl'

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            await crawl();
            res.status(200).json({ status: "Success" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}