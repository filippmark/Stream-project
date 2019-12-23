import React from 'react';


export default React.createContext({
    isAuthorized: false,
    jwt: null,
    userId: 0,
    isChatSelected: false,
    chat: {
        id: 0,
        name: ""
    },
    chats: [],
    lastMessages: [],
    setJwtToken: (token: any) => {},
    setAuthorized : (newState: boolean) => {},
    setUserId: (id: number) => {},
    setChats: (chat:[]) => {},
    setSelectedChat: (chat: {name: string; id:number}) => { },
    setLastMessages: (messages: [{text: string; UserId: number; }]) => {},
});