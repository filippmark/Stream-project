import React from 'react';


export default React.createContext({
    isAuthorized: false,
    userId: 0,
    isChatSelected: false,
    chat: {
        id: 0,
        name: ""
    },
    chats: [],
    setAuthorized : (newState: boolean) => {},
    setUserId: (id: number) => {},
    setChats: (chat:[]) => {},
    setSelectedChat: (chat: {name: string; id:number}) => { },
});