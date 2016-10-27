import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Form from '../components/Form'

export class FormContainer extends Component {

  componentDidMount() {
    if(this.props.id){
      this.props.requestData(this.props.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.id != this.props.id){
      this.props.requestData(nextProps.id)
    }
  }

  render() {
    return (     
      <Form {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {

  const actions = ownProps.actions
  const state = actions.getState(s)

  const data = state.editing.data || {}
  const meta = state.editing.meta || null

  const id = ownProps.params.id || ownProps.params.parent
  const schema = ownProps.getSchema(data) || {}

  return {
    id,
    data,
    meta,
    schema:schema.fields
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  return {
    onUpdate:(data, meta) => {
      dispatch(actions.updateEditNode(data, meta))
    },
    requestData:(id) => {
      //dispatch(actions.loadEditNode(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FormContainer))