import cls from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class TasksList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "TasksList")
		return 	<Row className={className}>
					<Col xs={12}>
						{
							props.tasks.get('values').map(task => {
								return 	<div key={task.get('id')}>
											<Link to={`tasks/${task.get('id')}`}>
												<span>{task.get('symbol')}</span>
												<span>{task.get('buyAt')}</span>
												<span>{task.get('sellAt')}</span>
												<span>{task.get('isSold')}</span>
												<span>{task.get('isBought')}</span>
												<span>{task.get('profit')}</span>
												<span>{task.get('isDone')}</span>
												<hr />
											</Link>
										</div>
							})
						}
					</Col>
				</Row>
	}
}

TasksList.PropTypes = {}

export { TasksList }
export default connect(
	// stateToProps
	(state, ownProps) => ({
		tasks: state.task.get('tasks'),
		...ownProps
	 }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(TasksList)