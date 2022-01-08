import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'

const ClockInClockOut = (props) => {

    const [clockedStatus, setClockedStatus] = useState('');
    const [isDoneForDay, setIsDoneForDay] = useState(doneForDay);


    const clockIn = async () => {
        setLoading(true);
        const json = await httpPost('api/clock-in', date);
        console.log(json)
        setStart(json.start);
        setClockedStatus(json.status);
        setIsClockedIn(true);
        setLoading(false);
    }

    const clockOut = async () => {
        setLoading(true);
        const json = await httpPost('api/clock-out', date);
        setEnd(json.end);
        setClockedStatus(json.status);
        setHours(json.hours);
        setIsClockedIn(false);
        setIsDoneForDay(true);
        setLoading(false);
    }

    return (
        <LoadingButton variant="contained" onClick={clockIn} loading={loading}>
            Clock in ⏰
        </LoadingButton>
    )
}

export default ClockInButton;