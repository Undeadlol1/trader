import moment from 'moment'
import { Prices } from 'server/data/models'

/**
 * Checkers module.
 * @module checkers
 */

/**
 * compare prices and tell if difference is bigger than certain percent
 * @param {number} oldPrice
 * @param {number} newPrice
 * @param {number} [expectedGainPercent=3] percentage to gain (2% orders fee + 1% profit)
 * @returns {boolean} is newPrice bigger than certain percent
 */
export function comparePrices(oldPrice, newPrice, expectedGainPercent = 3) {
    const currentGainPercent = 100 - ((oldPrice * 100) / newPrice)
    return currentGainPercent >= expectedGainPercent
}

/**
 * check to make sure that prices are recent
 * @param {string} symbol
 * @param {number} [differenceInMinutes=2]
 * @returns {boolean} are recent or not
 */
export async function pricesAreRecent(symbol, differenceInMinutes = 2) {
    try {
        const lastPrice = await Prices.getLatestPrice(symbol)
        if (!lastPrice) return false
        return moment().diff(lastPrice && lastPrice.createdAt, 'minutes') < differenceInMinutes
    } catch (error) {
        throw error
    }
}


/*
    1) ждать когда валюта перейдет + 5% (2% коммисия + 3% выгоды)
    2) Перейти в режим наблюдения
    Если цена растет, то ничего не делать
    Если цена падает, то: а) проверить что она не стала меньше изначальной цены + 2%, б) разница ПРЕДЫДУЩЕЙ и НАСТОЯЩЕЙ цены не больше чем заданный процент. Если больше, то продавать
*/

// TODO: what about margin between transaction fees and gain percentages?

/**
 * determine if we should sell currency or keep waiting
 * @param {number} initialPrice
 * @param {number} previousPrice
 * @param {number} newPrice
 * @param {number} allowedMargin allowed margin before sell point (in percentages, should be positive number)
 * @param {number} [preventLossPercent=5] allowed amount of percent to lose before selling out
 * @example
 * // returns true
 * shouldRideTheWave(70, 100, 105, 2)
 * @example
 * // returns false
 * shouldRideTheWave(90, 100, 77, 2)
 * @returns {boolean} to hold or not
 */
export function shouldRideTheWave(initialPrice, previousPrice, newPrice, allowedMargin, preventLossPercent = 5) {
    console.log('initialPrice: ', initialPrice);
    console.log('previousPrice: ', previousPrice);
    console.log('newPrice: ', newPrice);
    // check if there was bigger overall losss then allowed
    if (initialPrice && initialPrice > newPrice) {
        const currentLossPercent = 100 - ((initialPrice * 100) / newPrice)
        return !(currentLossPercent <= (preventLossPercent * -1))
    }
    // check if therere is a gain
    const currentGainPercent = 100 - ((previousPrice * 100) / newPrice)
    console.log('currentGainPercent: ', currentGainPercent);
    if (currentGainPercent >= 0) return true
    // or check if lose is not too big
    else if (currentGainPercent >= (allowedMargin * -1)) {
        return true
    }
    else return false
}