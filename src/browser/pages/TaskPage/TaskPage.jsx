// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
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

						</Col>
					</Row>
				</PageWrapper>
    }
}

TaskPage.propTypes = {
	// prop: PropTypes.object,
}

export { TaskPage }

export default
connect(
	(state, ownProps) => ({
		// prop: state.mood.get('moods'),
		...ownProps
	}),
)(TaskPage)