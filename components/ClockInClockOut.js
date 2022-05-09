import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import Image from 'next/image'
import clockGIF from '../public/ClockGIF2.gif'
import httpPost from '../functions/httpPost'
import TimeClockInfo from './TimeClockInfo'

const ClockInClockOut = (props) => {
    const { date, startTime, endTime, shiftHours, clockedInOrOut, doneForDay } = props.props;

    const [start, setStart] = useState(startTime);
    const [end, setEnd] = useState(endTime);
    const [hours, setHours] = useState(shiftHours);

    const [isDoneForDay, setIsDoneForDay] = useState(doneForDay);

    const [loading, setLoading] = useState(false);
    const [clockedStatus, setClockedStatus] = useState(clockedInOrOut);

    const shouldShowClockIn = clockedStatus === "Clocked out!" && !isDoneForDay;
    const shouldShowClockOut = clockedStatus === "Clocked in!" && !isDoneForDay;

    const clockIn = async () => {
        setLoading(true);
        const json = await httpPost('api/clock-in', date);
        console.log(json)
        setStart(json.start);
        setClockedStatus(json.status);
        setLoading(false);
    }

    const clockOut = async () => {
        setLoading(true);
        const json = await httpPost('api/clock-out', date);
        setEnd(json.end);
        setClockedStatus(json.status);
        setHours(json.hours);
        setIsDoneForDay(true);
        setLoading(false);
    }

    return (
        <>
            <TimeClockInfo date={date} start={start} end={end} hours={hours} />
            {shouldShowClockIn &&
                <LoadingButton variant="contained" onClick={clockIn} loading={loading}>Clock in &nbsp;⏰</LoadingButton>}
            {shouldShowClockOut && <div>
                <LoadingButton variant='contained' onClick={clockOut} loading={loading}>
                    Clock out &nbsp;&nbsp;<Image src={clockGIF} height={30} width={30} className={loading ? 'hidden' : {}} alt='clock.gif'></Image>
                </LoadingButton>
            </div>}

            <p>{clockedStatus}</p>
        </>
    )
}

export default ClockInClockOut;