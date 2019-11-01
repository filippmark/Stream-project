import * as React from 'react';
import axios from 'axios';
import './UserPage.css'
import ChatRoom from "../ChatRoom/ChatRoom";
import ChatRoomDescription from "../ChatDescription/ChatDescription";
import Context from '../../context/context';
import { graphqlEndPoint } from "../../App";

export interface IAppProps {
}

export default class userPage extends React.Component<IAppProps> {

  static contextType = Context;

  componentDidMount(){
    this._getAllChats();
  }

  _getAllChats = async () => {
    try {
      let result = await axios.post(
        graphqlEndPoint,
        {
            query: `
            query{
              chatRooms(id: ${this.context.userId})
              {
                name
                id
              }
            }`,
        }
      );    
      console.log(this.context);
      console.log(result);
      this.context.setChats(result.data.data.chatRooms);
    } catch (error) {
      console.log(error);
    }
  }


  public render() {
    return (
      <div className="userPage">
        <div className="chatRoomsWrapper">
          {
            this.context.chats.map((chat: { name: string; id: string; }) => {
              return <ChatRoomDescription name={chat.name} id={parseInt(chat.id)} key={chat.id}/>
            })
          }
        </div>
        <div className="chatRoomWrapper">
          <ChatRoom/>
        </div>
      </div>
    );
  }
}