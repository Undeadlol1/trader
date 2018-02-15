// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import LogsList from 'browser/components/LogsList'
import { translate as t } from 'browser/containers/Translator'

class TaskPage extends PureComponent {
    render() {
		const { props } = this
		const task = props.task && props.task.toJS()
		console.log('task: ', task);
		return 	<PageWrapper
					className='TaskPage'
					loading={props.loading}
				>
					<Row>
						<Col xs={12}>
							<center>{task.symbol}</center>
							<center>{task.profit}</center>
							<center>{task.buyAt}</center>
							<center>{task.sellAt}</center>
							<center>{task.toSpend}</center>
							<center>{task.isTest}</center>
							<LogsList />
						</Col>
					</Row>
				</PageWrapper>
    }
}

TaskPage.propTypes = {
	task: PropTypes.object.isRequired,
}

export { TaskPage }

export default
connect(
	(state, ownProps) => ({
		task: state.task,
		...ownProps
	}),
)(TaskPage)