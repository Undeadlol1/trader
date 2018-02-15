import cls from 'classnames'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import store from 'browser/redux/store'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import {List, ListItem} from 'material-ui/List'
import { Row, Col } from 'react-styled-flexboxgrid'
import Pagination from 'react-ultimate-pagination-material-ui'
import { translate as t } from 'browser/containers/Translator'
import { fetchThreads } from 'browser/redux/forum/ForumActions'

// TODO: comment about "parentId" and "onChange"

class LogsList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "LogsList")
		const logs = props.logs.get('values')
		return 	<Row className={className}>
					<Col xs={12}>
						<Paper zDepth={props.zDepth} className="LogsList_paper">
							<List>
								{
									logs.size
									? logs.map(
										log => 	<Link
														key={log.get('id')}
														to={'/logs/' + log.get('slug')}
													>
														<ListItem
															primaryText={log.get('name')}
														/>
													</Link>
									)
									: 	<ListItem
											disabled={true}
											className="LogsList__empty"
											primaryText={t('list_is_empty') + '...'}
										/>
								}
							</List>
							<div className='LogsList__pagination-wrapper'>
								{/*Created UltimatePagination component has the following interface:

									currentPage: number - current page number
									totalPages: number - total number of pages
									boundaryPagesRange: number, optional, default: 1 - number of always visible pages at the beginning and end
									siblingPagesRange: number, optional, default: 1 - number of always visible pages before and after the current one
									hideEllipsis: bool, optional, default: false - boolean flag to hide ellipsis
									hidePreviousAndNextPageLinks: bool, optional, default: false - boolean flag to hide previous and next page links
									hideFirstAndLastPageLink: bool, optional, default: false - boolean flag to hide first and last page links
									onChange: function - callback that will be called with new page when it should be changed by user interaction (optional)*/}
								{
									props.totalPages > 1
									? <Pagination
										style={{ margin: '0 auto' }}
										className='LogsList__pagination'
										onChange={props.changePage}
										currentPage={props.logs.get('currentPage')}
										totalPages={props.logs.get('totalPages')}
										hidePreviousAndNextPageLinks={true}
										hideFirstAndLastPageLink={true} />
									: null
								}
							</div>
						</Paper>
					</Col>
				</Row>
	}
}

LogsList.defaultProps = {
	zDepth: 5,
	totalPages: 0,
	currentPage: 0,
	// TODO: rework this
	logs: fromJS({values: []})
}

LogsList.PropTypes = {
	title: PropTypes.string,
	zDepth: PropTypes.number,
	onChange: PropTypes.func,
	parentId: PropTypes.isRequired,
	logs: PropTypes.object.isRequired,
}

export { LogsList }
export default connect(
	// stateToProps
	(state, ownProps) => ({
		logs: state.task.get('logs'),
		parentId: state.task.get('id'),
		// ownProps must be the last one in object to overwrite logs if they are passed through property
		...ownProps
	}),
	// dispatchToProps
    (dispatch, ownProps) => ({
		changePage(page) {
			const parentId = ownProps.parentId || store.getState().forum.get('id')
			dispatch(
				ownProps.onChange
				? props.onChange(parentId, page)
				: fetchThreads(parentId, page)
			)
		}
	})
)(LogsList)