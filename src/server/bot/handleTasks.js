import buyAndSell from 'server/bot/strategies/buyAndSell'
import simpleIteration from 'server/bot/strategies/simpleIteration'

/**
 * go over tasks and handle when by with proper strategies
 * @param {array} tasks
 */
export default async function(tasks) {
    try {
        tasks.map(async task => {
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