import simpleIteration from 'server/bot/strategies/simpleIteration'

/**
 * go over tasks and handle when by with proper strategies
 * @param {array} tasks
 */
export default async function(tasks) {
    try {
        tasks.map(task => {
            switch (task.strategy) {
                case 'simple_iteration':
                    simpleIteration(task)
                    break;
                default:
                    break;
            }
        })
    } catch (error) {
        throw error
    }
}