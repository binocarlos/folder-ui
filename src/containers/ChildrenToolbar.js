import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

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
)(ChildrenToolbar)
