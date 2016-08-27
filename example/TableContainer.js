import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { table_select_nodes } from './actions'
import TableViewer from '../src/TableViewer'

const FIELDS = [{
  title:'name',
  render:data => data.name
}]

export class TableContainer extends Component {

  render() {
    return (   
      <TableViewer {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fields:FIELDS,  
    data:state.table
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
)(TableContainer)
