import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ChildrenTable from '../components/ChildrenTable'
import { getDatabaseContext } from '../tools'

const TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]

export class ChildrenTableContainer extends Component {

  componentDidMount() {
    if(this.props.id){
      this.props.requestChildren(this.props.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.id != this.props.id){
      this.props.requestChildren(nextProps.id)
    }
  }

  render() {
    return (    
      <ChildrenTable {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {
  const actions = ownProps.actions
  const info = ownProps.info
  const state = actions.getState(s)

  const formInfo = info.tree ? info.tree(ownProps.params) : {}

  const id = ownProps.params.id

  const data = state.children.data || []
  const selected = state.children.selected || {}
  const parent = state.tree.db ? state.tree.db.data[formInfo.id] : null

  return {
    id,
    data,
    selected,
    parent,
    getState:() => s
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const context = getDatabaseContext(ownProps)
  return {
    dispatch,
    requestChildren:(id, done) => {
      dispatch(actions.requestChildren(context, id, done))
    },
    onRowSelection:(ids = []) => {
      dispatch(actions.selectChildNodes(ids))
    }
  }
}

ChildrenTableContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  info:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChildrenTableContainer))
