import React, { PropTypes, Component } from 'react'
import TreeNode from './TreeNode'

class TreeViewer extends Component {
  
  render() {

    var offset = 0
    return (
      <TreeNode
        offset={offset}
        data={this.props.data} />
    )
  }

}

export default TreeViewer