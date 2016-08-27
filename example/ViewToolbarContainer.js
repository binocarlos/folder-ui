import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ViewToolbar from '../src/ViewToolbar'

export class ToolbarContainer extends Component {

  render() {
    return (   
      <ViewToolbar {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    title:state.viewtitle,
    selected:state.tableselected,
    additems:[
      {
        title:'Folder'
      },{
        title:'Item'
      }
    ]
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onadd:function(data){
      console.log('add')
      console.log(JSON.stringify(data, null, 4))
    },
    onbutton:function(name, selected){
      console.log('button: ' + name)
      console.log(JSON.stringify(selected, null, 4))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolbarContainer)
