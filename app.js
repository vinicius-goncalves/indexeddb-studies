const request = indexedDB.open('cryptocoins', 1)

const insertData = (db, newObject) => {
    const transaction = db.transaction('cryptos', 'readwrite')
    const store = transaction.objectStore('cryptos')
    const query = store.put({ ...newObject })
    transaction.addEventListener('complete', () => db.close())
}

request.addEventListener('success', event => {
    const db = event.target.result
    insertData(db, { name: 'Bitcoin', release_date: '2009-january'})
})

request.addEventListener('error', event => {
    console.log('Error on indexedDB close request', event.target.result)
})

request.addEventListener('upgradeneeded', event => {
    try {

        const db = event.target.result
        const { objectStoreNames } = db

        if(!objectStoreNames.contains('cryptos')) {
            db.createObjectStore('cryptos', { autoIncrement: true })
        }

    } catch (error) {
        console.log(error)
    }
})