import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

export class FormContainer extends Component {
  render() {
    return (
      <div>form</div>
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
