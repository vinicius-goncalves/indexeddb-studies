(() => {
    
    const request = indexedDB.open('cryptocoins', 1)
    
    const dbPromise = new Promise((resolve, reject) => {

        request.addEventListener('success', (event) => {
            const db = event.target.result
            resolve(db)
        })

        request.addEventListener('upgradeneeded', (event) => {
            const db = event.target.result
            const { objectStoreNames } = db
            if(!objectStoreNames.contains('coins')) {
                return db.createObjectStore('coins', { autoIncrement: true })
            }
        })

        request.addEventListener('error', (event) => reject(event))

    })

    dbPromise.then(db => {
        const transaction = db.transaction('coins', 'readwrite')
        const store = transaction.objectStore('coins')
        const query = store.get(2)

        query.addEventListener('success', event => {
            console.log(event.target)
        })

        store.put({ name: 'Bitcoin' })

        store.openCursor().addEventListener('success', event => {
            const { ['result']: cursor } = event.target

            if(!cursor) {
                return
            }
            
            const value = cursor.value
            console.log(value)
            cursor.continue()

        })

        transaction.addEventListener('complete', () => db.close())
    })
})();