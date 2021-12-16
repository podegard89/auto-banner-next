import Head from 'next/head'
import { useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'

export default function Home({ date, clockedIn, startTime, endTime, doneForDay }) {
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);
  const [hours, setHours] = useState('');

  const [isClockedIn, setIsClockedIn] = useState(clockedIn);
  const [isDoneForDay, setIsDoneForDay] = useState(doneForDay);

  const [loading, setLoading] = useState(false);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [clockedStatus, setClockedStatus] = useState('');
  const [crawlStatus, setCrawlStatus] = useState('');

  const [payPeriod, setPayPeriod] = useState(10);

  const handleInputChange = (event) => {
    setPayPeriod(event.target.value)
  }

  const clockIn = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/api/clock-in`, {
      method: "POST",
      headers: { 'Content-Type': 'text/plain' },
      body: date
    });

    const json = await res.json();
    setStart(json.start);
    setClockedStatus(json.status);
    setIsClockedIn(true);
    setLoading(false);
  }

  const clockOut = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/api/clock-out`, {
      method: "POST",
      headers: { 'Content-Type': 'text/plain' },
      body: date
    });


    const json = await res.json();
    setEnd(json.end);
    setClockedStatus(json.status);
    setHours(json.hours);
    setIsClockedIn(false);
    setIsDoneForDay(true);
    setLoading(false);
  }

  const handleCrawl = async () => {
    setCrawlLoading(true);
    const res = await fetch(`http://localhost:3000/api/crawl`, {
      method: "POST",
      headers: { 'Content-Type': 'text/plain' },
      body: payPeriod
    });
    const json = res.json();
    setCrawlStatus(json.status);
    setCrawlLoading(false);
  }

  return (
    <div>
      <Head>
        <title>balls</title>
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

      {!isClockedIn && !isDoneForDay &&
        <LoadingButton variant="contained" onClick={clockIn} loading={loading}>Clock in ⏰</LoadingButton>}
      {isClockedIn && !isDoneForDay &&
        <LoadingButton variant='contained' onClick={clockOut} loading={loading}>Clock out ⏰</LoadingButton>}

      <p>{clockedStatus}</p>
      <h2>Crawl banner and enter hours from time sheet</h2>
      <p>Enter pay period length (days): <input type="number" value={payPeriod} onChange={handleInputChange} /></p>

      <LoadingButton variant='contained' loading={crawlLoading} onClick={handleCrawl}>Crawl 🐛🐜</LoadingButton>
      <p>{crawlStatus}</p>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`http://localhost:3000/api/date`);
  const json = await res.json();
  console.log(json)
  return { props: json };
}
