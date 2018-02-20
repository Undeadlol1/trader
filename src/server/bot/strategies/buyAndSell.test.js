import sinon from 'sinon'
import buyAndSell from './buyAndSell'
import chai, { expect, assert } from 'chai'
import { Prices, Balances } from 'server/data/models'
chai.should()

const asset = 'ETH'
const symbol = asset + 'BTC'

describe('buyAndSell should return', () => {

    afterEach(async () => {
        await Prices.destroy({where: {symbol}})
        await Balances.destroy({where: {asset}})
    })

    it('BUY order if price is low enough and balance is low',
        async () => {
            await Prices.create({symbol, price: '0.89'})
            // balance is less then the one which specified in task.toSpend
            await Balances.create({asset, free: '0.0' })
            // await Balances.create({asset, })
            const task = { symbol, buyAt: '0.9', toSpend: '0.1' }
            const response = await buyAndSell(task)
            expect(response).to.be.a('object')
            expect(response).to.have.property('isBuy', true)
        }
    )

    it('SELL order if price is reached and balance is full',
        async () => {
            await Prices.create({symbol, price: '1.1'})
            await Balances.create({asset, free: '3.0' })
            const task = { symbol, sellAt: '1.0', toSpend: '0.1' }
            const response = await buyAndSell(task)
            expect(response).to.be.a('object')
            expect(response).to.have.property('isSell', true)
            expect(response).to.have.property('isDone', true)
        }
    )

    describe('undefined if', () => {
        it('there is enough currency but price is not high enough',
            async () => {
                await Prices.create({symbol, price: '0.8'})
                await Balances.create({asset, free: '3.0' })
                const task = { symbol, sellAt: '1.0', toSpend: '0.1' }
                const response = await buyAndSell(task)
                expect(response).to.be.a('undefined')
            }
        )

        it('there is not enough currency but price is high enough',
            async () => {
                await Prices.create({symbol, price: '1.1'})
                await Balances.create({asset, free: '0.01' })
                const task = { symbol, sellAt: '1.0', toSpend: '0.1' }
                const response = await buyAndSell(task)
                expect(response).to.be.a('undefined')
            }
        )
    })

})