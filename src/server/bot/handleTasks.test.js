import nock from 'nock'
import sinon from 'sinon'
import handleTasks from './handleTasks'
import chai, { expect, assert } from 'chai'
import { Prices, Tasks } from 'server/data/models'
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

// describe('handleTasks:', () => {
//     it('should return array of orders', async () => {
//         const orders = await Promise.all(await handleTasks(tasks))
//         console.log('orders: ', orders);
//         expect(orders).to.have.length(2)
//         orders.forEach(order => {
//             expect(order).to.have.property('symbol', 'ETHBTC')
//         })
//     })
// })