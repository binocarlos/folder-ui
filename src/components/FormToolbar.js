import React, { Component, PropTypes } from 'react'
import Toolbar from 'kettle-ui/lib/Toolbar'

export default class FormToolbar extends Component {

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

  render() {
    const newProps = Object.assign({}, this.props, {
      leftbuttons:this.getLeftButtons()
    })

    return (
      <Toolbar {...newProps} />
    )
  }
}