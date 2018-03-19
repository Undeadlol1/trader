import nock from 'nock'
import sinon from 'sinon'
import chai, { expect, assert } from 'chai'
import { Prices, Candles } from 'server/data/models'
import { fetchPricesAndSave, fetchOpenOrders, fetchCandles } from './binanceApi'
chai.should()
chai.use(require('chai-things'))

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

const candlesInterval = '1m'
const candlesSymbol = 'BTCUSDT'
const payload = {
    symbol: candlesSymbol,
    interval: candlesInterval,
    // From today.
    endTime: Date.now(),
    // To a 3 months ago.
    startTime: Date.now() - (1000 * 60 * 60 * 24 * 90),
}
const candlesReply = [
//     const cart = faker.random.array(1, 5, function (index) {
//     return (
//         itemId: faker.random.uuid(),
//             qty: faker.random.number(10)
// };
// });
    [
        1499040000000,      // Open time
        "0.01634790",       // Open
        "0.80000000",       // High
        "0.01575800",       // Low
        "0.01577100",       // Close
        "148976.11427815",  // Volume
        1499644799999,      // Close time
        "2434.19055334",    // Quote asset volume
        308,                // Number of trades
        "1756.87402397",    // Taker buy base asset volume
        "28.46694368",      // Taker buy quote asset volume
        "17928899.62484339" // Ignore
    ],
    [
        1499040000000,      // Open time
        "0.01634790",       // Open
        "0.80000000",       // High
        "0.01575800",       // Low
        "0.01577100",       // Close
        "148976.11427815",  // Volume
        1499644799999,      // Close time
        "2434.19055334",    // Quote asset volume
        308,                // Number of trades
        "1756.87402397",    // Taker buy base asset volume
        "28.46694368",      // Taker buy quote asset volume
        "17928899.62484339" // Ignore
    ],
    [
        1499040000000,      // Open time
        "0.01634790",       // Open
        "0.80000000",       // High
        "0.01575800",       // Low
        "0.01577100",       // Close
        "148976.11427815",  // Volume
        1499644799999,      // Close time
        "2434.19055334",    // Quote asset volume
        308,                // Number of trades
        "1756.87402397",    // Taker buy base asset volume
        "28.46694368",      // Taker buy quote asset volume
        "17928899.62484339" // Ignore
    ]
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
    /**
     * FIXME: comments
     */
    describe('fetchCandles()', () => {
        before(async () => {
            // make sure there are no items in database before test run
            expect(await Candles.findAll()).to.have.length(0)
        })
        // clean up
        afterEach(async () => {
            await nock.cleanAll()
            await Candles.destroy({ where: {} })
        })

        it('should save candles in db', async () => {
            // intercept API call
            const apiRequest = nock('https://binance.com/api/v1/')
                .get('/klines')
                .query(true)
                .reply(200, candlesReply)
            // Call function.
            await fetchCandles(payload)
            // Verify results.
            const newCandles = await Candles.findAll()
            // Make sure request was done to a mocked resource.
            expect(apiRequest.isDone()).to.be.true
            expect(newCandles).to.have.length(3)
            expect(newCandles).all.to.have.property('symbol', candlesSymbol)
            expect(newCandles).all.to.have.property('interval', candlesInterval)
        })
        /**
         * If Candles were recently fetched function should not make
         * API request. This is usefull if function will be used in interval.
         * Plus there will be no copies of Candles because there is not unique
         * index in database setup yet.
         */
        it('should not fetch if records are fresh', async() => {
            // Create candle with recent date.
            await Candles.create({
                symbol: candlesSymbol,
                closeTime: Date.now(),
                interval: candlesInterval,
            })
            // Intercept request.
            const request = nock('https://binance.com/api/v1/')
                .get('/klines')
                .query(true)
                .reply(200, candlesReply)
            // Invoke function.
            await fetchCandles(payload)
            // Verify results.
            assert.isFalse(request.isDone(), 'request should not be invoked');
        })

        it('should fetch if records are not fresh enough', async () => {
            // Create candle with old date.
            await Candles.create({
                symbol: candlesSymbol,
                // Latest fetch was one hour ago.
                interval: candlesInterval,
                closeTime: Date.now() - (1000 * 60 * 60),
            })
            // Intercept request.
            const request = nock('https://binance.com/api/v1/')
                .get('/klines')
                .query(true)
                .reply(200, candlesReply)
            // Invoke function.
            await fetchCandles(payload)
            // Verify results.
            assert.isTrue(request.isDone(), 'request should be invoked');
        })
    })
})