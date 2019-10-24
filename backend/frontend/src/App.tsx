import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import './App.css';

class App extends Component<{}, {}>{

  render(){
    return(
      <React.Fragment>
        <Router>
          <Switch>
            <Route path="/signIn" component={SignIn}/>
            <Route path="/signUp" component={SignUp}/>
          </Switch>
        </Router>
      </React.Fragment>
    )
  }
}

export default App;