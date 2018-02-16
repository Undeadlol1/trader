import cls from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import browserHistory from 'react-router/lib/browserHistory'
import { translate as t } from 'browser/containers/Translator'
import {
	Table,
	TableRow,
	TableBody,
	TableHeader,
	TableRowColumn,
	TableHeaderColumn,
  } from 'material-ui/Table'

class TasksList extends Component {
	changeRoute = (index) => {
		const taskId = this.props.tasks.toJS().values[index].id
		browserHistory.push('tasks/' + taskId)
	}
	render() {
		const {props} = this
		const className = cls(props.className, "TasksList")
		return 	<Row className={className}>
					<Col xs={12}>
						<Paper zDepth={3}>
							{
								<Table onRowSelection={this.changeRoute} selectable={true} multiSelectable={false}>
									<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
										<TableRow>
											<TableHeaderColumn>Дата создания</TableHeaderColumn>
											<TableHeaderColumn>Символ</TableHeaderColumn>
											<TableHeaderColumn>Покупка</TableHeaderColumn>
											<TableHeaderColumn>Продажа</TableHeaderColumn>
											<TableHeaderColumn>Выгода</TableHeaderColumn>
											<TableHeaderColumn>Тест</TableHeaderColumn>
											<TableHeaderColumn>Закончено</TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
										{
											props.tasks.get('values').map(task => {
												const isTest = task.get('isTest') ? 'yes' : 'no'
												const isDone = task.get('isDone') ? 'yes' : 'no'
												return  <TableRow key={task.get('id')}>
															<TableRowColumn>{task.get('createdAt')}</TableRowColumn>
															<TableRowColumn>{task.get('symbol')}</TableRowColumn>
															<TableRowColumn>{task.get('buyAt')}</TableRowColumn>
															<TableRowColumn>{task.get('sellAt')}</TableRowColumn>
															<TableRowColumn>{task.get('profit')}</TableRowColumn>
															<TableRowColumn>{isTest}</TableRowColumn>
															<TableRowColumn>{isDone}</TableRowColumn>
														</TableRow>
											})
										}
									</TableBody>
								</Table>
							}
						</Paper>
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