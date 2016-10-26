import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

const TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]

export class ChildrenTable extends Component {
  render() {
    return (    
      <div>ChildrenTable</div>
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

ChildrenTable.propTypes = {
  actions:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChildrenTable))
