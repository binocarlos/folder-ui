import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { table_select_nodes } from '../actions'
import FormViewer from '../../src/FormViewer'

export class FormContainer extends Component {

  render() {
    return (   
      <FormViewer {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormContainer)