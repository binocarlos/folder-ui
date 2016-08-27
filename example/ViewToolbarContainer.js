import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ViewToolbar from '../src/ViewToolbar'

export class ToolbarContainer extends Component {

  render() {
    return (   
      <ViewToolbar {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    title:state.viewtitle,
    selected:state.tableselected,
    additems:[
      {
        title:'Folder'
      },{
        title:'Item'
      }
    ],
    viewitems:[
      {
        title:'Children'
      },{
        title:'Details'
      }
    ]
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onadd:function(data){
      console.log('add')
      console.log(JSON.stringify(data, null, 4))
    },
    onopen:function(data){
      console.log('open')
      console.log(JSON.stringify(data, null, 4))
    },
    ondelete:function(data){
      console.log('delete')
      console.log(JSON.stringify(data, null, 4))
    },
    onedit:function(data){
      console.log('edit')
      console.log(JSON.stringify(data, null, 4))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarContainer)
