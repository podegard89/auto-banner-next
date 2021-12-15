import Sheet from "../../../sheet";

export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            await handlePost(req.body);
            res.status(200).json({ status: "Success" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}

const handlePost = async (row) => {
    const sheet = new Sheet();
    await sheet.load();
    // this needs to be improved by not passing any unnecessary
    // date information to the client and instead creating start 
    // and end Date objects server-side on get request
    const hours = msToHours(row.endTime - row.startTime);
    const date = row.date;
    const start = row.startTimeString;
    const end = row.endTimeString;
    const row = { date, start, end, hours };
    await sheet.addRows(row, 0);
}

const msToHours = (duration) => {
    const calcMinutes = Math.floor((duration / (1000 * 60)) % 60);
    const calcHours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // round to nearest half
    return `${calcHours + Math.round((calcMinutes / 60) * 2) / 2}`;
}