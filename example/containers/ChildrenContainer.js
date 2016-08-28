import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { table_select_nodes } from '../actions'
import ChildrenViewer from '../../src/ChildrenViewer'

const FIELDS = [{
  title:'name',
  render:data => data.name
}]

export class ChildrenContainer extends Component {

  render() {
    return (   
      <ChildrenViewer {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fields:FIELDS,  
    data:state.folderui.table
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onRowSelection:function(data){
      dispatch(table_select_nodes(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChildrenContainer)