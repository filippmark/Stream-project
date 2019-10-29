import * as React from 'react';
import './SignIn.css';
import axios from 'axios';
import Context from "../../context/context";
import { Redirect } from 'react-router';

export interface IAppProps {
}

export interface IAppState {
    email: string;
    password: string;
    id: number;
}

export default class App extends React.Component<IAppProps, IAppState> {

  
  static contextType = Context;

  state = {
    email: "",
    password: "",
    id: 0
  }

  _handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    this.setState({ ...this.state, [event.currentTarget.name]: event.currentTarget.value});
  }

  _checkFieldsForCorrectness = (): boolean => {
    let element = document.getElementById("signInError");
    console.log(this.state);
    if ((this.state.email !== "") && (this.state.password !== ""))
    {
      if(this.state.password.length > 0) {
        if (element !== null){
          element.innerText = "";
        }
        return true;
      } else{
        if (element !== null){
          element.innerText = "Check your passwords";
        }
        return false;
      }
    }else{
      if (element !== null)
        element.innerText = "Fill all fields";
      return false;
    }
  }

  _handleClick = async (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log(this.context);
    if(this._checkFieldsForCorrectness()){
        try {
            let result = await axios.post(
              "http://localhost:8081/graphql",
              {
                  query: `
                  query{
                    login(userInput: {email: "${this.state.email}", password: "${this.state.password}"})
                      {
                        userId
                        token
                      }
                  }`,
              }
            );
            console.log(result.data.data.login.userId);
            this.context.setUserId(result.data.data.login.userId);
            this.context.setAuthorized(true);
            this.setState({...this.state, id: result.data.data.login.userId})
          } catch (error) {
              console.log(error.response);
              let element = document.getElementById("signUpError");
              if(element !== null)
                element.innerText = error.response.data.errors[0].message;
          }
    }
  }


  public render() { 
    if(this.context.isAuthorized)
      {
        return <Redirect to={`/userPage/${this.context.userId}`}/>
      }else{
        return (
          <React.Fragment>
            <form className="signInForm">
                <label className="signInLabel">
                  Email
                </label>
                <input type="text" name="email" className="signInEmail" onChange={this._handleInput}/>
                <label className="signInLabel">
                    Password
                </label>
                <input type="password" name="password" className="signInPassword" onChange={this._handleInput}/>
                <div className="signInError" id="signInError"/>
                <input type="submit" className="signInBtn" onClick={this._handleClick}/>
            </form>
          </React.Fragment>
        )
      }
  } 
  
}
