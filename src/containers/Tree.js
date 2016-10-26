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
  const data = state.tree.db ? dumpTreeData(state.tree.db) : []
  let selected = ownProps.params.id

  selected = !selected && data[0] ? data[0].id : selected

  return {
    data,
    selected
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const handlers = ownProps.handlers || {}
  const router = ownProps.router
  const route = ownProps.route

  return {
    requestTreeData:() => {
      dispatch(actions.requestTreeData())
    },
    selectNode:(node) => {

      // check we have an open handler
      if(!handlers.open) return

      const url = [route.path, handlers.open(node)].join

      console.log('url: ' + handlers.open(node))

    console.dir(ownProps)
      //router.push(handlers.open(node))
    },
    toggleNode:(node) => {
      console.log('-------------------------------------------');
      console.log('toggle')
      console.log(JSON.stringify(node, null, 4))
    },
  }
}

TreeContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TreeContainer))
