import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import {
  api_delete_items,
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

  render() {

    let ContentType = this.props.mode=='form' ? FormContainer : ChildrenContainer

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

  return {
    mode:state[reducername].editing ? 'form' : 'children',
    snackbarOpen:state[reducername].snackbar.open,
    snackbarMessage:state[reducername].snackbar.message,
    dialogOpen:state[reducername].dialog.open,
    dialogMessage:state[reducername].dialog.message
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    snackbarClose:function(){
      dispatch(snackbar_close())
    },
    dialogConfirm:function(){
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
    dialogClose:function(){
      dispatch((dialog_close()))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)