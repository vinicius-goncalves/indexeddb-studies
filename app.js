const request = indexedDB.open('cryptocoins', 1)

request.addEventListener('success', event => {
    const db = event.target.result
    console.log('Success on indexedDB open request', db)
})

request.addEventListener('error', event => {
    console.log('Error on indexedDB close request', event.target.result)
})

request.addEventListener('upgradeneeded', event => {
    try {

        const db = event.target.result
        const { objectStoreNames } = db

        if(objectStoreNames.contains('cryptos')) {
            db.createObjectStore('cryptos', { autoIncrement: true })
        }

    } catch (error) {
        console.log(error)
    }
})