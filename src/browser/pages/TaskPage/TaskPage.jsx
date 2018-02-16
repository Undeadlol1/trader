// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import { deleteTask } from 'browser/redux/task/TaskActions'
import { translate as t } from 'browser/containers/Translator'

class TaskPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='TaskPage'
					loading={props.loading}
				>
					<Row>
						<Col xs={12}>
							<RaisedButton
								primary={true}
								label="Удалить"
								onClick={props.delete.bind(this, props.task.get('id'))}
							/>
						</Col>
					</Row>
				</PageWrapper>
    }
}

TaskPage.propTypes = {
	task: PropTypes.object,
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