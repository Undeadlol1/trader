import nock from 'nock'
import thunk from 'redux-thunk'
import generateUuid from 'uuid/v4'
import chai, { expect } from 'chai'
import isArray from 'lodash/isArray'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/task/TaskReducer'
import { updateTask, insertThread, fetchTask, fetchTasks, actions } from 'browser/redux/task/TaskActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
const { API_URL } = process.env
const threadsApi = API_URL + 'tasks/'

// TODO: edit this variables
const task = {
  id: generateUuid()
}
const name = ""

/**
 * test async action by intercepting http call
 * and cheking if expected redux actions have been called
 * @param {string} url request url
 * @param {function} action action to call
 * @param {any} param action param
 * @param {array} result expected actions
 * @param {string} [method='get'] request method
 * @returns
 */
function mockRequest(url, action, param, result, method = 'get') {
    // create request interceptor
    nock(API_URL + 'tasks')[method](url).reply(200, task)
    const store = mockStore()
    return store
      // call redux action
      .dispatch(action(param))
      // compare called actions with expected result
      .then(() => expect(store.getActions()).to.deep.equal(result))
}

describe('TaskActions', () => {

  afterEach(() => nock.cleanAll())

  // it('fetchTask calls recieveTask', async () => {
  //   const { slug } = task
  //   const expectedActions = [
  //                             actions.recieveTask(task)
  //                           ]
  //   await mockRequest('/task/' + slug, fetchTask, slug, expectedActions)
  // })

})