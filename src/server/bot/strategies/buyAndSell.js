import { Prices, Balances } from 'server/data/models'
import { pricesAreRecent } from '../checkers'
import selectn from 'selectn'

/**
 * simple strategy which buys and sells currency at given price
 * @param {object} task
 */
export default async function(task) {
    /**
     * logic:
     * check price and account balances
     * if we have appropriate amount of currency and price have reached given point then sell currency
     * if we don't have currency and price is lower than given point then buy currency
     * else do nothing
     */
    try {
        const price = selectn('price', await Prices.getLatestPrice(task.symbol))
        const balance = await Balances.getLatest(task.symbol.slice(0, -3))
        // does user have enough currency to sell
        const hasEnoughCurrency = selectn('free', balance) >= task.toSpend * price
        // check if prices are recent enough
        if (await !pricesAreRecent(task.symbol)) return
        // if user has enough currency already he should not buy
        if (!hasEnoughCurrency && (task.buyAt >= price)) return { isBuy: true }
        else if (hasEnoughCurrency && (task.sellAt <= price)) return { isSell: true }
    } catch (error) {
        throw error
    }
}