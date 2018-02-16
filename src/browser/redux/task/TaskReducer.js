import isEmpty from 'lodash/isEmpty'
import { Map, List, fromJS } from 'immutable'

// TODO: rework into using "fromJS" which converts better (this way many bugs in reducer can be avoided)

const taskStructure =  {
							symbol: '',
							buyAt: '',
							sellAt: '',
							toSpend: '',
							isBought: '',
							isSold: '',
							payload: '',
							profit: '',
							isDone: '',
							isTest: '',
							strategy: '',
							UserId: '',
							logs: {
								values: [],
								totalPages: 0,
								currentPage: 0,
							},
						}

export const initialState = fromJS({
							error: '',
							tasks: {
								values: [],
								totalPages: 0,
								currentPage: 0,
							},
							logs: {
								values: [],
								totalPages: 0,
								currentPage: 0,
							},
							loading: false,
							finishedLoading: true,
							dialogIsOpen: false,
							contentNotFound: false,
							// TODO do i need this?
							searchIsActive: false,
							...taskStructure
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		// case 'FETCHING_TASK':
		// 	return state.merge({
		// 		loading: true,
		// 		finishedLoading: false,
		// 		contentNotFound: false,
		// 	})
		case 'ADD_TASK':
			return state
				.updateIn(['tasks', 'values'], arr => {
					return isEmpty(payload)
						? arr
						: arr.push(Map(payload))
				})
		case 'RECIEVE_TASK':
			return state
				.merge(payload)
				.merge({
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'RECIEVE_TASKS':
			return state
				.mergeDeep({
					...payload[0],
					tasks: payload,
					loading: false,
					// finishedLoading: true,
					contentNotFound: isEmpty(payload),
				})
		case 'UPDATE_TASK':
			return state.mergeDeep(payload)
		case 'TOGGLE_DIALOG':
			return state.set('dialogIsOpen', !state.get('dialogIsOpen'))
		case 'UNLOAD_TASK':
			return state
				.merge(taskStructure)
				.merge({tasks: List()})
				.mergeDeep({
					loading: false,
					// finishedLoading: false,
					contentNotFound: false,
				})
		// remove task from tasks list
		case 'REMOVE_TASK':
			return state
				.merge({
					tasks: state
							.get('tasks')
							.filter(task => task.get('id') !== payload)
				})
		case 'RECIEVE_SEARCHED_VIDEOS':
			return state.merge({
				searchIsActive: false,
				searchedVideos: payload
			})
		default:
			return state
	}
}