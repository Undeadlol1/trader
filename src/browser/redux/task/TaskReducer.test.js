import chai, { expect } from 'chai'
import { Map, List } from 'immutable'
import chaiImmutable from 'chai-immutable'
import { actions } from 'browser/redux/task/TaskActions'
import reducer, { initialState } from 'browser/redux/task/TaskReducer'
chai.should()
chai.use(chaiImmutable)

describe('task reducer', async () => {

  const task = {
    id: 1,
    UserId: 2,
    TaskId: 3,
    type: 'video',
    contentId: 123,
    url: 'google.com',
    rating: '1.32332300',
    provider: 'youtube',
    Decision: {},
  }

  const tasks = [
    {id: 1},
    {id: 2},
    {id: 3},
  ]

  // it('should have initial state', () => {
  //   expect(reducer(undefined, {})).to.equal(initialState)
  // })

  // it('should handle RECIEVE_TASK action on initial state', async () => {
  //   const action = actions.recieveTask(task)
  //   const newState = reducer(undefined, action)
  //   expect(newState).to.have.property('id', task.id)
  //   expect(newState).to.have.property('contentId', task.contentId)
  //   expect(newState).to.have.property('loading', false)
  // })

  // it('should handle RECIEVE_TASKS action on initial state', () => {
  //   const action = actions.recieveTasks(tasks)
  //   const newState = reducer(undefined, action)
  //   expect(newState.get('tasks').toJS()).to.deep.equal(tasks)
  // })

  // it('should handle UPDATE_TASK action', async () => {
  //   expect(
  //     reducer(undefined, actions.updateTask(task))
  //   )
  //   .to.have.property('id', task.id)
  // })

  // it('should handle TOGGLE_DIALOG action on initial state', async () => {
  //   expect(
  //     reducer(undefined, actions.toggleDialog(true))
  //   )
  //   .to.have.property('dialogIsOpen', true)
  // })

  // it('should handle UNLOAD_TASK action', () => {
  //   const action = actions.unloadTask()
  //   const newState = reducer(undefined, action)
  //   expect(newState).to.equal(initialState)
  // })

  // it('should handle REMOVE_TASK action', () => {
  //   const action = actions.recieveTasks(tasks)
  //   // state containing active task and tasks list
  //   const initialState = reducer(undefined, action).merge(task)
  //   const newState = reducer(initialState, actions.removeTask(1))
  //   expect(newState.get('tasks').toJS())
  //     .to.have.length(2)
  //     .and.not.contain({id: 1})
  // })

  // it('should handle RECIEVE_SEARCHED_VIDEOS action on initial state', () => {
  //   const action = actions.recieveSearchedVideos([])
  //   const newState = reducer(undefined, action)
  //   const expectedState = initialState.merge({
  //       searchedVideos: [],
  //       searchIsActive: false,
  //   })
  //   expect(newState).to.deep.eq(expectedState)
  // })

})