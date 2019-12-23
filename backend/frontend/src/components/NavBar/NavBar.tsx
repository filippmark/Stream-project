import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import Context from "../../context/context";
import "./NavBar.css";

export interface IAppProps {
}

export default class App extends React.Component<IAppProps> {
  
  static contextType = Context;  
  

  _signOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    localStorage.removeItem('auth');
    this.context.setJwtToken(null);
    this.context.setAuthorized(false);
    this.context.setUserId(0);
  }

  public render() {
    if (this.context.isAuthorized) {
        return (
          <nav>
            <ul className="navBar-items">
              <li className="navBar-spacer"></li>
              <li className="navBar-item">
                <Link to={`/userPage/${this.context.userId}`}> Profile </Link>
              </li>
              <li className="navBar-item">
                <Link to={"/signIn"} onClick={this._signOut}> Sign out </Link>
              </li>
            </ul>
          </nav>
        );
      } else {
        return (
          <nav>
            <ul className="navBar-items">
              <li className="navBar-spacer"></li>
              <li className="navBar-item">
                <Link to={"/signIn"}> Sign in </Link>
              </li>
              <li className="navBar-item">
                  <Link to={"/signUp"} > Sign Up </Link>
              </li>
            </ul>
          </nav>
        );
      }
  }
}
