/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head'
import { useState } from 'react'
import fetchInitialProps from '../functions/fetchInitialProps'
import TimeClockInfo from '../components/TimeClockInfo'
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

      <TimeClockInfo date={date} start={start} end={end} hours={hours} />

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
