import { Prices, Balances } from 'server/data/models'
import { pricesAreRecent } from '../checkers'
import selectn from 'selectn'
/**
 * simple strategy which buys and sells
 * currency at given price untill task is cancelled
 * @param {object} task
 */
export default async function(task) {
    /**
     * logic:
     * check price and account balances
     * if we have appropriate amount of currency and price have reached given point then sell currency
     * if we don't have currency and price is lower and given point then buy currency
     * else do nothing
     */
    try {
        const price = selectn('price', await Prices.getLatestPrice(task.symbol))
        const balance = await Balances.getLatest(task.symbol.slice(0, -3))
        // const orders
        if (await !pricesAreRecent(task.symbol)) return
        if (task.isTest) {

        }
    } catch (error) {
        throw error
    }
}