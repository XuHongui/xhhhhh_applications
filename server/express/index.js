const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {route} = require("./route");
const socket = require("./socket");

// 操作express变量
const app = express();
// 设定服务器端口
const port = 6000;

// 使用中间件使post请求中的body可以使用
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 使用cookie中间件
app.use(cookieParser());

app.use(route);

const server = app.listen(port, () => {
    console.log(`服务器${port}开启`)
});

// 注册socket.io
socket(server);
