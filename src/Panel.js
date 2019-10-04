import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

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
            this.setState({ loadStatus: 'OK' });
        });
    }

    render() {
        return <div>
            <ul>
                <li>
                    <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                        Start Streaming {this.state.state0 ? 'ON' : 'OFF'}
                    </Button>
                </li>
                <li>
                    <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                        Stop Streaming
                    </Button>
                </li>
                <li>
                    <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                        Mark Origin
                    </Button>
                </li>
                <li>
                    <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                        Retrieve Origin
                    </Button>
                </li>
                <li>
                    <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                        Save Localization Map
                    </Button>
                </li>
                <li>
                    <Button variant="contained" color="primary" onClick={this.onLoadClicked}>
                        Load Localization Map {this.state.loadStatus}
                    </Button>
                </li>
            </ul>
            <ul>
                {this.state.persons.map(person => <li>{person.name}</li>)}
            </ul>
        </div>;
    }
}

export default Panel;