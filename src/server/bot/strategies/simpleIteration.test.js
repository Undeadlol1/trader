import sinon from 'sinon'
import generateUuid from 'uuid/v4'
import chai, { expect, assert } from 'chai'
import simpleIteration from './simpleIteration'
import { Tasks, Logs, Prices, Balances } from 'server/data/models'
chai.should()
chai.use(require('chai-properties'))

const asset = 'ETH'
const symbol = asset + 'BTC'
const TaskId = generateUuid()

describe('simpleIteration should do', () => {

    // clean up
    after(async () => {
        await Tasks.destroy({where: {id: TaskId}})
        await Logs.destroy({where: {TaskId}})
    })

    afterEach(async () => {
        // since tests are ran almost instantly,
        // "createdAt" property is same every time.
        // This makes it impossible to get latest log.
        await Logs.destroy({where: {TaskId}})
        await Prices.destroy({where: {symbol}})
        await Balances.destroy({where: {asset}})
    })

    it('BUY order if price is low enough and balance is low',
        async () => {
            // create "price" and "balance" documents
            await Prices.create({symbol, price: '0.89'})
            // balance is less then the one which specified in task.toSpend
            await Balances.create({asset, free: '0.0'})
            const task = await Tasks.create({
                symbol,
                id: TaskId,
                buyAt: '0.9',
                sellAt: '1.0',
                toSpend: '0.1',
                UserId: 23423434,
                strategy: 'simple_iteration',
            })
            // run function with new Task
            await simpleIteration(task)
            // must create Log document with information about order
            const log = await Logs.getLatest(TaskId)
            expect(log).to.have.property('TaskId', TaskId)
            expect(log).to.have.property('message', 'Bought ETHBTC for 0.89.')
            // must update Task's isBought property
            expect(await task.reload()).to.have.property('isBought', '1')
        }
    )

    it('SELL order if price is reached and balance is full',
        async () => {
            await Prices.create({symbol, price: '1.1'})
            await Balances.create({asset, free: '3.0'})
            const task = await Tasks.findById(TaskId)
            await simpleIteration(task)
            /*
                Math explanation:
                (sellAt - buyAt) * toSpend
                (1.0 - 0.9) * 0.1
            */
            const profit = '0.01'
            // (old toSpend - fees) + profit
            // (0.1 - 0.1%) + 0.01
            const newSpendAmount = '0.109'
            // must create log document with info about selling
            const log = await Logs.getLatest(TaskId)
            expect(log).to.have.property("TaskId", TaskId)
            expect(log).to.have.property('message', 'Sold ETHBTC for 1.1. Profit is: 0.01');
            // must update task with after sell information
            const updatedTask = await task.reload()
            // profit must be calculated
            expect(updatedTask).to.have.property('profit', profit)
            // "toSpend" must be increased after profit is gained
            expect(updatedTask).to.have.property('isBought', '0')
             // FIXME: comments
            expect(updatedTask).to.have.property('toSpend', newSpendAmount)
        }
    )
    /**
     * This test should make multiple calls to 'simpleIteration'.
     * Before each test run a certain price will be created.
     * Afterwards test will verify were currency was sold or bought,
     * was Task updated properly and were Log documents created.
     */
    /**
     * NOTE: explanation for myself:
     * just write down what should happane after multiple iterations with certain values
     * Make iteration
     * and verify results
     * Do not bother to verify everything in between
     */
    it('properly on multiple iterations',
        async () => {
            const asset = 'CND'
            const symbol = asset + 'BTC'
            // FIXME: comments
            const task = await Tasks.create({
                symbol,
                sellAt: '1',
                buyAt: '0.9',
                toSpend: '1',
                UserId: 123456,
                strategy: 'simple_iteration',
            })
            const iterations = [
                // Price is higher then 'sellAt' but there are no funds yet. Must do nothing.
                {price: '1.1', toSpend: '1', afterProfit: null, afterSpend: null},
                // Price is low enough. Must buy.
                {price: '0.9', toSpend: '1', afterProfit: null, afterSpend: null},
                // Price is between prie and sell thresholds. Must do nothing
                {price: '0.95', toSpend: '1', afterProfit: null, afterSpend: null},
                // Price is higher and balance is full. Must sell.
                {price: '1', toSpend: '1', afterProfit: 0.1, afterSpend: 1.09},
                // Price is even higher. Must do nothing because balance is empty now
                {price: '1.1', toSpend: '1.09', afterProfit: null, afterSpend: null},
                // Price is low. Must buy.
                {price: '0.9', toSpend: '1.09', afterProfit: null, afterSpend: null},
                // Price is high enough again. Must buy.
                {price: '1.1', toSpend: '1.09', afterProfit: 0.109, afterSpend: 1.1881},
            ]

            Promise.all(
                iterations.map(async i => {
                    // Destroy previous prices and logs because 'createdAt' is
                    // always the same and impossible to get latest documents properly.
                    await Logs.destroy({where: {TaskId: task.id}})
                    await Prices.destroy({where: {symbol}})
                    await Prices.create({symbol, price: i.price})
                    // await Balances.create({asset, free: '3.0'})
                    await simpleIteration(task)
                    console.log('task: ', task);
                    const log = await TaskId.getLatestLog()
                    console.log('log: ', log);
                })
            )

            // await Prices.create({symbol, price: '1.1'})
            // await Balances.create({asset, free: '3.0'})
            // // using multiple arrays for easier error handling
            // // FIXME: this is wrong
            // const orders = await Promise.all(tasks.map(task => {
            //     return simpleIteration({symbol, ...task})
            // }))
            // orders.forEach((order, index) => {
            //     const task = tasks[index]
            //     expect(order)
            //         .to.have.property('toSpend', task.afterSpend)
            //         .to.be.a('number')
            //     expect(order)
            //         .to.have.property('profit', task.afterProfit)
            //         .to.be.a('number')
            // })
            // // TODO: order.isBought == undefined may create problems
        }
    )

    describe('nothing if', () => {
        const anotherTaskId = generateUuid()
        // destory task after each test to avoid errors
        afterEach(async () => await Tasks.destroy({where: {id: anotherTaskId}}))
        it('there is enough currency but price is not high enough',
            async () => {
                await Prices.create({symbol, price: '0.8'})
                await Balances.create({asset, free: '3.0'})
                const task = await Tasks.create({
                    symbol,
                    buyAt: '0.7',
                    sellAt: '1.0',
                    toSpend: '0.1',
                    UserId: 23423434,
                    id: anotherTaskId,
                    strategy: 'simple_iteration',
                })
                await simpleIteration(task)
                // no logs must be created
                const logs = await Logs.findAll({where: {TaskId: anotherTaskId}})
                expect(logs).to.have.length(0)
                // task must not be updated
                const updatedTask = await task.reload()
                expect(updatedTask).to.have.property("profit", null)
                expect(updatedTask).to.have.property("toSpend", task.toSpend)
            }
        )

        it('there is not enough currency but price is high enough',
            async () => {
                await Prices.create({symbol, price: '1.1'})
                await Balances.create({asset, free: '0.01'})
                const task = await Tasks.create({
                    symbol,
                    buyAt: '0.9',
                    sellAt: '1.0',
                    toSpend: '0.1',
                    UserId: 23423434,
                    id: anotherTaskId,
                    strategy: 'simple_iteration',
                })
                await simpleIteration(task)
                // no logs must be created
                const logs = await Logs.findAll({where: {TaskId: anotherTaskId}})
                expect(logs).to.have.length(0)
                // task must not be updated
                const updatedTask = await task.reload()
                expect(updatedTask).to.have.property("profit", null)
                expect(updatedTask).to.have.property("toSpend", task.toSpend)
            }
        )
    })

})