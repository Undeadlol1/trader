import sinon from 'sinon'
import chai, { expect, assert } from 'chai'
import { Prices } from 'server/data/models'
import { comparePrices, pricesAreRecent, shouldRideTheWave } from './checkers'
chai.should()

const symbol = 'UNIQUESYMBOL'

describe('checkers', () => {

    // clean up
    after(() => {
        return Prices.destroy({where: {symbol}})
    })

    describe('checkers', () => {

        it('comparePrices() should return true if price is bigger', () => {
            assert(comparePrices(0.2564545, 0.45787))
        })

        it('comparePrices() should return false if price is bigger but less than "gainPrice"', () => {
            const oldPrice = 100
            const newPrice = 102 // less when 3% percent gain
            assert(
                !comparePrices(oldPrice, newPrice),
                'returns wrong boolean'
            )
        })

        it('comparePrices() is properly calculating third argument', () => {
            const wrong = comparePrices(100, 107, 7)
            const correct = comparePrices(100, 120, 7)
            assert.isFalse(wrong)
            assert.isTrue(correct)
        })

        it('pricesAreRecent() calculating properly', async () =>{
            const allPrices = await Prices.findAll({raw: true})
            // let's just be sure that there are no previous prices
            expect(allPrices).to.have.length(0)

            // create 2 prices: with todays recent and with yersterdays
            const prices = [
                {
                    symbol,
                    createdAt: new Date(),
                    price: '0.2324334',
                },
                {
                    symbol,
                    price: '24.2323232324334',
                    // yesterday
                    createdAt: new Date().setDate(new Date().getDate() - 1),
                }
            ]
            await Prices.bulkCreate(prices)

            // function should return false because price is outdated
            assert.isFalse(
                await pricesAreRecent(symbol),
                'wrong return value'
            )
        })

        describe('shouldRideTheWave() should', () => {

            it('work without "initialPrice" param', () => {
                assert.isTrue(
                    shouldRideTheWave(undefined, 102, 105, 2),
                    "makes wrong decision"
                )
                assert.isFalse(
                    shouldRideTheWave(undefined, 75, 55, 2),
                    "makes wrong decision"
                )
            })

            it('use "initialPrice" param properly', () => {
                assert.isTrue(
                    shouldRideTheWave(100, 102, 105, 2),
                    "makes wrong decision"
                )
                assert.isFalse(
                    shouldRideTheWave(70, 75, 55, 2),
                    "makes wrong decision"
                )
            })

            it('use "preventLossPercent" param properly', () => {
                assert.isTrue(
                    shouldRideTheWave(100, 95, 94, 2, 10),
                    "makes wrong decision"
                )
                assert.isFalse(
                    shouldRideTheWave(100, 95, 94, 2, 5),
                    "makes wrong decision"
                )
            })

            it('return true', () => {
                assert.isTrue(
                    shouldRideTheWave(100, 102, 105, 2)
                )
            })

            it('return true', () => {
                assert.isTrue(
                    shouldRideTheWave(100, 102, 105, 2)
                )
            })

            it('return false', () => {
                assert.isFalse(
                    shouldRideTheWave(100, 102, 75, 2)

                )
            })

            it('return true if theres is a loss but it is less than allowed margin', () => {
                assert.isTrue(
                    shouldRideTheWave(100, 102, 101, 2)
                )
            })

        })
    })
})