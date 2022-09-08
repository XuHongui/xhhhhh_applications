// 引入mongoose 
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect("mongodb://localhost/application");
//获取db
const db = mongoose.connection;

// 链接失败失败
db.on('error', console.error.bind(console, 'connection error:'));
// 链接上数据库提示
db.once('open', function() {
    console.log("链接application数据库成功")
});

const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 月薪
});

const UserModel = mongoose.model('user', userSchema);

exports.UserModel = UserModel;

// 记录聊天记录文档
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发出的信息的id
    to: {type: String, required: true},  // 接受信息的id
    chat_id: {type:String, require:true}, // 聊天记录的id
    content: {type: String, require:true}, // 聊天的内容
    read: {type: Boolean, default: false}, // 查看状态
    create_time: {type: Number} // 消息创建的时间
})
const ChatModel = mongoose.model('chat', chatSchema);
exports.ChatModel = ChatModel; 