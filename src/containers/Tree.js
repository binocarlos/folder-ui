import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Tree from '../components/Tree'
import { dumpTreeData } from '../tools'

export class TreeContainer extends Component {

  componentDidMount() {
    this.props.requestTreeData()
  }

  render() {
    return (    
      <Tree {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {
  const actions = ownProps.actions
  const state = actions.getState(s)

  return {
    data:state.tree.db ? dumpTreeData(state.tree.db) : [],
    selected:ownProps.params.id
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  return {
    requestTreeData:() => {
      dispatch(actions.requestTreeData())
    },
    selectNode:(node) => {
      console.log('-------------------------------------------');
      console.log('select')
      console.log(JSON.stringify(node, null, 4))
    },
    toggleNode:(node) => {
      console.log('-------------------------------------------');
      console.log('toggle')
      console.log(JSON.stringify(node, null, 4))
    },
  }
}

TreeContainer.propTypes = {
  actions:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TreeContainer))
