
import Main from "../pages/Main";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Laobaninfo from "../pages/Laobaninfo";
import Dasheninfo from "../pages/Dasheninfo";
import Dashen from "../pages/Dashen";
import Laoban from "../pages/Laoban";
import Message from "../pages/Message";
import Personal from "../pages/Personal";
import Chat from "../pages/Chat";

//该文件配置路由表
const routers = [
    // 主页面的路由
    {
        path: "main",
        element: <Main/>
    },
    // 注册的路由
    {
        path: "register",
        element: <Register/>
    },
    // 登录的路由
    {
        path: "login",
        element: <Login/>
    },
    //默认显示
    {
        path: "/",
        element: <Main/>,
        children: [
            // 老板信息详细填充的路由
            {
                path: "laobaninfo",
                element: <Laobaninfo/>
            },
            // 大神信息详细填充的路由
            {
                path: "dasheninfo",
                element: <Dasheninfo/>
            },
            {
                path: "dashen",
                element: <Dashen/>
            }
            ,
            {
                path: "laoban",
                element: <Laoban/>
            }
            ,
            {
                path: "message",
                element: <Message/>
            },
            {
                path: "personal",
                element: <Personal/>
            },
            {
                path: 'chat/:userid',
                element: <Chat/>
            }
        ]
    }
];

export default routers;