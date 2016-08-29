import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { table_select_nodes, edit_item } from '../actions'

import ChildrenViewer from '../../src/ChildrenViewer'
import Toolbar from '../../src/Toolbar'

export class ChildrenContainer extends Component {

  render() {
    return (
      <ToolbarWrapper
        offsetWidth={this.props.offsetWidth}
        toolbar={
          <Toolbar 
            title={this.props.title}
            leftbuttons={this.props.leftbuttons}
            rightbuttons={this.props.rightbuttons}
            rightitems={this.props.rightitems}
            onButton={this.props.onButton}
          />
        }>

        <ChildrenViewer 
          showHeader={false}
          multiSelectable={true}
          showCheckboxes={true}
          {...this.props} />

      </ToolbarWrapper>
    )
  }
}

function getSelectedRows(rows){
  return rows.filter(row => {
    return row._selected
  })
}

// the add dropdown - depends on what type the parent is
function getAddButton(parent){
  return {
    id:'addmenu',
    type:'dropdown',
    title:'Add',
    items:[{
      id:'folder',
      title:'Folder'
    },{
      id:'item',
      title:'Item'
    }]
  }
}

// work out what buttons (add, actions) to include
// based on what is selected
function getLeftButtons(parent, selected){
  var actions = []
  var leftbuttons = []

  if(selected.length==0){
    var addButton = getAddButton(parent)
    leftbuttons.push(addButton)
    actions.push({
      id:'edit',
      title:'Edit'
    },{
      id:'paste',
      title:'Paste'
    })
  }
  else if(selected.length==1){
    actions.push({
      id:'open',
      title:'Open'
    },{
      id:'edit',
      title:'Edit'
    })
  }
 
  if(selected.length>0){
    actions.push({
      id:'delete',
      title:'Delete'
    },{
      id:'copy',
      title:'Copy'
    },{
      id:'cut',
      title:'Cut'
    })
  }

  if(actions.length>0){
    leftbuttons.push({
      id:'actions',
      type:'dropdown',
      title:'Actions',
      items:actions
    })
  }

  return leftbuttons
}

// the title depends on the selection
function getToolbarTitle(parent, selected){
  var title = ''
  if(selected.length==0){
    title = parent.name
  }
  else if(selected.length==1){
    title = selected[0].name
  }
  else{
    title = 'Multiple items'
  }
  return title
}

const FIELDS = [{
  title:'name',
  render:data => data.name
}]

function mapStateToProps(state, ownProps) {

  // the parent of the table data
  var parent = state.folderui.treeselected

  // the list of table data
  var data = state.folderui.table

  // the list of selected table rows 
  var selected = getSelectedRows(data)

  // the left button array
  var leftbuttons = getLeftButtons(parent, selected)

  // the title
  var title = getToolbarTitle(parent, selected)

  return {
    title:title,
    fields:FIELDS,
    data:data,
    leftbuttons:leftbuttons
  }
}

const BUTTON_HANDLERS = {
  edit:function(parent, selected){
    return edit_item(selected.length>0 ? selected[0] : parent)
  }
}

// handler for the toolbar buttons
// uses thunk so we can get at the current parent / selected list
// this avoids passing these things into the toolbar
function handleButtonActions(id, data){
  return (dispatch, getState) => {
    var handler = BUTTON_HANDLERS[id]
    if(!handler) return

    var state = getState()
    var parent = state.folderui.treeselected
    var selected = getSelectedRows(state.folderui.table)

    dispatch(handler(parent, selected, data))
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onButton:function(id, data){
      dispatch(handleButtonActions(id, data))
    },
    onRowSelection:function(data){
      dispatch(table_select_nodes(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChildrenContainer)