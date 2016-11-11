import React, { PropTypes, Component } from 'react'
import Biro from 'biro'
import muiLibrary from 'biro-material-ui'
import muiLayout from 'biro-material-ui/layout'
import Paper from 'material-ui/Paper'

const STYLES = {
  outerwrapper:{
    margin:'30px'
  },
  innerwrapper:{
    padding:'30px'
  }
}

function getStyles(){
  return STYLES
}

class FormViewer extends Component {

  // the info we pass to functions
  getContext() {
    return {
      id:this.props.id,
      item:this.props.data,
      mode:this.props.mode,
      descriptor:this.props.descriptor,
      schema:this.props.schema,
      parent:this.props.parentNode,
      getState:this.props.getState,
      dispatch:this.props.dispatch,
      actions:this.props.actions,
      params:this.props.params
    }
  }

  render() {

    const customLibary = this.props.getLibrary ?
      this.props.getLibrary(this.getContext(), this.props.data) :
      {}

    let library = Object.assign({}, muiLibrary, customLibary)
    let styles = getStyles()

    return (
     
      <div style={styles.outerwrapper}>
        <Paper zDepth={2}>
          <div style={styles.innerwrapper}>
            <Biro 
              data={this.props.data}
              meta={this.props.meta}
              schema={this.props.schema}
              update={this.props.onUpdate} 
              getContext={this.props.getContext}
              library={library}
              layout={muiLayout} />
          </div>
        </Paper>
      </div>

    )
  }
}

FormViewer.defaultProps = {
  
}

export default FormViewer