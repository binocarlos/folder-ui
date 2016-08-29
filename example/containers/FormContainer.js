import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { edit_item_save, edit_item_cancel } from '../actions'

import FormViewer from '../../src/FormViewer'
import Toolbar from '../../src/Toolbar'

export class FormContainer extends Component {

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

        <FormViewer {...this.props} />

      </ToolbarWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    title:state.folderui.editing.data.name,
    leftbuttons:[{
      id:'cancel',
      title:'Cancel'
    },{
      id:'save',
      title:'Save',
      extraProps:{
        primary:true
      }
    }]
  }
}

const BUTTON_HANDLERS = {
  save:(item) => {
    return edit_item_save(item)
  },
  cancel:(item) => {
    return edit_item_cancel(item)
  }
}

// handler for the toolbar buttons
// uses thunk so we can get at the current item
// this avoids passing these things into the toolbar
function handleButtonActions(id, data){
  return (dispatch, getState) => {
    var handler = BUTTON_HANDLERS[id]
    if(!handler) return

    var state = getState()
    var item = state.folderui.editing.data

    dispatch(handler(item, data))
  }
}


function mapDispatchToProps(dispatch, ownProps) {
  return {
    onButton:function(id, data){
      dispatch(handleButtonActions(id, data))
    } 
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormContainer)