import { Logs, Tasks } from 'server/data/models'
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
/**
 * handleTasks returns array of orders
 * orders.forEach(order => {
 *  log(sometext)
 *  buyOrSell(order)
 * })
 */
export async function handleOrders(orders) {
    try {
        orders && orders.forEach(async order => {
            // do nothing if there is no order
            if (!order) return
            // if order is not a test run sell/buy functions
            if (!order.isTest) {
                // run actual functions here
            }
            const sellMessage = 'Sold a coin'
            const buyMessage = 'Bought a coin'
            // create log messages
            await Logs.create({
                ...order,
                message: order.side == 'BUY' ? buyMessage : sellMessage
            })
            // console.log('what i did:', order.side == 'BUY' ? buyMessage : sellMessage)
            // TODO: tests
            // if ".isDone" is set update Task
            if (order.isDone) {
                await Tasks.update({isDone: true}, {where: {id: odrder.TaskId}})
            }
            return
        })
    } catch (error) {
        throw error
    }
}