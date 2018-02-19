import nock from 'nock'
import isArray from 'lodash/isArray'
import thunk from 'redux-thunk'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import { createAction, createActions } from 'redux-actions'
import { initialState } from 'browser/redux/ui/UiReducer'
import { togglePageLoading, toggleToast, actions } from 'browser/redux/ui/UiActions'
chai.should();
chai.use(chaiImmutable);

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('UiActions', () => {

  afterEach(() => nock.cleanAll())

  it('togglePageLoading calls toggleLoading', async () => {
    const expectedActions = [actions.toggleLoading()]
    const store = mockStore()
    store.getActions()
    // call redux action
    store.dispatch(togglePageLoading())
    const actualActions = store.getActions()
    // compare called actions with expected result
    expect(actualActions).to.deep.equal(expectedActions)
  })

})