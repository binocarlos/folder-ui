import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Toolbar from '../components/FormToolbar'

export class FormToolbarContainer extends Component {

  render() {
    return (
      <Toolbar {...this.props} />  
    )
  }
}

function mapStateToProps(s, ownProps) {
  return {
    title:'My Toolbar'
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    save:() => {
      
    },
    cancel:() => {

    },
    revert:() => {

    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FormToolbarContainer))