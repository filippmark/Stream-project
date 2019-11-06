import * as React from 'react';
import axios from 'axios';
import './UserPage.css'
import ChatRoom from "../ChatRoom/ChatRoom";
import ChatRoomDescription from "../ChatDescription/ChatDescription";
import Context from '../../context/context';
import { graphqlEndPoint } from "../../App";
import { Redirect } from 'react-router';
import UserDescription from "../UserDescription/UserDescription";
import { SubscriptionClient } from 'subscriptions-transport-ws';

const GRAPHQL_ENDPOINT = 'ws://localhost:8081/graphql';

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true
});

export interface IAppProps {
}

export default class userPage extends React.Component<IAppProps> {

  static contextType = Context;

  state = {
    users: [],
    chats: []
  }


  componentDidMount(){
    this._getAllChats();
    this._startSubscriptionForChats();
  }


  componentWillUnmount(){
    client.unsubscribeAll();
  }

  
  _subscriptionForChatsQuery = (userId: number) => `
      subscription{
        chatCreated(userId: ${userId})
        {
          name
          amountOfUsers
          creatorId
          id
        }
      }
    `
  
  _startSubscriptionForChats = () => {
    const subscription = client.request({ query: this._subscriptionForChatsQuery(this.context.userId) });
    const add = this._addNewChats;
    subscription.subscribe({
        next({data}) {
            if (data){
                console.log(data);
                add(data.chatCreated);
            }
        }
    }) 
  }


  _addNewChats = (chat: any) => {
    this.setState({chats: this.state.chats.concat(chat)});
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
                amountOfUsers
                creatorId
              }
            }`,
        }
      );    
      this.context.setChats(result.data.data.chatRooms);
    } catch (error) {
      console.log(error);
    }
  }

  _searchChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const partOfEmail = event.currentTarget.value;
    if(partOfEmail !== ""){
      const result =  await this._gueryAllUserWithSuchEmail(partOfEmail);
      this.setState({users: result});
    } else{
      this.setState({users: []});
    }
  }



  _gueryAllUserWithSuchEmail = async (partOfEmail: string) => {
    let users = null;
    try {
      users =  await axios.post(
        graphqlEndPoint, 
        {
          query: `
          query{
            usersByEmail(partOfName: "${partOfEmail}")
            {
              email
              id
            }
          }
          `
        }
      )
      return users.data.data.usersByEmail;
    } catch (error) {
      console.log(error);
    }
  }


  public render() {
    if(this.context.isAuthorized){
      return (
        <div className="userPage">
          <div className="detailsWrapper">
            <div className="usersSearch">
              <input type="text" className="userSeachInput" placeholder="peoples" onChange={this._searchChangeHandler}/>
              <ul className="usersSearchResults">
                {
                  this.state.users.map((user: any, index: number) => {
                    return <UserDescription id={user.id} email={user.email} key={`${user.id}-${index}`}/>
                  })
                }
              </ul>
            </div>
            <ul className="chatRoomsWrapper">
              <React.Fragment>
                {
                  this.context.chats.map((chat: { name: string; id: string; amountOfUsers: number; creatorId: string;}) => {
                    return <ChatRoomDescription name={chat.name} id={parseInt(chat.id)} amountOfUsers={chat.amountOfUsers} creatorId ={parseInt(chat.creatorId)} key={chat.id}/>
                  })
                }
              </React.Fragment>
              <React.Fragment>
                {
                  this.state.chats.map((chat: { name: string; id: string; amountOfUsers: number; creatorId: string;}) => {
                    return <ChatRoomDescription name={chat.name} id={parseInt(chat.id)} amountOfUsers={chat.amountOfUsers} creatorId ={parseInt(chat.creatorId)} key={chat.id}/>
                  })
                }
              </React.Fragment>
            </ul>
          </div>
          <div className="chatRoomWrapper">
            <ChatRoom/>
          </div>
        </div>
      );
    }else{
      return <Redirect to="/signIn"/>
    }
  }
}