import React, { Component, PropTypes } from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import Toolbar from 'kettle-ui/lib/Toolbar'

class FormToolbar extends Component {

  getLeftButtons() {

    const cancelButton = {
      id:'cancel',
      title:'Cancel',
      handler:() => {
        this.props.cancel(this.props.parentNode)
      }
    }

    const revertButton = {
      id:'revert',
      title:'Revert',
      handler:() => {
        this.props.revert()
      }
    }

    const saveButton = {
      id:'save',
      title:this.props.saveTitle || 'Save',
      extraProps:{ 
        primary:true
      },
      handler:() => {
        this.props.save(this.props.data, this.props.meta, this.props.parentNode)
      }
    }

    return this.props.readonly ?
      [
        cancelButton
      ] :
      [
        cancelButton,
        revertButton,
        saveButton
      ]
  }

  // the info we pass to functions
  getContext() {
    return {
      item:this.props.data,
      parent:this.props.parentNode,
      schema:this.props.schema,
      mode:this.props.mode,
      getState:this.props.getState,
      dispatch:this.props.dispatch,
      actions:this.props.actions,
      params:this.props.params
    }
  }

  render() {
    const toolbarChildren = this.props.getChildren ? 
      this.props.getChildren(this.getContext()) : 
      null

    const icon = this.props.getIcon && this.props.data ?
      this.props.getIcon(this.props.data, 'toolbar', this.props.muiTheme) :
      null

    const newProps = Object.assign({}, this.props, {
      leftbuttons:this.getLeftButtons(),
      icon
    })

    return (
      <Toolbar {...newProps}>
        {toolbarChildren}
      </Toolbar>
    )
  }
}

export default muiThemeable()(FormToolbar)