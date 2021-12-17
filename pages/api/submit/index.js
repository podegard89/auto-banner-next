import submitForApproval from '../../../functions/submitAPPRO'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await submitForApproval();
            res.status(200).json({ status: "Success" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}