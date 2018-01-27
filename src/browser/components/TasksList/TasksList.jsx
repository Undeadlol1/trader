import cls from 'classnames'
import PropTypes from 'prop-types'
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

					</Col>
				</Row>
	}
}

TasksList.PropTypes = {}

export { TasksList }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(TasksList)