import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [shouldShowClockOut, toggleButtons] = useState(false);

  const fetchDateTime = async () => {
    const res = await fetch(`http://localhost:3000/api/dateTime`)
    const dateTime = await res.json()
    return dateTime
  }

  const handleClockIn = async () => {
    const dateTime = await fetchDateTime()
    setDate(dateTime.date)
    setStartTime(dateTime.time)
    toggleButtons(true)
  }

  const handleClockOut = async () => {
    const dateTime = await fetchDateTime()
    setEndTime(dateTime.time)
    toggleButtons(false)
  }

  return (
    <div>
      <Head>
        <title>balls</title>
      </Head>

      <h2>Date: {date}</h2>
      <h2>Clock-in Time: {startTime}</h2>
      <h2>Clock-out Time: {endTime}</h2>
      {!shouldShowClockOut ?
        <button onClick={handleClockIn}>Clock in</button> :
        <button onClick={handleClockOut}>Clock out</button>
      }
    </div>
  )
}

// export const getServerSideProps = async () => {
//   const res = await fetch(`http://localhost:3000/api/dates`)
//   const dateTime = await res.json()
//   console.log(dateTime)
//   return { props: { dateTime } }
// }
