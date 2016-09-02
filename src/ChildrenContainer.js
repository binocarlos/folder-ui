import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pluralise from 'pluralise'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { 
  api_select_node,
  api_paste_items,
  table_select_nodes,
  add_item,
  edit_item,
  copy_items,
  cut_items,
  snackbar_open,
  dialog_open
} from './actions'

import {
  getTableRows,
  getSelectedTableRows
} from './tools'

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



// the add dropdown - depends on what type the parent is
function getAddButton(parent){
  return {
    id:'add',
    type:'dropdown',
    title:'Add',
    items:[{
      type:'folder',
      title:'Folder'
    },{
      type:'item',
      title:'Item'
    }]
  }
}

// work out what buttons (add, actions) to include
// based on what is selected
function getLeftButtons(parent, selected, clipboard, canOpen){
  let actions = []
  let leftbuttons = []

  if(parent && selected.length==0){
    let addButton = getAddButton(parent)
    leftbuttons.push(addButton)
    actions.push({
      id:'edit',
      title:'Edit'
    })

    if(clipboard.length>0){
      actions.push({
        id:'paste',
        title:'Paste'
      })
    }
  }
  else if(selected.length==1){

    // lets check that we can open the single item
    if(canOpen(selected[0])){
      actions.push({
        id:'open',
        title:'Open'
      })
    }

    actions.push({
      id:'edit',
      title:'Edit'
    })

    
    
  }
 
  if(selected.length>0){
    actions.push({
      id:'delete',
      title:'Delete'
    },{
      divider:true
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

const FIELDS = [{
  title:'name',
  render:data => data.name
}]

function mapStateToProps(state, ownProps) {

  let reducerName = ownProps.reducername || 'folderui'

  // a rule that says you can only 'open' things that are in
  // the tree
  let canOpen = (item) => {
    return state[reducerName].tree.data[item.id] ? true : false
  }

  // the parent of the table data
  let parent = state[reducerName].treeselected

  // the list of table data
  let data = getTableRows(state[reducerName].table)

  // the list of selected table rows 
  let selected = getSelectedTableRows(state[reducerName].table)

  // the current clipboard
  let clipboard = state[reducerName].clipboard

  // the left button array
  let leftbuttons = getLeftButtons(parent, selected, clipboard, canOpen)

  // the title
  let title = (parent || {}).name

  return {
    title:title,
    fields:FIELDS,
    data:data,
    leftbuttons:leftbuttons,
    canOpen:canOpen
  }
}

const BUTTON_HANDLERS = {

  add:(dispatch, stateProps, ownProps, data) => {
    dispatch(add_item(stateProps.parent, Object.assign({}, data)))
  },

  edit:(dispatch, stateProps, ownProps) => {
    dispatch(edit_item(stateProps.selected.length>0 ? stateProps.selected[0] : stateProps.parent))
  },

  // TODO: this is coupled to the ContentContainer because it needs the dialog
  delete:(dispatch, stateProps, ownProps) => {
    dispatch(dialog_open('Are you sure you want to delete ' + stateProps.selected.length + ' ' + pluralise(stateProps.selected.length, 'item') + '?', {
      type:'delete'
    }))
  },

  open:(dispatch, stateProps, ownProps) => {
    if(stateProps.selected.length!=1) return
    
    let item = stateProps.selected[0]

    dispatch(api_select_node(ownProps, item))
  },

  cut:(dispatch, stateProps, ownProps) => {
    if(stateProps.selected.length<=0) return
    dispatch(cut_items(stateProps.selected))
    dispatch(snackbar_open(stateProps.selected.length + ' ' + pluralise(stateProps.selected.length, 'item') + ' cut to the clipboard'))
  },

  copy:(dispatch, stateProps, ownProps) => {
    if(stateProps.selected.length<=0) return
    dispatch(copy_items(stateProps.selected))
    dispatch(snackbar_open(stateProps.selected.length + ' ' + pluralise(stateProps.selected.length, 'item') + ' copied to the clipboard'))
  },

  paste:(dispatch, stateProps, ownProps) => {
    if(stateProps.clipboardItems.length<=0) return

    let mode = stateProps.clipboardMode
    let parent = stateProps.parent
    let items = stateProps.clipboardItems

    dispatch(api_paste_items(ownProps, mode, parent, items))
  }
}

// handler for the toolbar buttons
// uses thunk so we can get at the current parent / selected list
// this avoids passing these things into the toolbar
function handleButtonActions(id, data, ownProps){
  return (dispatch, getState) => {
    let handler = BUTTON_HANDLERS[id]
    if(!handler) return

    let reducername = ownProps.reducername || 'folderui'

    let state = getState()
    let parent = state[reducername].treeselected
    let selected = getSelectedTableRows(state[reducername].table)
    let clipboardItems = state[reducername].clipboard.map(item => {
      let ret = Object.assign({}, item)
      delete(item._selected)
      return ret
    })
    let clipboardMode = clipboardItems.length > 0 ? clipboardItems[0].type : null

    let stateProps = {
      parent,
      selected,
      clipboardMode,
      clipboardItems
    }

    handler(dispatch, stateProps, ownProps, data)
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