import Head from 'next/head'
import { useState } from 'react'

export default function Home({ date }) {
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const [shouldShowClockOut, toggleButtons] = useState(false);
  const [shouldShowCrawl, setShouldShowCrawl] = useState(false);

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
  }

  const clockOut = async () => {
    const res = await fetch(`http://localhost:3000/api/clock-out`, {
      method: "POST"
    });

    const json = await res.json();
    setEnd(json.end);
    setClockedStatus(json.status);
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

      <button onClick={clockIn}>Clock in</button>
      <button onClick={clockOut}>Clock out</button>

      <p>{clockedStatus}</p>
      Enter pay period length (days):
      <input type="number" value={payPeriod} onChange={handleInputChange} />
      <button onClick={handleCrawl}>Crawl 🐛🐜</button>
      <p>{crawlStatus}</p>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`http://localhost:3000/api/date`)
  const date = await res.json()
  console.log(date)
  return { props: date }
}
