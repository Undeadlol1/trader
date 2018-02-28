// dependencies
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { Row, Col } from 'react-styled-flexboxgrid'
// project files
import LogsList from 'browser/components/LogsList'
import TasksList from '../../components/TasksList'
import PageWrapper from 'browser/components/PageWrapper'
import { deleteTask } from 'browser/redux/task/TaskActions'
import { translate as t } from 'browser/containers/Translator'

class TaskPage extends PureComponent {
    render() {
		const { props } = this
		const task = props.task && props.task.toJS()
		return 	<PageWrapper
					className='TaskPage'
					loading={props.loading}
				>
					<TasksList tasks={fromJS({values: [task]})} />
					<Row>
						<Col xs={12}>
							<RaisedButton
								primary={true}
								label="Удалить"
								style={{
									float: 'right',
									margin: '1rem 0'
								}}
								onClick={props.delete.bind(this, props.task.get('id'))}
							/>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
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
    (dispatch, ownProps) => ({
		delete(id) {
			return dispatch(deleteTask(id))
		}
	})
)(TaskPage)