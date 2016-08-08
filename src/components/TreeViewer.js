import React, { PropTypes, Component } from 'react'
import TreeNode from './TreeNode'

class TreeViewer extends Component {
  
  render() {

    var data = this.props.data || {
      name:'Tree'
    }

    var meta = this.props.meta || {}

    return (
      <TreeNode
        isroot={true}
        data={data}
        meta={meta} 
        update_meta={this.props.update_meta}        
        offset_style={this.props.offset_style} />
    )
  }

}

export default TreeViewer