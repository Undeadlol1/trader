import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { TaskPage } from 'browser/pages/TaskPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<TaskPage />', () => {
  const props = {
                  loading: false,
                  location: {pathname: 'some'},
                }
  // const wrapper = shallow(<TaskPage {...props} />)

  // it('has className and <PageWrapper>', () => {
  //   expect(wrapper).to.have.className('TaskPage')
  //   expect(wrapper.type().name).to.eq('PageWrapper')
  // })

  // it('has <Row>', () => {
  //   expect(wrapper.find('Styled(Row)')).to.have.length(1);
  // })

  // it('has <Col>', () => {
  //   const el = wrapper.find('Styled(Col)')
  //   expect(el).to.exist
  //   expect(el.props().xs).to.eq(12)
  // })

})