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
  console.log(JSON.stringify(state, null, 4))
  return {
    fields:FIELDS,
    oranges:state.folderui.tableselected2,
    data:state.folderui.table,
    apple:'sdsd'/*
    selectedids:state.folderui.tableselected*/
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