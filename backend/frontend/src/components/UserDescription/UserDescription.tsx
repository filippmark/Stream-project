import * as React from 'react';
import "./UserDescription.css";
import { graphqlEndPoint } from "../../App";
import axios from "axios";
import Context from "../../context/context";


export interface IAppProps {
    email: string;
    id: number;
}

export interface IAppState {
}

export default class UserDescription extends React.Component<IAppProps, IAppState> {
 
  static contextType = Context;

  _createChatOrMoveToChat = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const response = await this._queryIsExistChatRoom();
    const chatRoom = response.data.data.isExistChatRoom;
    if(chatRoom !== null){
      console.log(chatRoom);
      const chat = document.getElementById(`chatDescription-${chatRoom.id}`) as HTMLDivElement;
      chat.click();
    }else{
      const chatRoom = await this._mutationCreateChatRoom();
      const chatRoomId = chatRoom.data.data.createChatRoom.id; 
      const chat = document.getElementById(`chatDescription-${chatRoomId}`) as HTMLDivElement;
      chat.click();
    }
  }

  _queryIsExistChatRoom =  async () => {
    try {
      const result = await axios.post(
        graphqlEndPoint,
        {
            query: `
            query{
              isExistChatRoom(isExistChatRoomInput: {userSenderId: ${this.context.userId}, userRecipientId: ${this.props.id}}){
                name
                id
              }
            }`,
        }
      );
      return result;
    } catch (error) {
      throw error;
    }   
  }

  _mutationCreateChatRoom = async () => {
    try {
      const result = await axios.post(
        graphqlEndPoint,
        {
            query: `
            mutation{
              createChatRoom(createChatRoomInput: {userSenderId: ${this.context.userId}, userRecipientId: ${this.props.id}})
              {
                name
                id
              }
            }`,
        }
      );
      return result;
    } catch (error) {
      throw error;
    }   
  }

  public render() {
    return (
        <li className="usersSearchResult">
            <ul className="userSearchDetails">   
                <li className="userSearchResultEmail">
                    user: {this.props.email}
                </li>
                <li className="userSearchResultStartMail">
                    <img className="createDialog" src={process.env.PUBLIC_URL + "/mail.png"} width="30px" onClick={this._createChatOrMoveToChat}/>
                </li>
            </ul>
        </li>
    );
  }
}