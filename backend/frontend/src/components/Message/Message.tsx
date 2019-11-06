import * as React from 'react';
import "./Message.css";
import Context from "../../context/context";

export interface IAppProps{
    msg: IMessage;
}

export interface IMessage {
    UserId: number;
    text: string;
}

export interface IAppState {
}

export default class Message extends React.Component<IAppProps, IAppState> {

  static contextType = Context;

  public render() {
    if(this.context.userId == this.props.msg.UserId){
        return(
            <div className="messageWrapper">
                <div className="messageSpacer">

                </div>
                <div className="messageText userMsg">
                    {this.props.msg.text}
                </div>
            </div>
        )
    }else{
        return(
            <div className="messageWrapper">
                <div className="messageText notUserMsg">
                    {this.props.msg.text}
                </div>
                <div className="messageSpacer">

                </div>
            </div>
        )
    }
  }
}
