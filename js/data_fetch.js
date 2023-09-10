async function fetchData() {
    return await fetch('https://mindhub-xj03.onrender.com/api/amazing')
        .then(res => res.json())
        .then(data => {
            return data
        })
        .catch(err => {
            console.log('err >> ', err);
            throw err;
        });
}

fetchData();


