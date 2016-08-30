import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { 
  table_select_nodes,
  edit_item,
  tree_select_node,
  table_data_loaded
} from './actions'

import ChildrenViewer from './ChildrenViewer'
import Toolbar from './Toolbar'

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

function getSelectedRows(table){
  table = table || {}
  return (table.list || []).filter(id => {
    return table.data[id]._selected
  }).map(id => {
    return table.data[id]
  })
}

function getTableRows(table){
  table = table || {}
  return (table.list || []).map(id => {
    return table.data[id]
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
function getLeftButtons(parent, selected, canOpen){
  var actions = []
  var leftbuttons = []

  if(parent && selected.length==0){
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
      id:'edit',
      title:'Edit'
    })

    // lets check that we can open the single item
    if(canOpen(selected[0])){
      actions.push({
        id:'open',
        title:'Open'
      })
    }
    
  }
 
  if(selected.length>0){
    actions.push({
      divider:true
    },{
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
  parent = parent || {}
  selected = selected || []
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

  var reducerName = ownProps.reducername || 'folderui'

  // a rule that says you can only 'open' things that are in
  // the tree
  var canOpen = (item) => {
    return state[reducerName].tree.data[item.id] ? true : false
  }

  // the parent of the table data
  var parent = state[reducerName].treeselected

  // the list of table data
  var data = getTableRows(state[reducerName].table)

  // the list of selected table rows 
  var selected = getSelectedRows(state[reducerName].table)

  // the left button array
  var leftbuttons = getLeftButtons(parent, selected, canOpen)

  // the title
  var title = getToolbarTitle(parent, selected)

  

  return {
    title:title,
    fields:FIELDS,
    data:data,
    leftbuttons:leftbuttons,
    canOpen:canOpen
  }
}

const BUTTON_HANDLERS = {

  edit:(dispatch, parent, selected, ownProps) => {
    dispatch(edit_item(selected.length>0 ? selected[0] : parent))
  },

  open:(dispatch, parent, selected, ownProps) => {
    if(selected.length!=1) return
    if(!ownProps.loadChildren) return

    var data = selected[0]

    // load the children for the item
    ownProps.loadChildren(data, (err, children) => {
      if(err) return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
      dispatch(table_data_loaded(children))
      // tell the tree structure this item is open
      dispatch(tree_select_node(data))
    })
  }
}

// handler for the toolbar buttons
// uses thunk so we can get at the current parent / selected list
// this avoids passing these things into the toolbar
function handleButtonActions(id, data, ownProps){
  return (dispatch, getState) => {
    var handler = BUTTON_HANDLERS[id]
    if(!handler) return

    var reducername = ownProps.reducername || 'folderui'

    var state = getState()
    var parent = state[reducername].treeselected
    var selected = getSelectedRows(state[reducername].table)

    handler(dispatch, parent, selected, ownProps, data)
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onButton:function(id, data){
      dispatch(handleButtonActions(id, data, ownProps))
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