import * as React from 'react';
import './ChatDescription.css';
import Context from '../../context/context';
import axios from 'axios';
import { graphqlEndPoint } from "../../App";

export interface IAppProps {
    name: string,
    id: number,
}

export interface IAppState {
}

export default class App extends React.Component<IAppProps, IAppState> {

    static contextType = Context;   

  _clickHandler = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event.currentTarget);
    let element: HTMLElement = event.currentTarget;
    if (this.context.isChatSelected){
        let selectedChat = document.getElementById(`chatDesc-${this.context.chat.id}`);
        if (selectedChat)
            selectedChat.className = selectedChat.className.replace(" selectedChat", "");
    }
    element.className += " selectedChat";
    this.context.setSelectedChat({id: this.props.id, name: this.props.name});
    let mesgs = await this._queryMessages(50, this.props.id);
    this.context.setLastMessages(mesgs);
  }

  _queryMessages = async (amount: number, chatRoomId: number): Promise< [{text: string; UserId: number; }]> => {
    try {
      const result = await axios.post(
        graphqlEndPoint,
        {
          query: `
            query{
              lastMessages(lastMessagesInput: {amount: ${amount}, chatRoomId: ${chatRoomId}})
              {
                text
                UserId
              }
            }
          `,
        }
      )
      return result.data.data.lastMessages;
    } catch (error) {
      return error;
    }
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
