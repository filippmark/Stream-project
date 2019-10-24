import * as React from 'react';
import './SignIn.css';
import axios from 'axios';

export interface IAppProps {
}

export interface IAppState {
    email: string;
    password: string;
}

export default class App extends React.Component<IAppProps, IAppState> {

  state = {
    email: "",
    password: ""
  }

  
  _handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    this.setState({ ...this.state, [event.currentTarget.name]: event.currentTarget.value});
  }

  _checkFieldsForCorrectness = (): boolean => {
    let element = document.getElementById("signUpError");
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
            console.log(result);
          } catch (error) {
              console.log(error.response);
              let element = document.getElementById("signUpError");
              if(element !== null)
                element.innerText = error.response.data.errors[0].message;
          }
    }
  }


  public render() {
    return (
      <React.Fragment>
           <form className="signInForm">
              <label className="signInLabel">
                email
              </label>
              <input type="text" name="email" className="signInEmail" onChange={this._handleInput}/>
              <label className="signInLabel">
                  password
              </label>
              <input type="password" name="password" className="signInPassword" onChange={this._handleInput}/>
              <div className="signUpError" id="signUpError"/>
              <input type="submit" className="signInBtn" onClick={this._handleClick}/>
          </form>
      </React.Fragment>
    );
  }
}
