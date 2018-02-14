import { Prices, Balances } from 'server/data/models'
import { pricesAreRecent } from '../checkers'
import { Decimal } from 'decimal.js'
import selectn from 'selectn'
// FIXME: transaction fees
/**
 * Simple strategy which buys and sells currency at given price.
 * Works until is manually cancelled.
 * Every gained profit will increase spending amount.
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
        if (!hasEnoughCurrency && (task.buyAt >= price)) return {
            isBuy: true,
            // FIXME: add tests
            // FIXME: add tests to buyAnSell
            isBought: task.isTest
        }
        else if (hasEnoughCurrency && (task.sellAt <= price)) {
            // FIXME: add comments
            const buyAt = new Decimal(task.buyAt)
            const sellAt = new Decimal(task.sellAt)
            const toSpend = new Decimal(task.toSpend)
            const profit = toSpend.times(sellAt.minus(buyAt))
            const fee = toSpend.mul(new Decimal(0.01))
            // self explanatory
            const newSpendAmount = toSpend.minus(fee).plus(profit)
            return {
                isSell: true,
                isBought: task.isTest,
                profit: Number(profit),
                // FIXME: add comments
                toSpend: Number(newSpendAmount),
            }
        }
    } catch (error) {
        throw error
    }
}