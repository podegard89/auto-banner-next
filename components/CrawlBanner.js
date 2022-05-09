import React from 'react'
import { LoadingButton } from '@mui/lab'
import { Stack } from '@mui/material'
import { useState } from 'react';
import httpPost from '../functions/httpPost';
import Submit from './Submit';

const CrawlBanner = () => {
    const [crawlLoading, setCrawlLoading] = useState(false);

    const [crawlStatus, setCrawlStatus] = useState('');
    const [totalHours, setTotalHours] = useState(0);

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

    return (
        <>
            <h2>Crawl banner and enter hours from time sheet</h2>
            <p>Enter pay period length (1-10 days): <input type="number" value={payPeriod} onChange={handleInputChange} min="1" max="10" /></p>

            <LoadingButton variant='contained' loading={crawlLoading} onClick={handleCrawl} color='error'>Crawl 🐛🐜</LoadingButton>
            {crawlStatus && <div>
                <Stack>{crawlStatus}</Stack>
                <p>Total: {totalHours} hours</p>
                <Submit />
            </div>}
        </>
    )
}

export default CrawlBanner