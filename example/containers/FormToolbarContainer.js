import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FormToolbar from '../../src/FormToolbar'

export class FormToolbarContainer extends Component {

  render() {
    return (   
      <FormToolbar {...this.props} />
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
)(FormToolbarContainer)