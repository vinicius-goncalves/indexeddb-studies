const request = indexedDB.open('cryptocoins', 1)

import { cryptos } from './cryptos.js'

const methods = method => {
    
    if(method === 'log') {
        return new Promise(resolve => {
            const log = (...info) => console.log(...info)
            resolve(log)
        })
    }

    if(method === 'randomArrayItem') {
        return new Promise(resolve => {
            const randomItem = (array) => array[Math.floor(Math.random() * array.length)]
            resolve(randomItem)
        })

    }
} 

const getAllStores = document.querySelector('[data-button="get-all-object-stores"]')
const addRandomValue = document.querySelector('[data-button="add-random-store"]')


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

getAllStores.addEventListener('click', () => {
    dbPromise.then(db => {
        const transaction = db.transaction('coins', 'readwrite')
        const store = transaction.objectStore('coins')
        const openCursor = store.openCursor()

        openCursor.addEventListener('success', (event) => {

            const { ['result']: cursor } = event.target
            if(!cursor) { return }

            const coin = cursor.value
            log(coin)
            cursor.continue()

        })
    })
})

addRandomValue.addEventListener('click', async () => {

    const randomItem = await methods('randomArrayItem').then(r_a_i => r_a_i(cryptos))
    const log = await methods('log')

    const db = await dbPromise
    const transaction = db.transaction('coins', 'readwrite')
    const store = transaction.objectStore('coins')
    const query = store.put({...randomItem})
    
    query.addEventListener('success', () => 
        log('A new item has been added succefully'))

    query.addEventListener('error', (event) => 
        log('An error occurred.', event))

    transaction.addEventListener('complete', () => 
        log('The transaction has been completed succefully'))

})