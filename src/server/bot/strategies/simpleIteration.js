import selectn from 'selectn'
import { Decimal } from 'decimal.js'
import { pricesAreRecent } from '../checkers'
import { Tasks, Prices, Logs, Balances } from 'server/data/models'
/**
 * Simple strategy which buys and sells currency at given price.
 * Works until is manually cancelled.
 * Every gained profit will increase spending amount.
 * @param {object} task task sequelize model Instance
 * // TODO: this are not used
 * @param {string} price symbol's lates price
 * @param {string} balance user balance of task.symbol
 * @export
 */
export default async function(task) {
    // FIXME: add Task.testBalance
    /**
     * Logic:
     * Check price and account balances.
     * If we have appropriate amount of currency and price have reached given point then sell currency.
     * If we don't have currency and price is lower than given point then buy currency.
     * Else do nothing.
     */
    try {
        // gather data
        const   balance = await Balances.getLatest(task.symbol.slice(0, -3)), // symbol second pair length could be a problem
                price   = selectn('price', await Prices.getLatestPrice(task.symbol)),
                hasEnoughCurrency = selectn('free', balance) >= task.toSpend * price
        // check if prices are recent enough
        if (await !pricesAreRecent(task.symbol)) return
        // if user has enough currency and price is high enough he should sell it
        if (hasEnoughCurrency && (task.sellAt <= price)) {
            // We use Decimal library because working with deciamals via
            // native js functions is close to impossible. It is incredibly buggy.
            const   buyAt     = new Decimal(task.buyAt),
                    sellAt    = new Decimal(task.sellAt),
                    toSpend   = new Decimal(task.toSpend),
                    profit    = toSpend.times(sellAt.minus(buyAt)),
                    fee       = toSpend.mul(new Decimal(0.01))
            await task.addMessage('did sell')
            await task.update({
                // FIXME: comment about this
                isBought: false,
                profit: Number(profit),
                // Increase spending amount with profit (minus trading fee)
                toSpend: Number(toSpend.minus(fee).plus(profit)),
            })
            return {
                isSell: true,
                isBought: task.isTest,
                profit: Number(profit),
                // Increase spending amount with profit (minus trading fee)
                toSpend: Number(toSpend.minus(fee).plus(profit)),
            }
        }
        // if user does not have currency and price is low enoung he should buy it
        else if (!hasEnoughCurrency && (task.buyAt >= price)) {
            await task.addMessage('did buy')
            await task.update({isBought: true})
            // delete this in future
            return {
                isBuy: true,
                // FIXME: add tests
                // FIXME: add tests to buyAnSell
                isBought: task.isTest
            }
        }
    }
    catch (error) {throw error}
}
/**
 * what could be done:
 * Move price and balance into params (or even make params a configuration object instead of multiple ones)
 * (This is just a thought)
 * Every strategy shall return this object
 * {
 *  task,
 *  valuesToUpdate,
 *  messageToLog,
 *  toBuy,
 *  toSell,
 * }
 */