import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { CreateTaskForm } from 'browser/components/CreateTaskForm'
chai.should()
chai.use(chaiEnzyme())

describe('<CreateTaskForm />', () => {

  const props = {}
  // const wrapper = shallow(<CreateTaskForm {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.exist
  //   expect(el).to.have.className('CreateTaskForm')
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