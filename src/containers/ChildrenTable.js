import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ChildrenTable from '../components/ChildrenTable'

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
  const state = actions.getState(s)

  const id = ownProps.params.id

  const data = state.children.data || []
  const selected = state.children.selected || {}

  return {
    id,
    data,
    selected
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  return {
    requestChildren:(id, done) => {
      dispatch(actions.requestChildren(id, done))
    },
    onRowSelection:(ids = []) => {
      dispatch(actions.selectChildNodes(ids))
    }
  }
}

ChildrenTableContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  routeInfo:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChildrenTableContainer))
