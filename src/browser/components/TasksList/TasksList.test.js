import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { t } from 'browser/containers/Translator'
import { TasksList } from 'browser/components/TasksList'
chai.should()
chai.use(chaiEnzyme())

describe('<TasksList />', () => {

  const props = {
    tasks: fromJS({
      values: []
    })
  }
  // const wrapper = shallow(<TasksList {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.exist
  //   expect(el).to.have.className('TasksList')
  // })

  // it('has <Col>', () => {
  //   const el = wrapper.find('Styled(Col)')
  //   expect(el).to.exist
  //   expect(el).to.have.prop('xs', 12)
  // })

  // it('failes the test', () => {
  //   assert(false)
  // })

})