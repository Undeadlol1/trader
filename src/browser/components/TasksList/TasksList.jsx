import cls from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import { injectIntl } from 'react-intl'
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

@injectIntl
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
											<TableHeaderColumn>Потратить</TableHeaderColumn>
											<TableHeaderColumn>Покупка</TableHeaderColumn>
											<TableHeaderColumn>Продажа</TableHeaderColumn>
											<TableHeaderColumn>Тест</TableHeaderColumn>
											<TableHeaderColumn>Закончено</TableHeaderColumn>
											<TableHeaderColumn>Выгода</TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody displayRowCheckbox={false} showRowHover={true} stripedRows={true}>
										{
											props.tasks.get('values').map(task => {
												const isTest = task.get('isTest') ? 'yes' : 'no'
												const isDone = task.get('isDone') ? 'yes' : 'no'
												const date = props.intl.formatDate(task.get('createdAt'))
												const time = props.intl.formatTime(task.get('createdAt'))
												console.log('tospend', task.get('toSpend'))
												return  <TableRow key={task.get('id')}>
															<TableRowColumn>{`${time} ${date}`}</TableRowColumn>
															<TableRowColumn>{task.get('symbol')}</TableRowColumn>
															<TableRowColumn>{task.get('toSpend')}</TableRowColumn>
															<TableRowColumn>{task.get('buyAt')}</TableRowColumn>
															<TableRowColumn>{task.get('sellAt')}</TableRowColumn>
															<TableRowColumn>{isTest}</TableRowColumn>
															<TableRowColumn>{isDone}</TableRowColumn>
															<TableRowColumn>{task.get('profit')}</TableRowColumn>
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