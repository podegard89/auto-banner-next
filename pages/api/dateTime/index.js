
export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const dateObject = new Date();
            const date = formatDate(dateObject);
            res.status(200).json({ date });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    } else if (req.method == 'POST') {
        try {
            const dateObject = new Date();
            const localeString = dateObject.toLocaleTimeString();
            const milliseconds = Date.now();
            res.status(200).json({ localeString, milliseconds });
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: "Server error" });
        }
    }
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