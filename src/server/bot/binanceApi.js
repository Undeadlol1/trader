import 'isomorphic-fetch' // TODO move to server? or to webpack?
import selectn from 'selectn'
import binanceApi from 'binance'
import { Prices, Balances, Candles } from 'server/data/models'

const apiKey = process.env.BINANCE_KEY
const secretKey = process.env.BINANCE_SECRET
const binanceRest = new binanceApi.BinanceRest({key: apiKey, secret: secretKey, handleDrift: true})

export function sell() {

}

export function buy() {

}

/**
 * WIP should not use
 * @returns {Promise}
 */
export function fetchOpenOrders() {
    // this is important
    // function is used in different places in bot
    // in order to not get banned due to request limits we need to properly intercept calls
    if (process.env.NODE_ENV == 'test') return Promise.resolve([])
    return binanceRest
        .openOrders()
        .then(res => res)
        .catch(error => {
            console.warn('error occured in fetchOpenOrders()')
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
 * @returns {promise} promise created by Prices.bulkCreate
 */
export function fetchPricesAndSave() {
    return fetch('https://binance.com/api/v1/ticker/allPrices')
        .then(res => res.json())
        .then(data => Prices.bulkCreate(data))
        .catch(error => {
            console.warn('error occured in fetchPricesAndSave()')
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
            return Balances
                .bulkCreate(res)
                .then(() => res)
        })
        .catch(error => {
            console.warn('error occured in fetchBalance()')
            console.error(error)
            throw error
        })
}
/**
 * Fetch candles historical data based on symbol.
 * @param {Object} options
 * @param {string} options.symbol
 * @param {string} options.interval ENUM: [1m, 1h, and so on]
 * @param {number} options.startTime start date
 * @param {number} options.endTime end date
 * @export
 */
export async function fetchCandles(options) {
    /**
     * 1) Check if candles exists.
     * 2) If there are check if they are fresh enough.
     * 3) Fetch cnadles if records are not fresh or if they don't exists at all.
     * 4) Save results into database and return them.
     */
    try {
        // Time of most recent candle
        const closeTime = await Candles.findOne({
            // There is default scope, so setting "order"
            // is not neccesery.
            where: {
                symbol: options.symbol,
                interval: options.interval,
            }
        })
        .then(candle => candle && candle.closeTime)
        const tenMinutesAgo = Date.now() - (1000 * 60 * 10)
        if (closeTime && closeTime > tenMinutesAgo) return Promise.resolve()
        // Fetch candles and normalise results.
        const candles = await fetch('https://binance.com/api/v1/klines', {
            method: 'GET',
            // If there is a recently fetched candles, use it's date as 'startTime'.
            // This means that we do not need all the candles, only ones we do not have.
            body: JSON.stringify({
                ...options,
                startTime: closeTime ? closeTime : options.endTime
            }),
        })
        .then(res => res.json())
        // Beautify and normalise data before saving to database.
        .then(res => beautifyCandles(res, options.symbol, options.interval))
        // Save candles into database.
        await Candles.bulkCreate(candles)
        return candles
    }
    catch (error) {
        throw error
    }
}
/**
 * @export
 */
export async function prefetchCandles() {
    try {
        const symbol = 'BTCUSDT'

        const candles = await fetchCandles({
            symbol,
            interval: '1m',
            startTime: '', // Startis 1 month ago
            endTime: Date.now(),
        })
    }
    catch (error) {
        throw error
    }
}

/**
 * Api servers respond with barebone array of candles data.
 * This function turns array of data into object with readable properties.
 * @param {array} array unprocessed candles
 * @return {array} beautified array of objects
 */
function beautifyCandles(array, symbol, interval) {
    return array.map((candle, index) => {
        const beautifiedCandle = {}
        const objectProperties = [
            'openTime',
            'open',
            'high',
            'low',
            'close',
            'volume',
            'closeTime',
            'quoteAssetVolume',
            'trades',
            'baseAssetVolume',
            'quoteAssetVolume',
        ]
        objectProperties.forEach((prop, i) => {
            return beautifiedCandle[prop] = candle[i]
        })
        // assign missing props
        beautifiedCandle.symbol = symbol
        beautifiedCandle.interval = interval
        return beautifiedCandle
    })
}