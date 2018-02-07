import nock from 'nock'
import sinon from 'sinon'
import generateUuid from 'uuid/v4'
import chai, { expect, assert } from 'chai'
import { Prices, Tasks, Logs } from 'server/data/models'
import handleTasks, { handleOrders } from './handleTasks'
chai.should()

const tasks = [
    {
        id: 123,
        payload: {},
        UserId: 123,
        isDone: false,
        symbol: 'ETHBTC',
        strategy: 'buy_sell',
    },
    {
        id: 123,
        payload: {},
        UserId: 123,
        isDone: false,
        symbol: 'BTCETH',
        strategy: 'simple_iteration',
    },
]

const orders = [
    undefined,
    undefined,
    {
        UserId: 1,
        side: 'SELL',
        TaskId: generateUuid(),
    }
]

describe('handleTasks.js:', () => {
    // it('should return array of orders', async () => {
    //     const orders = await Promise.all(await handleTasks(tasks))
    //     console.log('orders: ', orders);
    //     expect(orders).to.have.length(2)
    //     orders.forEach(order => {
    //         expect(order).to.have.property('symbol', 'ETHBTC')
    //     })
    // })

    it('handleOrders()', async () => {
        assert(
            await Logs.count() == 0,
            'there must be 0 Logs before function runs'
        )
        await handleOrders(orders)
        await Logs.count()
        await Logs.count()
        const count = await Logs.count()
        assert(
            count == 1,
            'there must be 1 Log after function runs'
        )
    })

    // it(
    //     'handleOrders() if isTest updates "isBought" and "isSold"',
    //     async () => {

    //     }
    // )

})