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
        // Prepare variables.
        // We use Decimal library because working with deciamals via
        // native js functions is close to impossible. It is incredibly buggy.
        const   buyAt     = new Decimal(task.buyAt),
                sellAt    = new Decimal(task.sellAt),
                toSpend   = new Decimal(task.toSpend)
        // Gather data
        const   balance = selectn('free', await Balances.getLatest(task.symbol.slice(0, -3))) || 0, // symbol second pair length could be a problem
                price   = selectn('price', await Prices.getLatestPrice(task.symbol))
        // Make calculations
        const   profit    = Decimal(task.profit || 0).plus(toSpend.times(sellAt.minus(buyAt))),
                fee       = toSpend.mul(new Decimal(0.01)),
                hasEnoughCurrency = Decimal(balance).greaterThanOrEqualTo(Decimal(toSpend).times(price))
        // console.log('buyAt: ', buyAt.toString());
        // console.log('price: ', price.toString());
        // console.log('balance', balance.toString());
        // console.log('sellAt: ', sellAt.toString());
        // console.log('toSpend: ', toSpend.toString());
        // console.log('profit: ', profit.toString());
        // console.log('fee: ', fee.toString());
        // console.log('hasEnoughCurrency: ', hasEnoughCurrency);
        // console.log('task.isBought: ', task.isBought);
        // check if prices are recent enough
        if (await !pricesAreRecent(task.symbol)) return
        // if user has enough currency and price is high enough he should sell it
        if (
            (task.isTest && sellAt.lessThanOrEqualTo(price) && task.isBought)
            || (hasEnoughCurrency && sellAt.lessThanOrEqualTo(price))
        ) {
            // console.log('about to SELL');
            await task.addMessage(`Sold ${task.symbol} for ${price}. Profit is: ${profit}`)
            await task.update({
                // FIXME: comment about this
                isBought: false,
                profit: Number(profit),
                // Increase spending amount with profit (minus trading fee)
                toSpend: Number(toSpend.minus(fee).plus(profit)),
            })
        }
        // if user does not have currency and price is low enough he should buy it
        else if (
            (task.isTest && buyAt.greaterThanOrEqualTo(price) && !task.isBought)
            || (!hasEnoughCurrency && buyAt.greaterThanOrEqualTo(price))
        ) {
            // console.log('about to BUY');
            await task.addMessage(`Bought ${task.symbol} for ${price}.`)
            await task.update({isBought: true})
        }
        else return Promise.resolve()
    }
    catch (error) {
        console.log(error)
        throw error
    }
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