import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import {
  add_item,
  api_delete_items,
  api_edit_item,
  edit_item_cancel,
  snackbar_close,
  dialog_close
} from './actions'

import {
  getSelectedTableRows
} from './tools'

import ChildrenContainer from './ChildrenContainer'
import FormContainer from './FormContainer'


const SNACKBAR_AUTOHIDE = 5000

const STYLES = {
  wrapper:{
    width:'100%',
    height:'100%'
  }
}

export class ContentContainer extends Component {

  checkProps(nextProps){
    let triggerView = nextProps.triggerView
    if(triggerView){
      if(triggerView.view=='edit'){
        this.props.editItem(triggerView.subid || triggerView.id)
      }
      else if(triggerView.view=='add'){
        if(!nextProps.urlparent) return
        this.props.addItem(nextProps.urlparent, {
          type:triggerView.subid
        })
      }
      else if(triggerView.view=='children'){
        this.props.cancelEditItem()
      }
    }

  }
  
  componentDidMount() {
    this.checkProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.checkProps(nextProps)
  }

  render() {

    let ContentType = this.props.mode=='edit' ? FormContainer : ChildrenContainer

    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.dialogClose}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.props.dialogConfirm}
      />,
    ];

    return (
      <div style={STYLES.wrapper}>
        <ContentType {...this.props} />
        <Snackbar 
          open={this.props.snackbarOpen}
          message={this.props.snackbarMessage}
          autoHideDuration={SNACKBAR_AUTOHIDE}
          onRequestClose={this.props.snackbarClose} />
        <Dialog
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.props.dialogClose}
            />,
            <FlatButton
              label="Confirm"
              primary={true}
              onTouchTap={this.props.dialogConfirm}
            />,
          ]}
          modal={false}
          open={this.props.dialogOpen}
          onRequestClose={this.props.dialogClose}
        >
          {this.props.dialogMessage}
        </Dialog>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {

  let reducername = ownProps.reducername || 'folderui'
  let urlEditItem = null

  let parent = state[reducername].treeselected
  let editingItem = state[reducername].editing
  let stateTree = state[reducername].tree || {}
  let treeData = stateTree.data || {}

  // the view the app currently thinks it has
  // (i.e. are we currently editing a thing)
  let currentMode = editingItem ? 'edit' : 'children'
  let currentView = ownProps.currentView
  let triggerView = null
  let urlparent = null

  if(currentView){
    let urlMode = currentView.view

    urlMode = urlMode=='add' ? 'edit' : urlMode

    // we are currently looking at a different view
    // than the URL says we should
    if(urlMode!=currentMode){
      triggerView = currentView
    }

    urlparent = treeData[currentView.id]
  }

  return {
    editingItem:editingItem,
    triggerView:triggerView,
    parent:parent,
    urlparent:urlparent,
    mode:currentMode,
    snackbarOpen:state[reducername].snackbar.open,
    snackbarMessage:state[reducername].snackbar.message,
    dialogOpen:state[reducername].dialog.open,
    dialogMessage:state[reducername].dialog.message
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    snackbarClose:() => {
      dispatch(snackbar_close())
    },
    dialogConfirm:() => {
      dispatch((dispatch, getState) => {
        let reducername = ownProps.reducername || 'folderui'
        let state = getState()
        let dialogData = state[reducername].dialog.data || {}

        if(dialogData.type=='delete'){
          let selected = getSelectedTableRows(state[reducername].table)
          let parent = state[reducername].treeselected
          dispatch(api_delete_items(ownProps, parent, selected))
        }
      })
    },
    dialogClose:() => {
      dispatch(dialog_close())
    },
    editItem:(id) => {
      dispatch(api_edit_item(ownProps, id))
    },
    addItem:(parent, data) => {
      dispatch(add_item(parent, data))
    },
    cancelEditItem:() => {
      dispatch(edit_item_cancel())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)