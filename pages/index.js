/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head'
import { useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'

export default function Home({ date, clockedIn, startTime, endTime, doneForDay, shiftHours }) {
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);
  const [hours, setHours] = useState(shiftHours);

  const [isClockedIn, setIsClockedIn] = useState(clockedIn);
  const [isDoneForDay, setIsDoneForDay] = useState(doneForDay);

  const [loading, setLoading] = useState(false);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [clockedStatus, setClockedStatus] = useState('');
  const [crawlStatus, setCrawlStatus] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const [payPeriod, setPayPeriod] = useState(10);

  const shouldShowClockIn = !isClockedIn && !isDoneForDay;
  const shouldShowClockOut = isClockedIn && !isDoneForDay;

  const handleInputChange = (event) => {
    setPayPeriod(event.target.value)
  }

  const httpPost = async (route, text) => {
    const res = await fetch(`http://localhost:3000/${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: text
    });
    console.log(res)
    const json = await res.json();
    return json;
  }

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

  const handleCrawl = async () => {
    setCrawlLoading(true);
    const json = await httpPost('api/crawl', payPeriod);
    setCrawlStatus(json.loggedShifts.map(s => {
      return <p key={s.shiftDate}>{s.shiftDate}: {s.shiftHours} hours</p>
    }));
    setCrawlLoading(false);
  }

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const json = await httpPost('api/submit');
    setSubmitStatus(json.status);
    setSubmitLoading(false);
  }

  return (
    <div>
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

      {shouldShowClockIn &&
        <LoadingButton variant="contained" onClick={clockIn} loading={loading}>Clock in ⏰</LoadingButton>}
      {shouldShowClockOut &&
        <LoadingButton variant='contained' onClick={clockOut} loading={loading}>Clock out ⏰</LoadingButton>}

      <p>{clockedStatus}</p>
      <h2>Crawl banner and enter hours from time sheet</h2>
      <p>Enter pay period length (1-10 days): <input type="number" value={payPeriod} onChange={handleInputChange} min="1" max="10" /></p>

      <LoadingButton variant='contained' loading={crawlLoading} onClick={handleCrawl} color='warning'>Crawl 🐛🐜</LoadingButton>
      <p>{crawlStatus}</p>
      {crawlStatus && <LoadingButton variant='contained' loading={submitLoading} onClick={handleSubmit} color='success'>Send it! 👌</LoadingButton>}
      <p>{submitStatus}</p>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`http://localhost:3000/api/date`);
  const json = await res.json();
  console.log(json)
  return { props: json };
}
