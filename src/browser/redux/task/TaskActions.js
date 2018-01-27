import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'browser/redux/actions/actionHelpers'

const tasksUrl = process.env.API_URL + 'tasks/'

export const actions = createActions({
  UNLOAD_TASK: () => null,
  REMOVE_TASK: id => id,
  TOGGLE_DIALOG: () => null,
  ADD_TASK: task => task,
  RECIEVE_TASK: node => node,
  RECIEVE_TASKS: nodes => nodes,
  UPDATE_TASK: object => object,
  TOGGLE_TASK_FETCHING: boolean => boolean,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

/**
 * create a task
 * @param {object} payload content url
 */
export const insertTask = payload => (dispatch, getState) => {
	return fetch(tasksUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			return dispatch(actions.addTask(response))
		})
}

/**
 * fetch task using task slug
 * @param {string} slug task slug (optional)
 */
export const fetchTask = slug => (dispatch, getState) => {
	const taskSlug = slug || getState().task.get('slug')

	return fetch(tasksUrl + 'task/' + taskSlug,)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveTask((data)))
		})
		.catch(err => console.error('fetchtask failed!', err))
}

/**
 * fetch tasks
 * @param {number} [page=1] tasks page (optional)
 */
export const fetchTasks = (page=1) => (dispatch, getState) => {
	return fetch(tasksUrl + page)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => dispatch(actions.recieveTasks((data))))
		.catch(err => console.error('fetchtask failed!', err))
}