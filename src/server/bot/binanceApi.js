import 'isomorphic-fetch' // TODO move to server? or to webpack?
import binanceApi from 'binance'
import { Prices } from 'server/data/models'

const apiKey = process.env.BINANCE_KEY
const secretKey = process.env.BINANCE_SECRET
const binanceRest = new binanceApi.BinanceRest({key: apiKey, secret: secretKey})

export function sell() {

}

export function buy() {

}

/**
 * WIP should not use
 * returns {Promise}
 */
export function fetchOpenOrders() {
    // this is important
    // function is used in different places in bot
    // in order to not get banned due to request limits we need to properly intercept calls
    if (process.env.NODE_ENV == 'test') return Promise.resolve([])
    return binanceRest
        .openOrders()
        .then(res => {
            console.log('res', res)
            return res
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    // return fetch('https://binance.com/api/v3/openOrders', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         apiKey,
    //         secretKey,
    //     })
    // })
    //     .then(res => res.json())
    //     .then(res => {
    //         console.log('res: ', res);
    //         return Prices.bulkCreate(res)
    //     })
    //     .catch(error => {
    //         console.error(error)
    //         throw error
    //     })
}

/**
 * fetch prices info and save it in database
 * returns {Promise} promise of Prices.bulkCreate()
 */
export function fetchPricesAndSave() {
    return fetch('https://binance.com/api/v1/ticker/allPrices')
        .then(res => res.json())
        .then(data => Prices.bulkCreate(data))
        .catch(error => {
            console.error(error)
            throw error
        })
}

/**
 * TODO:
 */
export function fetchBalance() {
    // this is important
    // function is used in different places in bot
    // in order to not get banned due to request limits we need to properly intercept calls
    if (process.env.NODE_ENV == 'test') return Promise.resolve([])
    return binanceRest
        .account()
        .then(res => {
            // console.log('res', res)
            return res
        })
        .catch(error => {
            console.error(error)
            throw error
        })
}