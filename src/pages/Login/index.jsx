import { useState } from "react"
import { 
    NavBar,
    Form,
    Input,
    Space,
    Button
} from "antd-mobile"
import {useNavigate, Navigate} from "react-router"
import { connect } from "react-redux";

import {login} from "../../redux/actions";

function Login(props){

    // 输入的用户名
    const [username, setUsername] = useState("");
    // 输入的密码
    const [password, setPassword] = useState("");

    // 编程导航
    let navigate = useNavigate();

    // 已有用户的点击事件
    function register(){
        navigate('/register');
    }
    // 登录的点击事件
    function login(){
        // 整合user对象
        const user = {username,password};
        props.login(user);
    }

    return (
        <div>
            {props.user.redirectTo? <Navigate to={props.user.redirectTo}/> : ""}
            <NavBar back = {null} style = {{background: "RGB(20,211,122)", color: "white"}}>招聘</NavBar>
                <Form layout='horizontal' >
                    {props.user.msg? <div className="errorMsg">{props.user.msg}</div> : ""}
                    <Space justify="center" direction="vertical" wrap={true} block>
                        <Form.Item label='用户名' name='username'>
                            <Input placeholder='请输入用户名' clearable value={username} onChange={(value) => {setUsername(value)}}/>
                        </Form.Item>
                        <Form.Item label='密码' name='password' >
                            <Input placeholder='请输入密码' clearable type='password' value={password} onChange={(value) => {setPassword(value)}}/>
                        </Form.Item>
                        <Button block color='primary' size='large' onClick={login}>登录</Button>
                        <Button block onClick={register}>注册</Button>  
                    </Space>
                </Form>     
        </div>
    )
}


export default connect(state => ({user:state.user}), {login})(Login);