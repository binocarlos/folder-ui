import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { tree_select_node } from './actions'
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
    data:state.table,
    hideHeader:true
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableContainer)
