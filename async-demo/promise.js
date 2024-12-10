const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('complete');
        // reject(new Error('message'));
    }, 2000);
})

p.then(result => console.log('Result', result))
.catch(err => console.log('Error', err.message));