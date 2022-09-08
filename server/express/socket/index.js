const {ChatModel} = require('../db')
module.exports = function(server){
    // 注册io
    const io = require('socket.io')(server);
    io.on('connection', (socket) =>{
        // 如果收到消息的事件绑定
        socket.on('chat', (chatMsg) => {
            // 将收到是数据保存数据库后发给所有用户
            //console.log("服务器接受到是消息为", chatMsg);
            const {to, from, content} = chatMsg;
            const chat_id = [to,from].sort().join('_');
            new ChatModel({to, from, content, chat_id, create_time: Date.now()}).save( (erro, data) =>{
                // 保存将聊天信息返回给客户端
                if(!erro){
                    console.log("保存在数据库中的数据为", data);
                    io.emit('chat', data);
                }
            })
        })
    });
}