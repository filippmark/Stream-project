import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Registration from './components/Registration/Registration';
import './App.css';

class App extends Component<{}, {}>{

  render(){
    return(
      <React.Fragment>
        <Router>
          <Switch>
            <Route path="/login"/>
            <Route path="/signUp" component={Registration}/>
          </Switch>
        </Router>
      </React.Fragment>
    )
  }
}

export default App;