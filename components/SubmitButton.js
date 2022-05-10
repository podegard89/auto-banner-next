import React from 'react'
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

const SubmitButton = () => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleSubmit = async () => {
        setSubmitLoading(true);
        const json = await httpPost('api/submit');
        setSubmitStatus(json.status);
        setSubmitLoading(false);
    }

    return (
        <>
            <LoadingButton variant='contained' loading={submitLoading} onClick={handleSubmit} color='success'>Send it! 👌</LoadingButton>
            <p>{submitStatus}</p>
        </>
    )
}

export default SubmitButton;