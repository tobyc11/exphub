import React from 'react';
import NavBar from './NavBar';
import { Grid } from '@material-ui/core';
import Camera from './Camera';
import SceneView from './SceneView';

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <Grid container style={{padding: 24}}>
        <Grid item xs={12} sm={6} lg={6} xl={6}>
          <Camera node="0"/>
          <Camera node="1"/>
          <Camera node="2"/>
          <Camera node="3"/>
        </Grid>
        <Grid item xs={12} sm={6} lg={6} xl={6}>
          <SceneView/>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
