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

  var selected = state.folderui.table.filter(row => {
    return row._selected
  })

  var title = ''
  if(selected.length==0){
    title = state.folderui.treeselected.name
  }
  else if(selected.length==1){
    title = selected[0].name
  }
  else{
    title = 'Multiple items'
  }

  return {
    title:title,
    selected:selected,
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