import React, { PropTypes, Component } from 'react'
import Biro from 'biro'
import muiLibrary from 'biro-material-ui'
import muiLayout from 'biro-material-ui/layout'
import Paper from 'material-ui/Paper'
import { Container, Row, Col } from 'kettle-ui/lib/Grid'

const STYLES = {
  outerwrapper:{
    marginTop:'30px'
  },
  innerwrapper:{
    padding:'30px'
  }
}

function getStyles(){
  return STYLES
}

class FormViewer extends Component {

  render() {

    let library = Object.assign({}, muiLibrary, this.props.library)
    let styles = getStyles()

    return (
      <Container>
        <Row>
          
          <Col md={12}>
            <div style={styles.outerwrapper}>
              <Paper zDepth={2}>
                <div style={styles.innerwrapper}>
                  <Biro 
                    data={this.props.data}
                    meta={this.props.meta}
                    schema={this.props.schema}
                    update={this.props.onUpdate} 
                    library={library}
                    layout={muiLayout} />
                </div>
              </Paper>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

FormViewer.defaultProps = {
  
}

export default FormViewer