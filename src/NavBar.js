import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const NavBar = () => {
    return (
        <div>
            <AppBar position="static">
                <ToolBar>
                    <Typography variant="h4" color="inherit">
                        Experiment Hub
                    </Typography>
                </ToolBar>
            </AppBar>
        </div>
    );
}

export default NavBar;
