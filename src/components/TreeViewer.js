import React, { PropTypes, Component } from 'react'
import {List} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import TreeNode from './TreeNode'

class TreeViewer extends Component {
  
  render() {

    var data = this.props.data || []

    return (
      <List>
        {this.props.title ? 
          (
            <Subheader>
              {this.props.title}
            </Subheader>
          )
          : 
          null
        }
        {
          data.map((node, i) => {
            return (
              <TreeNode
                key={i}
                data={node}
                get_icon={this.props.get_icon}
                />
            )
          }) 
        }
      </List>
    )
  }

}

export default TreeViewer