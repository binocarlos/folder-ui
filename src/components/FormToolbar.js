import React, { Component, PropTypes } from 'react'
import Toolbar from 'kettle-ui/lib/Toolbar'

export default class FormToolbar extends Component {

  getLeftButtons() {
    return [{
      id:'cancel',
      type:'button',
      title:'Cancel',
      handler:() => {
        this.props.cancel()
      }
    },{
      id:'revert',
      type:'button',
      title:'Revert',
      handler:() => {
        this.props.revert()
      }
    },{
      id:'save',
      type:'button',
      title:'Save',
      extraProps:{ 
        primary:true
      },
      handler:() => {
        this.props.save()
      }
    }]
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