import React from 'react';
import { Grid, Card, Button, Typography, Switch, CardHeader, CardContent, CardActionArea } from '@material-ui/core';
import io from "socket.io-client";
import axios from 'axios';

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bIsOn: false, x: 0, y: 0, z: 0 };
    this.doStartStreaming = this.doStartStreaming.bind(this);
    this.doActionStatus = this.doActionStatus.bind(this);
  }

  doOnOff = () => {
    if (this.state.bIsOn) {
      //Turn off
      this.setState({ bIsOn: false });
    } else {
      this.setState({ bIsOn: true });
    }
  }

  doStartStreaming() {
    if (this.socket) this.socket.disconnect();
    this.doActionStatus('start_streaming');
    this.socket = io();
    this.socket.on('tick', (data) => {
      this.setState(data);
    });
  }

  doActionStatus(action) {
    this.setState({return: null, message: null});
    axios.get('/api/' + action)
      .then(res => {
        console.log(res.data);
        this.setState(res.data);
      });
  }

  render() {
    return (
      <div>
        <Card style={{margin: 12}}>
          <CardHeader title={ "Camera for Node " + this.props.node } style={{backgroundColor: "lightgrey"}}>
          </CardHeader>
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <Switch size="medium" color="secondary" onClick={this.doOnOff} checked={this.state.bIsOn} />
                <Typography style={{ display: 'inline-block' }}>{this.state.bIsOn ? "ON" : "OFF"}</Typography>
                <Button variant="contained" color="primary" disabled={true}>Save Relocalization Map</Button>
                <Button variant="contained" color="primary">Load Relocalization Map</Button>
                <div>{ "local position: " + this.state.x + ", " + this.state.y + ", " + this.state.z }</div>
                <div>{ "global position: " }</div>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={this.doStartStreaming}>Start Streaming</Button>
                <Button variant="contained" color="primary" onClick={() => {this.doActionStatus('stop_streaming')}}>Stop Streaming</Button>
                <Button variant="contained" color="primary" onClick={() => {this.doActionStatus('set_static_node')}}>Mark Origin</Button>
                <Button variant="contained" color="primary" onClick={() => {this.doActionStatus('get_static_node')}}>Retrieve Origin</Button>
              </Grid>
            </Grid>
          </CardContent>
          <CardActionArea style={{marginLeft: 12}}>
            <Typography>{this.state.return ? this.state.return + ": " + this.state.message : ""}</Typography>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

export default Camera;
