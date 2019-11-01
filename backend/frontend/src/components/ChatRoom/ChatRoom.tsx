import * as React from 'react';
import './ChatRoom.css';
import Context from '../../context/context';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import axios from 'axios';
import Message from '../Message/Message';
import { graphqlEndPoint } from "../../App";

const GRAPHQL_ENDPOINT = 'ws://localhost:8081/graphql';

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true
});

export interface IAppProps {
}

export interface IAppState {
}

export default class ChatRoom extends React.Component<IAppProps, IAppState> {
  static contextType = Context;


  _msgsRef: React.RefObject<HTMLInputElement> = React.createRef();

  state = {
      message: "",
      isVisible: false,
      isSubscribed: false,
      messages: []
  }


  componentDidUpdate(){
    if(this.state.isSubscribed)
    {
        const node  = this._msgsRef.current as HTMLDivElement;
        node.scrollTop = node.scrollHeight;
    }
  }



  _startSubscription = () => {
    if(!this.state.isSubscribed){
        const subscription = client.request({ query: this._subscriptionToGraphql() })
        const add = this._addNewMsg;
        subscription.subscribe({
            next({data}) {
                if (data){
                    console.log(data);
                    add(data);
                }
            }
        })
        this.setState({isSubscribed: true});
    }
  }

  _addNewMsg = (data: any) => {
    const copyMsgs = {...this.state}.messages;
    this.setState({messages: copyMsgs.concat(data.messageAdded)});
  }

  _handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.currentTarget.value);
    if((!this.state.isVisible) && (event.currentTarget.value.length > 0)){
        let element : HTMLElement = document.getElementById("sendMsg") as HTMLInputElement;
        element.className = " makeVisible";
        this.setState({[event.currentTarget.name]: event.currentTarget.value, isVisible: true});

    }else if (event.currentTarget.value.length === 0){
        let element : HTMLElement = document.getElementById("sendMsg") as HTMLInputElement;
        element.className = "chatRoomSendMessage";
        this.setState({[event.currentTarget.name]: event.currentTarget.value, isVisible: false});
    }else{
        this.setState({[event.currentTarget.name]: event.currentTarget.value});
    }
  }

  _btnClickHandeler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const response = this._sendMessage(this.state.message);
    const element : HTMLInputElement = document.getElementById("chatRoomTxtArea") as HTMLInputElement;
    element.value = "";
    let btn : HTMLElement = document.getElementById("sendMsg") as HTMLInputElement;
    btn.className = "chatRoomSendMessage";
  }


  _sendMessage = async (text: string) => {
    try {
        const result  = await axios.post(
            graphqlEndPoint,
            {
                query: this._mutationToGraphql(text),
            }
        )
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }        

  } 

  _mutationToGraphql = (text: string) : string => {
    return `
        mutation{
            createMessage(messageInput: {chatRoomId: ${this.context.chat.id}, text: "${text}"}){
                text
            }
        }
    `
  }

  _subscriptionToGraphql = () : string => {
      console.log(this.context.chat.id);
    return `
        subscription{
            messageAdded(chatRoomId: ${this.context.chat.id}){
                text
            }
        }
    `
  }

  public render() {
    if(this.context.isChatSelected){
        this._startSubscription();
        return (
            <div className="chatRoom">
                <div className="chatRoomMessages" ref = {this._msgsRef}>
                    <React.Fragment>
                        {
                            this.context.lastMessages.map((message: {UserId: number; text: string}) => {
                                return <Message msg={message} />
                            })
                        }
                    </React.Fragment>
                    <React.Fragment>
                        {
                            this.state.messages.map((message: {UserId: number; text: string}) => {
                                return <Message msg={message} />
                            })
                        }
                    </React.Fragment>
                </div>
                <div className="chatRoomControllers">
                    <textarea name="message" className="chatRoomMsgInputArea" placeholder="Write a message..." id="chatRoomTxtArea" onChange={this._handleInput}>

                    </textarea>
                    <button  className="chatRoomSendMessage" id="sendMsg" onClick={this._btnClickHandeler} >
                        <img src={process.env.PUBLIC_URL + "/send-icon.png"}/>
                    </button>
                </div>
            </div>    
        );
    }else{
        return(
            <div className="chatRoomSourceIsNotSelected"> 
                Please select a chat to start messaging
            </div>                
        )
    }
  }
}