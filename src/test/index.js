// 测试socket.io
import io from 'socket.io-client'

const socket = io('ws://localhost:3000')
socket.on("chat", (data) => {
    console.log(data);
    socket.emit('chat', data)
});
