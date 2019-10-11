import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios';

const classes = {
  root: {
  },
  paper: {
  },
};

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { state0: true, persons: [], loadStatus: '' };

    this.onLoadClicked = this.onLoadClicked.bind(this)
  }

  componentDidMount() {
  }

  onLoadClicked() {
    this.setState(state => ({ loadStatus: '...' }));
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        const persons = res.data;
        this.setState({ loadStatus: 'OK', persons: persons });
      });
  }

  render() {
    return (
      <div>
        <AppBar position="absolute">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Experiment Hub</Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>xs=12</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>xs=6</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>xs=6</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>xs=3</Paper>
        </Grid>
      </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
          <Paper style={{ padding: 10 }}>
            <Typography variant="h5" component="h3">
              Controls
            </Typography>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button variant="contained" xs={12} color="primary" onClick={this.onLoadClicked}>
                Start Streaming {this.state.state0 ? 'ON' : 'OFF'}
              </Button>
              <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                Stop Streaming
                </Button>
              <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                Mark Origin
                </Button>
              <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                Retrieve Origin
                </Button>
              <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                Save Localization Map
                </Button>
              <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                Load Localization Map {this.state.loadStatus}
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <ul>
          {this.state.persons.map(person =>
            <li>{person.name}</li>)}
        </ul>
      </div>
    );
  }
}

export default Panel;