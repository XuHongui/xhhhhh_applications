import io from 'socket.io-client'

import { AUTH_SUCCESS, ERROR_MSG, USER_UPDATA, ERROR_UPDATA, RESET_USER, USER_LIST, DECEIVE_CHAT_LIST, DECEIVE_CHAT, READ_CHAT} from "./type_const";
import { reqLogin, reqRegister, reqUpdata, reqGet, reqUserList, reqChatMsgList, reqReadMsg} from "../api/ajax";
// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
// 失败信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data:msg});
// 修改数据成功的同步action
const updataAction = (user) => ({type: USER_UPDATA, data:user});
// 修改数据失败的同步action
const errorUpdataAction = (msg) => ({type: ERROR_UPDATA, data:msg});
// 重置user的同步action
export const resetUserAction = (msg) => ({type: RESET_USER, data:msg});
// 获取所有用户的id和头像和相关聊天信息的同步action
const receiveChatListAction = (chat, userid) => ({type: DECEIVE_CHAT_LIST, data: {chat, userid}});
// 获取单个聊天记录的同步action
const receiveChatAction = (chatMsg, userid) => ({type: DECEIVE_CHAT, data: {chatMsg, userid}})
// 修改已读聊天的同步action
const readChatAction = (count) => ({type:READ_CHAT, data:count})

// 获取userList的同步action
const getUserListAction = (userList) => ({type: USER_LIST, data: userList});
const getUserListErroAction = () => ({type: ERROR_MSG, data: []});


// 注册的action
export const register = (user) => {
    const {username, password, password2, type} = user;
    // 用户名没有输入的时候
    if(!username){
        return errorMsg("用户名必须指定!");
    }
    // 密码与确认密码不相同的情况
    if(password !== password2){
        return errorMsg("密码与确认密码要相同");
    }
    // 如果用户名和密码都没有问题则处理异步的action返回的是一个函数在react-redux中会接收一个dispatch
    return async dispatch => {
        // reqRegister返回的是一个promise但我们只需要对data进行判断则用await
        const response = await reqRegister({username, password, type});
        const result = response.data;

        // 如果code===0则说明成功， 且返回的data为user， 如果code===1 则失败，且返回的data是msg
        if(result.code === 0){
            dispatch(authSuccess(result.data));
            receiveChatList(dispatch, result.data._id);
        }else{
            dispatch(errorMsg(result.msg));
        }
    }
}

// 登录的action
export const login = (user) => {
    const {username, password} = user;
    // 用户名没有输入的时候
    if(!username){
        return errorMsg("用户名必须指定!");
    }
    // 密码一定要输入
    if(!password){
        return errorMsg("密码必须指定！");
    }
    // 如果用户名和密码都没有问题则处理异步的action返回的是一个函数在react-redux中会接收一个dispatch
    return async dispatch => {
        // reqRegister返回的是一个promise但我们只需要对data进行判断则用await
        const response = await reqLogin({username, password});
        const result = response.data;
        // 如果code===0则说明成功， 且返回的data为user， 如果code===1 则失败，且返回的data是msg
        if(result.code === 0){
            dispatch(authSuccess(result.data));
            receiveChatList(dispatch, result.data._id);
        }else{
            dispatch(errorMsg(result.msg));
        }
    }
}

// 修改数据的action
export const updata = (user) => {
    return async dispatch => {
        // 发送ajax请求获取返回的值
        const response = await reqUpdata(user);
        // 取得请求体的结果
        const result = response.data;
        // 如果result的code 为 0 说明修改成功， 如果code 1 则说明修改失败且要重新登录
        if(result.code === 0){
            // 修改成功
            dispatch(updataAction(result.data));
        }else{
            // 修改失败
            dispatch(errorUpdataAction(result.msg));
        }
    }
}

// 获取数据的action
export const get = () => {
    return async dispatch => {
        const response = await reqGet();
        const result = response.data;
        // 如果code === 0则说明获取user成功
        if(result.code === 0){
            dispatch(updataAction(result.data));
            receiveChatList(dispatch, result.data._id);
        }else{
            // 进入这说明code === 1则说明获取数据失败
            dispatch(errorUpdataAction(result.msg));
        }
    }
}

// 获取userlist的异步action
export const getUserList = (type) => {
    return async dispatch => {
        const respond = await reqUserList(type);
        const result = respond.data;
        const {code, data} = result;
        // 如果code === 0则说明成功
        if(code === 0){
            dispatch(getUserListAction(data));
        }else{
            // 如果code !== 0说明接受失败
            dispatch(getUserListErroAction());
        }
    }
}

// 获取所有用户和相关聊天记录的action
async function receiveChatList(dispatch, userid){
    // 每次获取聊天消息的时候就初始化socket
    initSocket(dispatch,userid);
    const response = await reqChatMsgList();
    const result = response.data;
    // 如果接受到的信息没有问题则发送action修改store
    if(result.code === 0){
        dispatch(receiveChatListAction(result.data, userid));
    }
}

// 初始化socket
function initSocket(dispatch, userid){
    // 如果io中没有socket属性说明还没初始化
    if(!io.socket){
        // 没有链接服务器
        io.socket = io("ws://192.168.1.102:3000");
        // 绑定服务器发来的聊天记录
        io.socket.on('chat', (chatMsg) => {
            //  接受与我相关的chatMsg
            console.log(userid);
            console.log("从服务器接受到消息为", chatMsg);
            if(userid === chatMsg.from || userid === chatMsg.to){
                console.log("从服务器接受到消息为", chatMsg);
                dispatch(receiveChatAction(chatMsg, userid));
            }
        });
    }
}

// 向服务器发送chatMsg消息
export function sendChatMsg(chatMsg){
    return () => {
        console.log("发送的消息为",chatMsg)
        io.socket.emit('chat', chatMsg);
    }
}

// 修改已读的异步action
export function readChat(from, to){
    return async dispatch => {
        const respond = await reqReadMsg(from);
        const result = respond.data;
        const {code, data} = result
        if(code===0){
            dispatch(readChatAction({count:data, from, to}));
        }
        
    }
}
