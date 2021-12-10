
export default function handler(req, res) {
    const dateObject = new Date();
    const date = formatDate(dateObject);
    const time = formatTime(dateObject);
    res.status(200).json({ date, time, dateObject });
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

    return `${day} ${dd}-${mm}-${yyyy}`;
}

const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
}