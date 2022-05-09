/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head'
import { useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { Stack } from '@mui/material'
import styles from '../styles/Home.module.css'
import fetchInitialProps from '../functions/fetchInitialProps'
import TimeClockInfo from '../components/TimeClockInfo'
import ClockInClockOut from '../components/ClockInClockOut'
import httpPost from '../functions/httpPost'

export default function Home({ date, clockedInOrOut, startTime, endTime, doneForDay, shiftHours }) {
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);
  const [hours, setHours] = useState(shiftHours);

  const [crawlLoading, setCrawlLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [crawlStatus, setCrawlStatus] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [submitStatus, setSubmitStatus] = useState('');

  const [payPeriod, setPayPeriod] = useState(10);

  const handleInputChange = (event) => {
    setPayPeriod(event.target.value)
  }

  const handleCrawl = async () => {
    setCrawlLoading(true);
    const json = await httpPost('api/crawl', payPeriod);

    if (json.serverError) {
      setCrawlStatus(json.serverError);
      setCrawlLoading(false);
      return;
    }

    const shiftJSX = json.loggedShifts.map(s => {
      return <p key={s.date}>{s.date}: {s.hours} hours</p>
    });
    setTotalHours(json.totalHours);
    setCrawlStatus(shiftJSX);
    setCrawlLoading(false);
  }

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const json = await httpPost('api/submit');
    setSubmitStatus(json.status);
    setSubmitLoading(false);
  }

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

      <h2>Crawl banner and enter hours from time sheet</h2>
      <p>Enter pay period length (1-10 days): <input type="number" value={payPeriod} onChange={handleInputChange} min="1" max="10" /></p>

      <LoadingButton variant='contained' loading={crawlLoading} onClick={handleCrawl} color='error'>Crawl 🐛🐜</LoadingButton>
      {crawlStatus && <div className={styles.crawlStatus}>
        <Stack>{crawlStatus}</Stack>
        <p>Total: {totalHours} hours</p>
        <LoadingButton variant='contained' loading={submitLoading} onClick={handleSubmit} color='success'>Send it! 👌</LoadingButton>
      </div>}
      <p>{submitStatus}</p>
    </div>
  )
}

export const getServerSideProps = async () => {
  const clockStatus = await fetchInitialProps();
  console.log(clockStatus)
  return { props: clockStatus };
}
