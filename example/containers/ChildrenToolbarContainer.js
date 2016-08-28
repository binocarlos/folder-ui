import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { edit_item } from '../actions'
import ChildrenToolbar from '../../src/ChildrenToolbar'

export class ChildrenToolbarContainer extends Component {

  render() {
    return (   
      <ChildrenToolbar {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    title:state.folderui.viewtitle,
    selected:state.folderui.tableselected,
    additems:[
      {
        title:'Folder'
      },{
        title:'Item'
      }
    ],
    rightitems:[
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
    onrightmenu:function(data){
      console.log('rightmenu')
      console.log(JSON.stringify(data, null, 4))
    },
    onbutton:function(name, selected){
      switch (name) {
        case 'edit':
          return dispatch(edit_item(selected[0]))
        default:
          return
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChildrenToolbarContainer)