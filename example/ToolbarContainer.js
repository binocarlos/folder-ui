import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ItemToolbar from '../src/ItemToolbar'

export class ToolbarContainer extends Component {

  render() {
    return (   
      <ItemToolbar {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    selected:state.tableselected,
    additems:[
      {
        title:'Folder'
      },{
        title:'Item'
      }
    ]
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarContainer)
