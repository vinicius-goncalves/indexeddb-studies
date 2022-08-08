const request = indexedDB.open('cryptocoins', 1)

const insertData = (db, newObject) => {
    const transaction = db.transaction('cryptos', 'readwrite')
    const store = transaction.objectStore('cryptos')
    store.put({ ...newObject })
    
    transaction.addEventListener('complete', () => db.close())
}

request.addEventListener('success', event => {

    const createNewItem = new Promise(resolve => {
        const db = event.target.result
        insertData(db, { name: 'Bitcoin', release_date: '2009-january'})
        resolve(db)
    })

    createNewItem.then(db => {
        const transaction = db.transaction('cryptos', 'readonly')
        const store = transaction.objectStore('cryptos')
        
        store.openCursor().addEventListener('success', event => {
            const { ['result']: cursor } = event.target
            if(!cursor) {
                return
            }

            const crypto = cursor.value
            console.log(crypto)
            cursor.continue()
        })

        transaction.addEventListener('complete', () => db.close())
    })
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
            return
        }

    } catch (error) {
        console.log(error)
    }
})