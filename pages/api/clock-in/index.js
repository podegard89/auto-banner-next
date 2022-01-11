import Sheet from "../../../data/sheet";

export default async function handler(req, res) {
    const sheet = new Sheet();
    await sheet.load();

    if (req.method === 'POST') {
        try {
            const dateObject = new Date();
            const start = dateObject.toLocaleTimeString();
            const startMS = Date.now();
            const date = req.body;
            await sheet.addRows({ date, start, startMS });
            res.status(200).json({ start, status: "Clocked in!" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}
