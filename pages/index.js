import Head from 'next/head'
import { useState } from 'react'

export default function Home({ date, clockedIn, startTime, endTime, doneForDay }) {
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);

  const [isClockedIn, setIsClockedIn] = useState(clockedIn);
  const [isDoneForDay, setIsDoneForDay] = useState(doneForDay);

  const [clockedStatus, setClockedStatus] = useState('');
  const [crawlStatus, setCrawlStatus] = useState('');

  const [payPeriod, setPayPeriod] = useState(10);

  const handleInputChange = (event) => {
    setPayPeriod(event.target.value)
  }

  const clockIn = async () => {
    const res = await fetch(`http://localhost:3000/api/clock-in`, {
      method: "POST",
      headers: { 'Content-Type': 'text/plain' },
      body: date
    });

    const json = await res.json();
    setStart(json.start);
    setClockedStatus(json.status);
    setIsClockedIn(true);
  }

  const clockOut = async () => {
    const res = await fetch(`http://localhost:3000/api/clock-out`, {
      method: "POST",
      headers: { 'Content-Type': 'text/plain' },
      body: date
    });

    const json = await res.json();
    setEnd(json.end);
    setClockedStatus(json.status);
    setIsClockedIn(false);
    setIsDoneForDay(true);
  }

  const handleCrawl = async () => {
    const res = await fetch(`http://localhost:3000/api/crawl`, {
      method: "POST",
      headers: { 'Content-Type': 'text/plain' },
      body: payPeriod
    });
    const json = res.json();
    setCrawlStatus(json.status);
  }

  return (
    <div>
      <Head>
        <title>balls</title>
      </Head>

      <h2>Date: {date}</h2>
      <h2>Clock-in Time: {start}</h2>
      <h2>Clock-out Time: {end}</h2>

      {!isClockedIn && !isDoneForDay && <button onClick={clockIn}>Clock in</button>}
      {isClockedIn && !isDoneForDay && <button onClick={clockOut}>Clock out</button>}

      <p>{clockedStatus}</p>
      Enter pay period length (days):
      <input type="number" value={payPeriod} onChange={handleInputChange} />
      <button onClick={handleCrawl}>Crawl 🐛🐜</button>
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
