import nock from 'nock'
import sinon from 'sinon'
import { Prices } from 'server/data/models'
import chai, { expect, assert } from 'chai'
import { fetchPricesAndSave, fetchOpenOrders } from './binanceApi'
chai.should()

const reply = [
    {
        price: 0.123,
        symbol: 'ETHBTC',
    },
    {
        price: 0.242,
        symbol: 'MODBTC',
    }
]

describe('binanceApi:', () => {

    afterEach(() => nock.cleanAll())

    after(() =>  Prices.destroy({where: {$or: reply}}))

    it('fetchPricesAndSave() should save data into db', async () => {
        // intercept request
        nock('https://binance.com/api/v1')
            .get('/ticker/allPrices')
            .reply(200, reply)
        // fetch
        await fetchPricesAndSave()
        // validate db
        const savedPrices = await Prices.findAll()
        expect(savedPrices).to.have.length(reply.length)
        savedPrices.forEach(price => {
            expect(price).to.have.property('id')
            expect(price).to.have.property('price')
            expect(price).to.have.property('symbol')
            expect(price).to.have.property('createdAt')
        })
    })

    it('fetchOpenOrders should fetch orders ', async () => {
        const orders = await fetchOpenOrders()
        expect(orders).to.be.a('array')
    })
})