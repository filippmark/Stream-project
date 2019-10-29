import * as React from 'react';
import './ChatDescription.css';
import Context from '../../context/context';

export interface IAppProps {
    name: string,
    id: number,
}

export interface IAppState {
}

export default class App extends React.Component<IAppProps, IAppState> {

    static contextType = Context;   

  _clickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event.currentTarget);
    let element: HTMLElement = event.currentTarget;
    if (this.context.isChatSelected){
        let selectedChat = document.getElementById(`chatDesc-${this.context.chat.id}`);
        if (selectedChat)
            selectedChat.className = selectedChat.className.replace(" selectedChat", "");
    }
    element.className += " selectedChat";
    this.context.setSelectedChat({id: this.props.id, name: this.props.name});
  }
 
  public render() {
    return (
      <div className="chatDescription" onClick={this._clickHandler} id={`chatDesc-${this.props.id}`}>
         <div className="chatTitle">
             {this.props.name}
         </div>
         <div className="chatLastMessage">
             last message
         </div>
         
      </div>
    );
  }
}
