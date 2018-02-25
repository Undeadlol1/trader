// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
// project files
import { t } from 'browser/containers/Translator'
import ForumsList from 'browser/components/ForumsList'
import PageWrapper from 'browser/components/PageWrapper'
import WelcomeCard from 'browser/components/WelcomeCard'
import TasksList from 'browser/components/TasksList'
import MoodsInsert from 'browser/components/MoodsInsert'
import CreateTaskForm from 'browser/components/CreateTaskForm'

class IndexPage extends Component {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='IndexPage'
					loading={props.loading}
				>
					<CreateTaskForm />
					<TasksList />
				</PageWrapper>
    }
}

IndexPage.propTypes = {}

export { IndexPage }

export default
connect(
	(state, ownProps) => ({...ownProps})
)(IndexPage)