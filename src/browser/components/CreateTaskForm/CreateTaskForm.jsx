import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton'
import { Form, Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { translate } from 'browser/containers/Translator'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import browserHistory from 'react-router/lib/browserHistory'
import { actions } from 'browser/redux/actions/GlobalActions'
import { parseJSON } from'browser/redux/actions/actionHelpers'
import { insertTask } from 'browser/redux/task/TaskActions'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {
	// Checkbox,
	RadioGroup,
	Select,
	TextField,
	Switch,
	SelectField,
	DatePicker,
} from 'redux-form-material-ui'
import Paper from 'material-ui/Paper'

const renderCheckbox = ({ input, label }) => (
	<Checkbox label={label}
		checked={input.value ? true : false}
		onCheck={input.onChange}/>
)

export class CreateTaskForm extends Component {
	render() {
		// hide component if user is not admin
		// if (this.props.UserId != process.env.ADMIN_ID) return null
		const { props } = this
		console.log('props: ', props);
		const { insertTask, handleSubmit, asyncValidating } = props
		const classNames = cls(props.className, "CreateTaskForm")
		const isDisabled = asyncValidating == 'name' || props.submitting
		const required = value => (value == null ? 'Required' : undefined);
		// console.log('Select: ', Select);
	    return 	<Row className={classNames}>
					<Col xs={12}>
						<Paper zDepth={3} className="CreateTaskForm__paper">
							<form onSubmit={handleSubmit(insertTask)}>
								<Field
									required
									fullWidth
									name="strategy"
									hintText="Стратегия"
									component={SelectField}
									floatingLabelText="Стратегия"
								>
									<MenuItem value="buy_sell" primaryText="Купи + продай" />
									<MenuItem value="simple_iteration" primaryText="Бесконечный купи+продай" />
								</Field>
								<Field
									required
									fullWidth
									name="symbol"
									hintText="Symbol"
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText="Symbol"
								/>
								<Field
									step="any"
									fullWidth
									type="number"
									name="toSpend"
									hintText="toSpend"
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText="toSpend"
								/>
								<Field
									step="any"
									fullWidth
									type="number"
									name="buyAt"
									hintText="buyAt"
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText="buyAt"
								/>
								<Field
									step="any"
									fullWidth
									type="number"
									name="sellAt"
									hintText="sellAt"
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText="sellAt"
								/>
								<Field name="isTest" component={renderCheckbox} label="Тест?"/>
								<Field name="isBacktest" component={renderCheckbox} label="Backtest?" />
								<Field name="startTime" fullWidth component={DatePicker} format={null} hintText="Start time" />
								<Field name="endTime" fullWidth component={DatePicker} format={null} hintText="End time" />
								<Field
									fullWidth
									name="interval"
									hintText="Interval"
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText="Interval"
								/>
								<center>
									<RaisedButton
										type="submit"
										primary={true}
										disabled={!props.valid}
										label={translate('submit')} />
								</center>
							</form>
						</Paper>
					</Col>
				</Row>

	}
}

CreateTaskForm.propTypes = {
	UserId: PropTypes.number,
}

// TODO reorganize this for better testing
export default reduxForm({
	form: 'CreateTaskForm',
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		// if (!user) errors.name = translate('please_login')
		// if (!values.name) errors.name = translate('name_cant_be_empty')
		// if (!values.text) errors.text = translate('cant_be_empty')

		return errors
	},
	// onSubmit(values, dispatch, props) {
	// 		function insertSucces(slug) {
	// 			ownProps.reset()
	// 			browserHistory.push('/mood/' + slug);
	// 		}
    //         // dispatch(insertTask(values, insertSucces))
	// }
})
(connect(
	(state, ownProps) => ({
		...ownProps,
		UserId: state.user.get('id'),
	}),
    (dispatch, ownProps) => ({
        insertTask(values) {
			console.log('values: ', values);
			console.log('values.endTime: ', values.endTime);
			console.log('typeof values.endTime: ', typeof values.endTime);
			// dispatch(
			// 	insertTask({...values})
			// )
			// .then(() => ownProps.reset())

		}
    })
)(CreateTaskForm))