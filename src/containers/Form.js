import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Form from '../components/Form'

export class FormContainer extends Component {

  render() {
    return (     
      <Form {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {

  const actions = ownProps.actions
  const state = actions.getState(s)

  const data = state.editing.data || {}
  const meta = state.editing.meta || null

  return {
    data,
    meta
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  return {
    onUpdate:(data, meta) => {
      dispatch(actions.updateEditNode(data, meta))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FormContainer))