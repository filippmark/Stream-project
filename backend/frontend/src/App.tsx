import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Context from './context/context';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import UserPage from './components/UserPage/UserPage';
import './App.css';

export const graphqlEndPoint = "http://localhost:8081/graphql";

class App extends Component<{}, {}>{

  state = {
    isAuthorized: false,
    id: 0,
    isChatSelected: false,
    chat: {
      name: "",
      id: 0
    },
    chats: [],
    lastMessages: []
  }

  componentDidMount(){
     if(localStorage.getItem("auth") !== null)
     {
       const userData = JSON.parse(localStorage.getItem("auth") as string);
       this._setAuthorized(true);
       this._setUserId(parseInt(userData.userId));
     }
  }


  _setAuthorized = (newState: boolean) => {
    console.log(`setting authorized value ${newState}`);
    this.setState({isAuthorized: newState});
  }

  _setUserId = (id: number) => {
    console.log(`setting id value ${id}`);
    this.setState({id})
  }

  _setChats = (chats: []) => {
    console.log(`setting chats ${chats.length}`);
    this.setState({chats});
  }

  _setSelectedChat = (chat: {name: string; id:number}) => {
    console.log(`setting chat ${chat.name}`);
    this.setState({
      isChatSelected: true,
      chat
    });
  }

  _setLastMessages = (messages: [{text: string; UserId: number; }]) => {
    console.log(messages);
    console.log(`setting messages ${messages.length}`)
    this.setState({
      lastMessages: messages
    });
  }


  render(){
    return(
      <Context.Provider value={
        {
          isAuthorized: this.state.isAuthorized,
          userId: this.state.id,
          isChatSelected: this.state.isChatSelected,
          chat: this.state.chat,
          chats: this.state.chats,
          lastMessages: this.state.lastMessages,
          setAuthorized: this._setAuthorized,
          setUserId: this._setUserId,
          setChats: this._setChats,
          setSelectedChat: this._setSelectedChat,
          setLastMessages: this._setLastMessages
        }}>
        <div className="app">
          <Router>
            <Switch>
              <Route path="/signIn" component={SignIn}/>
              <Route path="/signUp" component={SignUp}/>
              <Route path="/userPage/:id" component={UserPage}/>
            </Switch>
          </Router>
        </div>
      </Context.Provider> 
    )
  }
}

export default App;