import * as React from 'react';
import './ChatRoom.css';
import Context from '../../context/context';

export interface IAppProps {
}

export interface IAppState {
}

export default class ChatRoom extends React.Component<IAppProps, IAppState> {
  static contextType = Context;

  state = {
      message: "",
      isVisible: false,
  }

  _handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.currentTarget.value);
    if((!this.state.isVisible) && (event.currentTarget.value.length > 0)){
        let element : HTMLElement = document.getElementById("sendMsg") as HTMLInputElement;
        element.className = " makeVisible";
        this.setState({[event.currentTarget.name]: event.currentTarget.value, isVisible: true});

    }else if (event.currentTarget.value.length === 0){
        let element : HTMLElement = document.getElementById("sendMsg") as HTMLInputElement;
        console.log(element.className);
        element.className = "chatRoomSendMessage";
        console.log(element.className);
        this.setState({[event.currentTarget.name]: event.currentTarget.value, isVisible: false});
    }
  }

  public render() {
    if(this.context.isChatSelected){
        return (
            <div className="chatRoom">
                <div className="chatRoomMessages">

                </div>
                <div className="chatRoomControllers">
                    <textarea name="message" className="chatRoomMsgInputArea" placeholder="Write a message..." onChange={this._handleInput}>

                    </textarea>
                    <div ref="send" className="chatRoomSendMessage" id="sendMsg">
                        <img src={process.env.PUBLIC_URL + "/send-icon.png"}/>
                    </div>
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
