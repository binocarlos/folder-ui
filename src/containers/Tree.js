import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Tree from '../components/Tree'

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

function mapStateToProps(state, ownProps) {
  return {
    data:[]
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
    selectNode:(node) => {
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
)(TreeContainer)
