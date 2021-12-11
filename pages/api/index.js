import Sheet from "../../sheet";

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const dateTime = await handleGet();
            res.status(200).json(dateTime);
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    } else if (req.method == 'POST') {
        try {
            await handlePost(req.body);
            res.status(200).json({ status: "Success" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
}

let startTime;
const handleGet = async () => {
    const dateObject = new Date();
    const date = formatDate(dateObject);
    const time = dateObject.toLocaleTimeString();
    return { date, time, dateObject };
}

const handlePost = async (data) => {
    const sheet = new Sheet();
    await sheet.load();
    // this needs to be improved by not passing any date objects
    // to the client and instead creating start and end Date
    // objects server-side on request
    const endTime = new Date(data.endTime);
    const startTime = new Date(data.startTime);
    const hours = msToHours(endTime - startTime);
    const date = data.date;
    const start = data.startTimeString;
    const end = data.endTimeString;
    const row = { date, start, end, hours };
    await sheet.addRows(row, 0);
}

const msToHours = (duration) => {
    const calcMinutes = Math.floor((duration / (1000 * 60)) % 60);
    const calcHours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // round to nearest half
    return `${calcHours + Math.round((calcMinutes / 60) * 2) / 2}`;
}

const formatDate = (date) => {
    const monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ]

    const day = daysOfWeek[date.getDay()]; //Sunday is 0!
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = monthNames[date.getMonth()];//January is 0!
    const yyyy = date.getFullYear();

    return `${day} ${dd}-${mm}-${yyyy}`
}