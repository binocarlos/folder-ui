import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { table_select_nodes } from '../actions'

import ChildrenViewer from '../../src/ChildrenViewer'
import Toolbar from '../../src/Toolbar'

const FIELDS = [{
  title:'name',
  render:data => data.name
}]

export class ChildrenContainer extends Component {

  render() {
    return (
      <ToolbarWrapper
        offsetWidth={this.props.offsetWidth}
        toolbar={<Toolbar 
                    title={this.props.toolbarTitle}
                    leftbuttons={this.props.leftbuttons}
                    rightbuttons={this.props.rightbuttons}
                    rightitems={this.props.rightitems}
                    onButton={this.props.onButton}
                  />}>

        <ChildrenViewer {...this.props} />

      </ToolbarWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {

  // the parent of the table data
  var tableparent = state.folderui.treeselected

  // the list of table data
  var tabledata = state.folderui.table

  // the list of selected table rows 
  var selected = tabledata.filter(row => {
    return row._selected
  })

  var addButton = {
    id:'addmenu',
    type:'dropdown',
    title:'Add',
    items:[{
      id:'folder',
      title:'Folder'
    },{
      id:'item',
      title:'Item'
    }]
  }

  var actions = []
  var leftbuttons = []


  if(selected.length==0){
    leftbuttons.push(addButton)
    actions.push({
      id:'edit',
      title:'Edit'
    },{
      id:'paste',
      title:'Paste'
    })
  }
  else if(selected.length==1){
    actions.push({
      id:'open',
      title:'Open'
    },{
      id:'edit',
      title:'Edit'
    })
  }
 
  if(selected.length>0){
    actions.push({
      id:'delete',
      title:'Delete'
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

  var title = ''
  if(selected.length==0){
    title = tableparent.name
  }
  else if(selected.length==1){
    title = selected[0].name
  }
  else{
    title = 'Multiple items'
  }

  return {
    toolbarTitle:title,
    fields:FIELDS,
    data:state.folderui.table,
    leftbuttons:leftbuttons
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onButton:function(id, data, selected){
      console.log(id)
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