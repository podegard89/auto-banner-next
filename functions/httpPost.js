const httpPost = async (route, text) => {
    const res = await fetch(`http://localhost:3000/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text
    });
    const json = await res.json();
    return json;
}

export default httpPost;