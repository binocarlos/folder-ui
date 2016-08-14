import React, { PropTypes, Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Folder from 'material-ui/svg-icons/file/folder'
import { mergeStyles } from 'kettle-ui/lib/tools'
import { getChildren } from './tools'

const DEFAULT_STYLES = {
  selected:{
    backgroundColor:'rgb(232, 232, 232)'
  },
  header:{
    marginTop:'4px',
    marginBottom:'4px'
  }
}

function getStyles(overrides = {}){
  return mergeStyles(DEFAULT_STYLES, overrides)
}

class TreeViewer extends Component {
  
  getTreeNode(data, get_icon, styles, i) {
    var treedata = this.props.treedata || {}
    var children = getChildren(treedata, data.id)
    var name = data.name || 'no title'
    var use_icon = get_icon(data)

    var childnodes = children.map((node, i) => {
      return this.getTreeNode(node, get_icon, styles, i)
    })

    var handleClick = () => {
      this.props.selectNode(data)
    }

    var itemStyle = data.id==this.props.selected.id ? styles.selected : null

    return (
      <ListItem 
        key={i}
        primaryText={name} 
        primaryTogglesNestedList={false} 
        leftIcon={use_icon} 
        style={itemStyle}
        onTouchTap={handleClick}
        onNestedListToggle={handleClick}
        open={data.open}
        initiallyOpen={data.open}
        nestedItems={childnodes} />
    )
  }

  render() {
    var treedata = this.props.treedata || {}
    var get_icon = this.props.getIcon || function(data){
      return <Folder />
    }
    var styles = getStyles(this.props.styles)

    var rootnodes = (treedata.rootids || []).map(id => {
      return treedata.data[id]
    })

    return (
      <List>
        {this.props.title ? 
          (
            <Subheader style={styles.header}>
              {this.props.title}
            </Subheader>
          )
          : 
          null
        }
        {rootnodes.map((node, i) => {
          return this.getTreeNode(node, get_icon, styles, i)
        })}
      </List>
    )    
  }

}

export default TreeViewer