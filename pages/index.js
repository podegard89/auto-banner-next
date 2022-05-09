/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head'
import { useState } from 'react'
import fetchInitialProps from '../functions/fetchInitialProps'
import ClockInClockOut from '../components/ClockInClockOut'
import CrawlBanner from '../components/CrawlBanner'

export default function Home({ date, clockedInOrOut, startTime, endTime, doneForDay, shiftHours }) {
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);
  const [hours, setHours] = useState(shiftHours);

  return (
    <div className='main'>
      <Head>
        <title>Time Clock 📅</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <h1>Time Clock 📅</h1>

      <div className='timeClock'>
        <p>Date: <strong>{date}</strong></p>
        <p>Clock-in Time: <strong>{start}</strong></p>
        <p>Clock-out Time: <strong>{end}</strong></p>
        <p>Hours: <strong>{hours}</strong></p>
      </div>

      <ClockInClockOut date={date} clockedInOrOut={clockedInOrOut} doneForDay={doneForDay} setStart={setStart} setEnd={setEnd} setHours={setHours} />

      <CrawlBanner />
    </div>
  )
}

export const getServerSideProps = async () => {
  const clockStatus = await fetchInitialProps();
  console.log(clockStatus)
  return { props: clockStatus };
}
