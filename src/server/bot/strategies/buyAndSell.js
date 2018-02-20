import selectn from 'selectn'
import { pricesAreRecent } from '../checkers'
import { Prices, Balances } from 'server/data/models'
/**
 * simple strategy which buys and sells currency at given price
 * @param {object} task
 */
export default async function(task) {
    /**
     * Logic:
     * Check price and account balances.
     * If we have appropriate amount of currency and price have reached given point then sell currency.
     * If we don't have currency and price is lower than given point then buy currency.
     * Else do nothing.
     */
    try {
        const price = selectn('price', await Prices.getLatestPrice(task.symbol))
        const balance = await Balances.getLatest(task.symbol.slice(0, -3))
        // does user have enough currency to sell
        const hasEnoughCurrency = selectn('free', balance) >= task.toSpend * price
        // check if prices are recent enough
        if (await !pricesAreRecent(task.symbol)) return
        // if user has enough currency already he should not buy
        if (!hasEnoughCurrency && (task.buyAt >= price)) return {
            isBuy: true,
            isBought: task.isTest
        }
        else if (hasEnoughCurrency && (task.sellAt <= price)) return {
            isSell: true,
            isDone: true,
            isBought: task.isTest,
            profit: (task.sellAt - task.buyAt) * task.toSpend
        }
    } catch (error) {
        throw error
    }
}