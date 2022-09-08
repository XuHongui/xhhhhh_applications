import { combineReducers } from "redux";
import { getRedirectTo } from "../utils";

import { AUTH_SUCCESS, ERROR_MSG, USER_UPDATA, ERROR_UPDATA, RESET_USER, USER_LIST, DECEIVE_CHAT_LIST, DECEIVE_CHAT, READ_CHAT} from "./type_const";

// user的初始化
const initUser = {
    // 用户名
    username: "",
    // 用户类型
    type: "",
    // 错误提示信息
    msg: '', 
    // 需要自动重定向的路由路径
    redirectTo: ''
}

// 初始化userList的值
const initUserList = [];

// 初始化聊天记录的容器
const initChat = {};

// 装user信息的容器
function user(prestate = initUser, action){
    const {type, data} = action;
    switch (type) {
        // 成功返回时
        case AUTH_SUCCESS:
            // 设置重置项
            const redirectTo = getRedirectTo(data.type, data.header);
            return {...data, redirectTo};   // data是user 
        case ERROR_MSG:
            return {...prestate, msg: data} // data是msg
        case USER_UPDATA:
            // 如果修改数据成功则将数据都返回
            // data为user
            return {...data};
        case ERROR_UPDATA:
            // 如果修改数据失败则将用户信息重置
            // data为msg
            return {...initUser, msg: data};
        case RESET_USER:
            return {...initUser, msg: data};
        default:
            return prestate;
    }
}

// 装userlist的容器
function userList(prestate = initUserList, actoin){
    const {data, type} = actoin;
    switch(type){
        case USER_LIST: 
            return data;
        case ERROR_MSG:
            return data;
        default: 
            return prestate;
    }
}

// 装chat的容器
function chat(prestate = initChat, action){
    const {type, data} = action;
    switch(type){
        // 获得所有用户的相关信息及获得该用户相关的聊天信息
        case DECEIVE_CHAT_LIST:
            const {chat, userid} = data;
            const {chatMsgs} = chat;
            // data为chatList
            // 记录未读的数量
            const unReadCount = chatMsgs.reduce((count, chat) => {
                if(!chat.read && userid===chat.to){
                    return count + 1;
                }
                return count;
            }, 0);
            return {...chat, unReadCount};
        // 获得单条聊天信息
        case DECEIVE_CHAT:
            // 拿出消息
            const {chatMsg} = data;
            let read = 0;
            if(!chatMsg.read && data.userid===chatMsg.to){
                read += 1; 
            }
            return {
                users: prestate.users,
                chatMsgs: [...prestate.chatMsgs, chatMsg],
                unReadCount: prestate.unReadCount + read
            };
        case READ_CHAT:
            const {to, from, count} = data;
            const chatMsgstemp = prestate.chatMsgs.map(chat => {
                // 如果to和from相等，将read修改为true
                if(to === chat.to && from === chat.from){
                    return {...chat, read:true};
                }else{
                    return chat;
                }
            });
            return {
                users: prestate.users,
                chatMsgs: chatMsgstemp,
                unReadCount: prestate.unReadCount - count
            }
        default:
            return prestate;
    }
}


export default combineReducers({user, userList, chat});