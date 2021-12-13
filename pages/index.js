import Head from 'next/head'
import { useState } from 'react'

export default function Home({ date }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startTimeString, setStartTimeString] = useState('');
  const [endTimeString, setEndTimeString] = useState('');

  const [shouldShowClockOut, toggleButtons] = useState(false);
  const [shouldShowCrawl, setShouldShowCrawl] = useState(false);

  const [sheetStatus, setSheetStatus] = useState('');
  const [crawlStatus, setCrawlStatus] = useState('');

  const fetchTime = async () => {
    const res = await fetch(`http://localhost:3000/api/dateTime`, {
      method: "POST"
    });
    const timeObject = await res.json();
    return timeObject;
  }

  const postRow = async (row) => {
    const res = await fetch("http://localhost:3000/api/sheet", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });

    const json = await res.json();
    setSheetStatus(json.status);
  }

  const handleCrawl = async () => {
    const res = await fetch(`http://localhost:3000/api/crawl`, {
      method: "POST"
    });
    const json = res.json();
    setCrawlStatus(json.status);
  }

  const handleClockIn = async () => {
    const timeObject = await fetchTime();
    setStartTime(timeObject.milliseconds);
    setStartTimeString(timeObject.localeString);
    toggleButtons(true);
  }

  const handleClockOut = async () => {
    const timeObject = await fetchTime();
    setEndTime(timeObject.milliseconds);
    setEndTimeString(timeObject.localeString);
    toggleButtons(false);
  }

  const handleSheetSubmit = async () => {
    const row = { date, startTime, endTime, startTimeString, endTimeString };
    await postRow(row);
    setShouldShowCrawl(true);
  }

  return (
    <div>
      <Head>
        <title>balls</title>
      </Head>

      <h2>Date: {date}</h2>
      <h2>Clock-in Time: {startTimeString}</h2>
      <h2>Clock-out Time: {endTimeString}</h2>
      {!shouldShowClockOut ?
        <button onClick={handleClockIn}>Clock in</button> :
        <button onClick={handleClockOut}>Clock out</button>
      }
      {endTime && <button onClick={handleSheetSubmit}>Write time to sheet</button>}
      <p>{sheetStatus}</p>
      {shouldShowCrawl && <button onClick={handleCrawl}>Crawl 🐛🐜</button>}
      <p>{crawlStatus}</p>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`http://localhost:3000/api/dateTime`)
  const date = await res.json()
  console.log(date)
  return { props: date }
}
