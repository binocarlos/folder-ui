import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

export class ChildrenToolbar extends Component {
  render() {
    return (    
      <div>ChildrenToolbar</div>
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

ChildrenToolbar.propTypes = {
  actions:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChildrenToolbar))
