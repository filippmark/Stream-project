import * as React from 'react';
import axios from 'axios';
import './SignUp.css';
import { Redirect } from 'react-router';

export interface IAppProps {
}

export interface IAppState {
    email: string;
    password: string;
    passwordRepeat: string;
    successfuly: boolean;
}

export default class SignUp extends React.Component<IAppProps, IAppState> {

  state = {
    email: "",
    password: "",
    passwordRepeat: "",
    successfuly: false
  }

  _handleClick = async (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        if(this._checkFieldsForCorrectness()){
          try {
            let result = await axios.post(
              "http://localhost:8081/graphql",
              {
                  query: `
                  mutation{
                    createNewUser(userInput: {email: "${this.state.email}", password: "${this.state.password}"})
                      {
                        id
                        email
                      }
                  }`,
              }
            );
            console.log(result);
            this.setState({...this.state, successfuly: true})
          } catch (error) {
              console.log(error.response);
              let element = document.getElementById("signUpError");
              if(element !== null)
                element.innerText = error.response.data.errors[0].message;
          }
        } 
  }

  _checkFieldsForCorrectness = (): boolean => {
    let element = document.getElementById("signUpError");
    console.log(this.state);
    if ((this.state.email !== "") && (this.state.password !== "") && (this.state.passwordRepeat !== ""))
    {
      if((this.state.password === this.state.passwordRepeat) && (this.state.password.length > 0)) {
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

  _handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    this.setState({ ...this.state, [event.currentTarget.name]: event.currentTarget.value});
  }

  public render() {

    if (this.state.successfuly){
      return <Redirect to={'/signIn'}/>;
    }
    else{
      return (
        <React.Fragment>
            <form className="signUpForm">
                <label className="signUpLabel">
                  Email
                </label>
                <input type="text" name="email" className="signUpEmail" onChange={this._handleInput}/>
                <label className="signUpLabel">
                    Password
                </label>
                <input type="password" name="password" className="signUpPassword" onChange={this._handleInput}/>
                <label className="signUpLabel">
                    Repeat password
                </label>
                <input type="password" name="passwordRepeat" className="signUpPassword" onChange={this._handleInput}/>
                <div className="signUpError" id="signUpError"/>
                <input type="submit" className="signUpBtn" onClick={this._handleClick}/>
            </form>
        </React.Fragment>
      );
    }
  }
}
