import sinon from 'sinon'
import generateUuid from 'uuid/v4'
import chai, { expect, assert } from 'chai'
import simpleIteration from './simpleIteration'
import { Tasks, Logs, Prices, Balances } from 'server/data/models'
chai.should()
chai.use(require('chai-properties'))

const asset = 'ETH'
const symbol = asset + 'BTC'

describe('simpleIteration should return', () => {

    afterEach(async () => {
        await Prices.destroy({where: {symbol}})
        await Balances.destroy({where: {asset}})
        // FIXME: destroy tasks if needed
    })

    it('BUY order if price is low enough and balance is low',
        async () => {
            try {
                // create "price" document to pass to
                // NOTE: we don't really need to create it, we only need to pass it down
                const price = await Prices.create({symbol, price: '0.89'}).then(price => price.get('price'))
                // balance is less then the one which specified in task.toSpend
                const balance = await Balances.create({asset, free: '0.0'})
                // await Balances.create({asset, })
                const TaskId = generateUuid()
                const task = await Tasks.create({
                    symbol,
                    id: TaskId,
                    buyAt: '0.9',
                    sellAt: '1.0',
                    toSpend: '0.1',
                    UserId: 23423434,
                    strategy: 'simple_iteration',
                })
                // simpleIteration must return object which tells programm what to do next
                const response = await simpleIteration(task, price, balance)
                // response must tell programm to make "buy" operation
                expect(response)
                    .to.be.a('object')
                    .to.have.property('isBuy', true)

                // must create Log document with information about order
                const log = await Logs.findOne({where: {TaskId}, raw: true})
                // FIXME: add proper message
                expect(log).to.have.properties({TaskId, message: 'did buy'})
                // must update Task's isBought propery
                const updatedTask = await Tasks.findById(TaskId, {raw: true})
                expect(updatedTask).to.have.property('isBought', '1')
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    )

    it('SELL order if price is reached and balance is full',
        async () => {
            try {
                await Prices.create({symbol, price: '1.1'})
                await Balances.create({asset, free: '3.0' })
                const task = await Tasks.findOne()
                const TaskId = task.id
                const response = await simpleIteration(task)
                expect(response).to.be.a('object')
                expect(response).to.have.property('isSell', true)
                /*
                    "toSpend" must be increased after profit is gained.
                    Notice we use numbers here instead of strings.
                    Math explanation:
                    (sellAt - buyAt) * toSpend
                    (1.0 - 0.9) * 0.1
                    */
                const profit = 0.01
                // (old toSpend - fees) + profit
                // (0.1 - 0.1%) + 0.01
                const newSpendAmount = 0.109
                // FIXME: add this to buyAndSell
                expect(response)
                    .to.have.property('toSpend', newSpendAmount)
                    .to.be.a('number')
                expect(response)
                    .to.have.property('profit', 0.01)
                    .to.be.a('number')
                // must create log document with info about selling
                const log = await Logs.findOne({where: {TaskId: task.id}, raw: true})
                expect(log).to.have.properties({TaskId, message: 'did sell'})
                // must update task with information about profits
                const updatedTask = await Tasks.findById(TaskId, {raw: true})
                await assert.haveProperties(
                    updatedTask,
                    {
                        profit: '0.01',
                        isBought: '0', // FIXME: comment
                        toSpend: String(newSpendAmount)
                    },
                    'have proper values'
                )
                // expect(updatedTask).to.have.properties({
                //     profit: '0.01',
                //     isBought: '0', // FIXME: comments
                //     toSpend: String(newSpendAmount),
                // })
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    )
    /**
     * This test should make multiple calls to 'simpleIteration'.
     * Before each test run a certain price will be created.
     * Afterwards test will verify were currency was sold or bought,
     * was Task updated properly and were Log documents created.
     */
    it('properly on multiple iterations',
        async () => {
            const asset = 'CND'
            const symbol = asset + 'BTC'
            // FIXME: comments
            await Tasks.create({
                symbol,
                sellAt: '1',
                buyAt: '0.9',
                UserId: 123456,
                strategy: 'simple_iteration',
            })
            // const tasks = [
            //     {toSpend: '1', afterProfit: 0.1, afterSpend: 1.09},
            //     {toSpend: '1.09', afterProfit: 0.109, afterSpend: 1.1881},
            //     {toSpend: '1.1881', afterProfit: 0.11881, afterSpend: 1.295029},
            //     {toSpend: '1.295029', afterProfit: 0.1295029, afterSpend: 1.41158161},
            // ]
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

    describe('undefined if', () => {
        it('there is enough currency but price is not high enough',
            async () => {
                await Prices.create({symbol, price: '0.8'})
                await Balances.create({asset, free: '3.0' })
                const task = { symbol, sellAt: '1.0', toSpend: '0.1' }
                const response = await simpleIteration(task)
                expect(response).to.be.a('undefined')
            }
        )

        it('there is not enough currency but price is high enough',
            async () => {
                await Prices.create({symbol, price: '1.1'})
                await Balances.create({asset, free: '0.01' })
                const task = { symbol, sellAt: '1.0', toSpend: '0.1' }
                const response = await simpleIteration(task)
                expect(response).to.be.a('undefined')
            }
        )
    })

})