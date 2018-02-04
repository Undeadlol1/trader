import buyAndSell from 'server/bot/strategies/buyAndSell'
import simpleIteration from 'server/bot/strategies/simpleIteration'

/**
 * go over tasks and handle them with proper strategies
 * @param {array} tasks
 * @returns {array} array of possible buy/sell orders
 */
export default async function(tasks) {
    try {
        return await tasks.map(async task => {
            switch (task.strategy) {
                case 'buy_sell':
                    return await buyAndSell(task)
                case 'simple_iteration':
                    return await simpleIteration(task)
                default:
                    return
            }
        })
    } catch (error) {
        throw error
    }
}

export async function handleOrders(orders) {
    try {
        orders && orders.forEach(async order => {
            if (!prder) return
            if (order.isTest) {
                //
            }
            // else
        })
    } catch (error) {
        throw error
    }
}
/**
 * handleTasks returns array of orders
 * orders.forEach(order => {
 *  log(sometext)
 *  buyOrSell(order)
 * })
 */