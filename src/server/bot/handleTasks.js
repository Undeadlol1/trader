import { Logs, Tasks } from 'server/data/models'
import buyAndSell from 'server/bot/strategies/buyAndSell'
import simpleIteration from 'server/bot/strategies/simpleIteration'

/**
 * go over tasks and handle them with proper strategies
 * @param {array} tasks
 * @returns {[Promises]} array of possible buy/sell orders
 */
export default async function handleTasks(tasks) {
    try {
        const functions = {
            buy_sell: buyAndSell,
            simple_iteration: simpleIteration,
        }
        // Run backtests if needed.
        if (task.isBacktest) {
            // const data
            return await functions[task.strategy](task)
        }
        // Or run task's strategies normally.
        else {
            return functions[task.strategy](task)
        }
    } catch (error) {
        throw error
    }
}
/**
 * go over orders and:
 * 1) decide if anything needs to be done
 * 2) update task if needed
 * 3) call buy/or sell function
 * ! dont forget to use "await Promise.all()"
 * @example
 * const orders = await Promise.all(await handleTasks(tasks))
 * @param {array} orders
 */
export async function handleOrders(orders) {
    try {
        orders && orders.forEach(async order => {
            // do nothing if there is no order
            if (!order) return
            // if order is not a test run sell/buy functions
            if (!order.isTest) {
                // run actual functions here
                // TODO: don't forget about fee calculation
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
            const where = {where: {id: order.TaskId}}
            if (order.isTest) {
                await Tasks.update(order, where) // TODO: this might be a problem someday
            }
            // if ".isDone" is set update Task
            if (order.isDone) {
                await Tasks.update({isDone: true, profit: order.profit}, where)
            }
            return
        })
    } catch (error) {
        throw error
    }
}