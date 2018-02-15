import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { LogsList } from 'browser/components/LogsList'
chai.should()
chai.use(chaiEnzyme())

describe('<LogsList />', () => {

  // const props = {}
  // const wrapper = shallow(<LogsList {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.exist
  //   expect(el).to.have.className('LogsList')
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