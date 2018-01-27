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

export class CreateTaskForm extends Component {
	render() {
		// hide component if user is not admin
		if (this.props.UserId != process.env.ADMIN_ID) return null
		const { props } = this
		const { insertTask, handleSubmit, asyncValidating } = props
		const classNames = cls(props.className, "CreateTaskForm")
		const isDisabled = asyncValidating == 'name' || props.submitting
	    return 	<Row className={classNames}>
					<Col xs={12}>
						<form onSubmit={handleSubmit(insertTask)}>
							<Field
								fullWidth
								name="name"
								component={TextField}
								hidden={asyncValidating}
								hintText={translate("add_something")}
							/>
							{/* <Field
								rows={2}
								fullWidth
								name="text"
								multiLine={true}
								component={TextField}
								hidden={asyncValidating}
								hintText={translate("description")}
							/> */}
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
			console.log('insertTask')
			// values.parentId = ownProps.parentId

			function insertSucces(forum) {
				ownProps.reset()
				// browserHistory.push('/forum/' + forum.slug);
			}
            dispatch(insertTask(values, insertSucces))
		}
    })
)(CreateTaskForm))