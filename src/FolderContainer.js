import React, { Component, PropTypes } from 'react'


import NavWrapper from 'kettle-ui/lib/NavWrapper'

import TreeContainer from './TreeContainer'
import ContentContainer from './ContentContainer'

class FolderContainer extends Component {

  updateView(data = {}){
    let currentPath = (this.props.path || '').replace(/\/?\*?$/g, '')
    let parts = ['']

    if(currentPath) parts.push(currentPath)
    parts.push(data.id, data.view)

    if(data.subid){
      parts.push(data.subid)
    }
    this.props.updateRoute(parts.join('/').replace('//', '/'))
  }

  render() {

    let urlParts = (this.props.splat || '').split('/')

    let currentView = urlParts[0] ? {
      id:urlParts[0],
      view:urlParts[1] || 'children',
      subid:urlParts[2]
    } : null

    return (
      <NavWrapper
        width={this.props.width}
        paperprops={{
          zDepth:1,
          rounded:false
        }}
        navbar={
          <TreeContainer 
            context={this.props.context}
            loadTreeDB={this.props.db.loadTreeDB}
            loadChildrenDB={this.props.db.loadChildrenDB}
            loadItemDB={this.props.db.loadItemDB}
            updateView={this.updateView.bind(this)}
            currentView={currentView} />
        }>
        
        <ContentContainer 
          context={this.props.context}
          loadChildrenDB={this.props.db.loadChildrenDB}
          loadTreeDB={this.props.db.loadTreeDB}
          getSchema={this.props.getSchema}
          saveItemDB={this.props.db.saveItemDB}
          loadItemDB={this.props.db.loadItemDB}
          addItemDB={this.props.db.addItemDB}
          deleteItemsDB={this.props.db.deleteItemsDB}
          pasteItemsDB={this.props.db.pasteItemsDB}
          updateView={this.updateView.bind(this)}
          currentView={currentView}
          offsetWidth={this.props.width} />
        
      </NavWrapper>
    )
  }

}

export default FolderContainer