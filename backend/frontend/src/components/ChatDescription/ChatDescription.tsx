import * as React from "react";
import "./ChatDescription.css";
import Context from "../../context/context";
import { graphqlEndPoint } from "../../App";
import { SubscriptionClient } from "subscriptions-transport-ws";


const GRAPHQL_ENDPOINT = 'ws://localhost:8081/graphql';

export interface IAppProps {
  name: string;
  id: number;
  amountOfUsers: number;
  creatorId: number;
  queryMessages: any;
}

export interface IAppState {
  lastMessage: string;
}

export default class ChatDescription extends React.Component<
  IAppProps,
  IAppState
> {

  _client: SubscriptionClient;

  static contextType = Context;

  state = {
    lastMessage: ""
  };

  componentDidMount() {
    this._client = this._setSubscriptionClient();
    this._setLastMessage();
    this._startSubscription();
  }

  componentWillUnmount() {
    this._client.unsubscribeAll();
  }

  _setSubscriptionClient = () => {
    console.log(this.context);
    return new SubscriptionClient(GRAPHQL_ENDPOINT, {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${this.context.jwt}`
        }
      }
    });
  };

  _startSubscription = () => {
    const subscription = this._client.request({
      query: this._subscriptionToGraphql()
    });
    const add = this._addNewMsgBySubscription;
    subscription.subscribe({
      next({ data }) {
        if (data) {
          add(data.messageAdded.text);
        }
      }
    });
  };

  _addNewMsgBySubscription = (lastMessage: string) => {
    this.setState({ lastMessage });
  };

  _clickHandler = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    let element: HTMLElement = event.currentTarget;
    if (this.context.isChatSelected) {
      let selectedChat = document.getElementById(
        `chatDescription-${this.context.chat.id}`
      );
      if (selectedChat)
        selectedChat.classList.remove('selectedChat');
    }
    element.className += " selectedChat";
    this.context.setSelectedChat({ id: this.props.id, name: this.props.name });
    let mesgs = await this.props.queryMessages(50, this.props.id);
    this.context.setLastMessages(mesgs);
  };

  _setLastMessage = async () => {
    const message = await this.props.queryMessages(1, this.props.id);
    if (message.length > 0) {
      this.setState({ lastMessage: message[0].text });
    }
  };

  _subscriptionToGraphql = (): string => {
    return `
        subscription{
            messageAdded(chatRoomId: ${this.props.id}){
                text
                UserId
            }
        }
    `;
  };

  _getChatName = (name: string): string => {
    if (this.props.amountOfUsers === 2) {
      const names = name.split(" ");
      return this.context.userId === this.props.creatorId ? names[1] : names[0];
    } else {
      if (this.props.amountOfUsers === 1) {
        return name.split(" ")[0];
      }
      return name;
    }
  };

  public render() {
    return (
      <div
        className="chatDescription"
        onClick={this._clickHandler}
        id={`chatDescription-${this.props.id}`}
      >
        <div className="chatTitle">{this._getChatName(this.props.name)}</div>
        <div className="chatLastMessage">{this.state.lastMessage}</div>
      </div>
    );
  }
}
