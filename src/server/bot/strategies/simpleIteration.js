import { Prices } from 'server/data/models'
import { pricesAreRecent } from '../checkers'
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
        const price = await Prices.getLatestPrice(task.symbol)
        if (!pricesAreRecent(task.symbol)) return
        // const balances =
        // const balance =
        if (task.isTest) {

        }
    } catch (error) {
        throw error
    }
}