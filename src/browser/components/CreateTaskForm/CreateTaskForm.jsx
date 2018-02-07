import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import Dialog from 'material-ui/Dialog'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { TextField } from 'redux-form-material-ui'
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
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';

export class CreateTaskForm extends Component {
	render() {
		// hide component if user is not admin
		if (this.props.UserId != process.env.ADMIN_ID) return null
		const { props } = this
		const { insertTask, handleSubmit, asyncValidating } = props
		const classNames = cls(props.className, "CreateTaskForm")
		const isDisabled = asyncValidating == 'name' || props.submitting
		const required = value => (value == null ? 'Required' : undefined);
	    return 	<Row className={classNames}>
					<Col xs={12}>
						<form onSubmit={handleSubmit(insertTask)}>
								{/* <Field
									fullWidth
									name="strategy"
									hintText="strategy"
									// validate={required}
									component={SelectField}
									floatingLabelText="strategy"
								>
									<MenuItem value="buy_sell" primaryText="Купи + продай" />
								</Field> */}
							{/* <Field name="isTest" component={Checkbox} label="Это тест" /> */}
							<Field
								fullWidth
								name="strategy"
								hintText="strategy"
								component={TextField}
								hidden={asyncValidating}
							/>
							{"buy_sell" + '\n'}
							{"simple_iteration"}
							<Field
								fullWidth
								name="symbol"
								hintText="symbol"
								component={TextField}
								hidden={asyncValidating}
							/>
							<Field
								step="any"
								fullWidth
								type="number"
								name="toSpend"
								hintText="toSpend"
								component={TextField}
								hidden={asyncValidating}
							/>
							<Field
								step="any"
								fullWidth
								type="number"
								name="buyAt"
								hintText="buyAt"
								component={TextField}
								hidden={asyncValidating}
							/>
							<Field
								step="any"
								fullWidth
								type="number"
								name="sellAt"
								hintText="sellAt"
								component={TextField}
								hidden={asyncValidating}
							/>
							<center>
								<RaisedButton
									type="submit"
									primary={true}
									disabled={!props.valid}
									label={translate('submit')} />
							</center>
						</form>
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

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
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
			console.log('values.isTest: ', values.isTest);
			console.log('values.strategy: ', values.strategy);
			console.log('values: ', values);
			console.log('insertTask')
			// values.parentId = ownProps.parentId

			// function insertSucces(forum) {
			// 	ownProps.reset()
			// 	// browserHistory.push('/forum/' + forum.slug);
			// }
            // dispatch(insertTask({...values, isTest: true}, insertSucces))
		}
    })
)(CreateTaskForm))