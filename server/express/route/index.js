const express = require("express");
const md5 = require('md5');

const route = express.Router();

const {UserModel, ChatModel} = require("../db");

// 过滤的数据
const filter = {password: 0, __v: 0};

// 注册请求
route.post("/register", (req, res) => {
    const {username, type, password} = req.body;
    const p = new Promise( (resolve, reject) => {
        // 如果username和password其中有一个是undefined返回失败
        if(!(username&&type&&password)){
            reject(undefined);
        }
        UserModel.findOne({username}, (error, user) => {
            if(user){
                // 如果用户已存在返回code 1 msg 用户名已存在
                reject(error);
            }else{
                resolve({username, type, password: md5(password)});
            }
        })               
    });

    // 如果成功则把数据保存在数据库中，如果不成功则返回错误
    p.then((value) => {
        new UserModel(value).save((error, user) => {
            const data = {username, type, _id: user._id};
            res.cookie("userid", user._id);
            res.send({code: 0, data});
        });
    }).catch((error) => {
        // 如果失败且没有报错则返回 code 1 msg 用户名已存在
        if(!error){
            res.send({code:1, msg: "用户名已存在或输入格式有问题"});
        }else{
            res.send({code:1, msg: "服务器出错请联系工作人员"});
        }
    })
});

// 登录请求
route.post("/login", (req, res) => {
    const {username, password} = req.body;
    const p = new Promise( (resolve, reject) => {
        UserModel.findOne({username, password:md5(password)}, filter, (error, user) => {
            if(user){
                // 如果存在则账号密码输入正确
                resolve(user);
            }else{
                // 没有则说明用户名或密码错误或者说查询失败
                reject(error);
            }
        })               
    });

    // 如果成功则返回成功
    p.then((value) => {
        res.cookie("userid", value._id);
        res.send({code: 0, data: value})
    }).catch((error) => {
        // 如果失败且没有报错则返回 code 1 msg 用户名或密码错误
        if(!error){
            res.send({code:1, msg: "用户名或密码错误"});
        }else{
            res.send({code:1, msg: "服务器出错请联系工作人员"});
        }
    })
});

// 通过cookie中userid更新用户数据的请求
route.post("/updata", (req, res) => {
    const {userid} = req.cookies;
    const user = req.body;
    // 如果cookie中没有id则说明没有登录返回code 1 msg 请先登录
    if(!userid){
        return res.send({code:1, msg: "请先登录"});
    }
    // 如果有cookie进行搜索修改
    UserModel.findByIdAndUpdate(userid, user, (error, oldUser) => {
        // 如果cookie被串改 则oldUser没有值 将cookie删除后 返回code 1 msg 请先登录
        if(!oldUser){
            res.clearCookie('userid');
            res.send({code:1, msg: "请先登录"});
        }else{
            // 如果存在数据则说明是正常用户用来修改值
            // 穿进来的值仅有需要更新的数据没有_id 和 username 和 type
            // 返回 code 0 data 为数据
            const {_id, username, type} = oldUser;
            const data = Object.assign({_id, username, type}, user);
            res.send({code: 0, data});
        }
    })
});

// 通过cookie中的userid获取用户信息(自动登录)
route.get("/get", (req, res) => {
    // 获取userid
    const {userid} = req.cookies;
    // 如果userid不存在则说明没有登录过
    if(!userid){
        res.send({code: 1, msg: "请先登录"});
    }else{
        // 则说明userid存在则链接数据库进行查找
        UserModel.findById(userid, {password: 0}, (error, user) => {
            // 如果user不存在说明cookie有问题 清除客户端的cookie后返回code 1 msg 请先登录
            if(!user){
                res.clearCookie('userid');
                res.send({code:1, msg: "请先登录"});
            }else{
                // 如果user有值说明cookie正确返回user给客户端
                res.send({code: 0, data: user});
            }
        });
    }
});

// 获得userList的请求
// 传入一个参数type代表要拿什么类型的user列表
route.get('/getuserlist', (req, res) => {
    // 获取要得到的用户列表
    const {type} = req.query;
    // mongodb 查询符合的用户
    UserModel.find({type}, filter, (erro, user) => {
        res.send({code: 0, data: user});
    });
});

// 获取当前所有的用户和相关的聊天的记录
route.get('/msglist', (req, res) => {
    // 获取当前获取msglist用户的id
    const userid = req.cookies.userid;
    // 获取当前所有的用户
    UserModel.find((erro, userDocs) => {
        // users为装有user的一个数组
        const users = userDocs.reduce((users, user)=>{
            users[user.id] = {username: user.username, header: user.header};
            return users;
        }, {});
        // 找出与我相关的聊天信息
        ChatModel.find({$or: [{from: userid}, {to: userid}]}, (erro, chatMsgs) => {
            if(!chatMsgs){
                chatMsgs = [];
            }
            res.send({code: 0, data: {users, chatMsgs}});
        })
    });
})

// 修改指定消息为已读
route.post('/readmsg', (req, res) => {
    // 获取发送人的id
    const from = req.body.from;
    // 获取自己的id
    const to = req.cookies.userid;
    // 修改未读未已读
    ChatModel.updateMany({from, to, read: false}, {read:true}, (erro,doc) => {
        // 返回修改了的数据的条数
        res.send({code: 0, data: doc.modifiedCount});
    });
});


exports.route = route;