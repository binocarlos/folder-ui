import React, { PropTypes, Component } from 'react'

class TreeNode extends Component {
  
  render() {

    var children = this.props.data.children || []

    var offset = this.props.offset
    var childoffset = offset+1

    return (
      <div>
        {this.props.data.name} - {offset}
        <div>
        {
          children.map((child, i) => {
            return (
              <TreeNode
                key={i}
                offset={childoffset}
                data={child} />
            )
          })
        }
        </div>
      </div>
    )
  }

}

export default TreeNode