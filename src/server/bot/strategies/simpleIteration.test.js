import sinon from 'sinon'
import chai, { expect, assert } from 'chai'
import simpleIteration from './simpleIteration'
import { Prices, Balances } from 'server/data/models'
chai.should()

const asset = 'ETH'
const symbol = asset + 'BTC'

describe('simpleIteration should return', () => {

    afterEach(async () => {
        await Prices.destroy({where: {symbol}})
        await Balances.destroy({where: {asset}})
    })

    it('BUY order if price is low enough and balance is low',
        async () => {
            const price = await Prices.create({symbol, price: '0.89'}).then(price => price.get('price'))
            // balance is less then the one which specified in task.toSpend
            const balance = await Balances.create({asset, free: '0.0'})
            // await Balances.create({asset, })
            const task = { symbol, buyAt: '0.9', toSpend: '0.1' }
            const response = await simpleIteration(task, price, balance)
            expect(response).to.be.a('object')
            expect(response).to.have.property('isBuy', true)
        }
    )

    it('SELL order if price is reached and balance is full',
        async () => {
            await Prices.create({symbol, price: '1.1'})
            await Balances.create({asset, free: '3.0' })
            const task = { symbol, sellAt: '1.0', toSpend: '0.1', buyAt: '0.9' }
            const response = await simpleIteration(task)
            expect(response).to.be.a('object')
            expect(response).to.have.property('isSell', true)
            // "toSpend" must be increased after profit is gained
            // notice we use numbers here instead of strings.
            // Math explanation:
            // (sellAt - buyAt) * toSpend
            // (1.0 - 0.9) * 0.1
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
        }
    )

    it('properly on multiple iterations',
        async () => {
            const asset = 'CND'
            const symbol = asset + 'BTC'
            const tasks = [
                {buyAt: '0.9', sellAt: '1.0', toSpend: '1', afterProfit: 0.1, afterSpend: 1.09},
                {buyAt: '0.9', sellAt: '1.0', toSpend: '1.09', afterProfit: 0.109, afterSpend: 1.1881},
                {buyAt: '0.9', sellAt: '1.0', toSpend: '1.1881', afterProfit: 0.11881, afterSpend: 1.295029},
                {buyAt: '0.9', sellAt: '1.0', toSpend: '1.295029', afterProfit: 0.1295029, afterSpend: 1.41158161},
            ]
            await Prices.create({symbol, price: '1.1'})
            await Balances.create({asset, free: '3.0'})
            // using multiple arrays for easier error handling
            const orders = await Promise.all(tasks.map(task => {
                return simpleIteration({symbol, ...task})
            }))
            orders.forEach((order, index) => {
                const task = tasks[index]
                expect(order)
                    .to.have.property('toSpend', task.afterSpend)
                    .to.be.a('number')
                expect(order)
                    .to.have.property('profit', task.afterProfit)
                    .to.be.a('number')
            })
            // TODO: order.isBought == undefined may create problems
        }
    )

    // TODO: multiple iteration tests

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