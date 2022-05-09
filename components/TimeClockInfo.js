import React from 'react'

const TimeClockInfo = ({ date, start, end, hours }) => {
    return (
        <>
            <div className='timeClock'>
                <p>Date: <strong>{date}</strong></p>
                <p>Clock-in Time: <strong>{start}</strong></p>
                <p>Clock-out Time: <strong>{end}</strong></p>
                <p>Hours: <strong>{hours}</strong></p>
            </div>
        </>
    )
}

export default TimeClockInfo;