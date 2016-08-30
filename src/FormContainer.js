import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { 
  edit_item_save, 
  edit_item_cancel, 
  edit_item_update,
  edit_item_revert,
  snackbar_open
} from './actions'

import FormViewer from './FormViewer'
import Toolbar from './Toolbar'

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

  var reducername = ownProps.reducername || 'folderui'

  var editing = state[reducername].editing
  var schema = ownProps.getSchema(editing.data)

  return {
    title:editing.original.name,
    data:editing.data,
    meta:editing.meta,
    schema:schema,
    leftbuttons:[{
      id:'cancel',
      title:'Cancel'
    },{
      id:'revert',
      title:'Revert'
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
  save:(dispatch, item) => {

    dispatch(edit_item_save(item))
    dispatch(snackbar_open(item.name + ' saved'))  
    
  },
  revert:(dispatch, item) => {
    dispatch(edit_item_revert(item))
  },
  cancel:(dispatch, item) => {
    dispatch(edit_item_cancel(item))
  }
}

// handler for the toolbar buttons
// uses thunk so we can get at the current item
// this avoids passing these things into the toolbar
function handleButtonActions(id, data){
  return (dispatch, getState) => {
    var handler = BUTTON_HANDLERS[id]
    if(!handler){
      console.error('no button handler found for: ' + id)
      return
    }

    var state = getState()
    var item = state.folderui.editing.data

    handler(dispatch, item, data)
  }
}


function mapDispatchToProps(dispatch, ownProps) {
  return {
    onButton:function(id, data){
      dispatch(handleButtonActions(id, data))
    },
    onUpdate:function(data, meta){
      dispatch(edit_item_update(data, meta))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormContainer)