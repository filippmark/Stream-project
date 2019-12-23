import * as React from "react";
import "./ChatRoom.css";
import Context from "../../context/context";
import { SubscriptionClient } from "subscriptions-transport-ws";
import axios from "axios";
import Message from "../Message/Message";
import { graphqlEndPoint } from "../../App";

const GRAPHQL_ENDPOINT = "ws://localhost:8081/graphql";

export interface IAppProps {}

export interface IAppState {}

export default class ChatRoom extends React.Component<IAppProps, IAppState> {
  static contextType = Context;

  _msgsRef: React.RefObject<HTMLInputElement> = React.createRef();

  state = {
    message: "",
    isVisible: false,
    isSubscribed: false,
    messages: [],
    subscribedChatId: 0
  };

  _client: SubscriptionClient;

  componentDidMount() {
    this._client = this._setSubscriptionClient();
  }

  componentDidUpdate() {
    if (this.state.isSubscribed) {
      const node = this._msgsRef.current as HTMLDivElement;
      node.scrollTop = node.scrollHeight;
      node.onscroll = this._handleScroll;
    }
  }

  _setSubscriptionClient = () => {
    return new SubscriptionClient(GRAPHQL_ENDPOINT, {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${this.context.jwt}`
        }
      }
    });
  };

  componentWillUnmount() {
    if (this.state.isSubscribed) {
      const node = this._msgsRef.current as HTMLDivElement;
      node.scrollTop = node.scrollHeight;
      node.removeEventListener("onscroll", this._handleScroll);
    }
  }

  _handleScroll = (event: any) => {
    console.log(event.target.scrollTop);
  };

  _startSubscription = () => {
    if (
      !this.state.isSubscribed ||
      this.context.chat.id !== this.state.subscribedChatId
    ) {
      if (this.context.chat.id !== this.state.subscribedChatId) {
        this._client.unsubscribeAll();
      }
      const subscription = this._client.request({
        query: this._subscriptionToGraphql(),
        connectionParams: {
          headers: {
            Authorization: `Bearer ${this.context.jwt}`
          }
        }
      });
      const add = this._addNewMsg;
      subscription.subscribe({
        next({ data }) {
          if (data) {
            console.log(data);
            add(data);
          }
        }
      });
      this.setState({
        isSubscribed: true,
        subscribedChatId: this.context.chat.id,
        messages: []
      });
    }
  };

  _addNewMsg = (data: any) => {
    const copyMsgs = { ...this.state }.messages;
    this.setState({ messages: copyMsgs.concat(data.messageAdded) });
  };

  _handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!this.state.isVisible && event.currentTarget.value.length > 0) {
      let element: HTMLElement = document.getElementById(
        "sendMsg"
      ) as HTMLInputElement;
      element.className = " makeVisible";
      this.setState({
        [event.currentTarget.name]: event.currentTarget.value,
        isVisible: true
      });
    } else if (event.currentTarget.value.length === 0) {
      let element: HTMLElement = document.getElementById(
        "sendMsg"
      ) as HTMLInputElement;
      element.className = "chatRoomSendMessage";
      this.setState({
        [event.currentTarget.name]: event.currentTarget.value,
        isVisible: false
      });
    } else {
      this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    }
  };

  _btnClickHandelerSendMsg = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const response = this._sendMessage(this.state.message);
    const element: HTMLInputElement = document.getElementById(
      "chatRoomTxtArea"
    ) as HTMLInputElement;
    element.value = "";
    let btn: HTMLElement = document.getElementById("sendMsg") as HTMLDivElement;
    btn.className = "chatRoomSendMessage";
    this.setState({ isVisible: false });
  };

  _sendMessage = async (text: string) => {
    try {
      const result = await axios.post(
        graphqlEndPoint,
        {
          query: this._mutationToGraphql(text)
        },
        {
          headers: { Authorization: `Bearer ${this.context.jwt}` }
        }
      );
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  _mutationToGraphql = (text: string): string => {
    return `
        mutation{
            createMessage(messageInput: {chatRoomId: ${this.context.chat.id}, text: "${text}", creatorId:${this.context.userId}}){
                text
            }
        }
    `;
  };

  _subscriptionToGraphql = (): string => {
    return `
        subscription{
            messageAdded(chatRoomId: ${this.context.chat.id}){
                text
                UserId
            }
        }
    `;
  };

  public render() {
    if (this.context.isChatSelected) {
      this._startSubscription();
      return (
        <div className="chatRoom">
          <div className="spacerChatroom"></div>
          <div className="chatRoomMessages" ref={this._msgsRef}>
            <React.Fragment>
              {this.context.lastMessages.map(
                (message: { UserId: number; text: string }, index: number) => {
                  return (
                    <Message msg={message} key={`${message.UserId}-${index}`} />
                  );
                }
              )}
            </React.Fragment>
            <React.Fragment>
              {this.state.messages.map(
                (message: { UserId: number; text: string }, index) => {
                  return (
                    <Message
                      msg={message}
                      key={`${message.UserId}-${index}-`}
                    />
                  );
                }
              )}
            </React.Fragment>
          </div>
          <div className="chatRoomControllers">
            <textarea
              name="message"
              className="chatRoomMsgInputArea"
              placeholder="Write a message..."
              id="chatRoomTxtArea"
              onChange={this._handleInput}
            />
            <button
              className="chatRoomSendMessage"
              id="sendMsg"
              onClick={this._btnClickHandelerSendMsg}
            >
              <img
                src={process.env.PUBLIC_URL + "/send-icon.png"}
                alt="sebnBtn"
              />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="chatRoomSourceIsNotSelected">
          Please select a chat to start messaging
        </div>
      );
    }
  }
}
