export const msToHours = (duration) => {
    const calcMinutes = Math.floor((duration / (1000 * 60)) % 60);
    const calcHours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // round to nearest half
    return `${calcHours + Math.round((calcMinutes / 60) * 2) / 2}`;
}

export const formatDate = (date) => {
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