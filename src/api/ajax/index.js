import ajax from "./ajax.js";

// 注册请求
export const reqRegister = (user) => ajax('/register', user, 'POST');

// 登录请求
export const reqLogin = (user) => ajax('/login', user, 'POST');

// 更新数据请求
export const reqUpdata = (user) => ajax('/updata', user, 'POST');

// 获取user的请求
export const reqGet = () => ajax("/get");

// 获取userlist的请求
export const reqUserList = (type) => ajax("/getuserlist", {type});

// 获取所有用户和聊天记录组成的对象
export const reqChatMsgList = () => ajax("/msglist");

// 修改聊天记录为已读
export const reqReadMsg = (from) => ajax("/readmsg", {from}, "POST"); 