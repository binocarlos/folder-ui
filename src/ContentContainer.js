import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import {
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

    // these are set because of the URL changing
    if(nextProps.triggerView){
      if(nextProps.triggerView.view=='edit'){
        this.props.editItem(nextProps.triggerView.id)
      }
      else if(nextProps.triggerView.view=='children'){
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

  let editingItem = state[reducername].editing
  let currentMode = editingItem ? 'edit' : 'children'

  let triggerView = null

  if(ownProps.currentView){
    let urlMode = ownProps.currentView.view
    let urlId = ownProps.currentView.id

    if(urlMode!=currentMode){
      triggerView = ownProps.currentView
    }
  }

  return {
    mode:currentMode,
    triggerView:triggerView,
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
    cancelEditItem:() => {
      dispatch(edit_item_cancel())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)