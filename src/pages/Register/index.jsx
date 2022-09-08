import { useState } from "react"
import { 
    NavBar,
    Form,
    Input,
    Space,
    Button,
    Radio
} from "antd-mobile"
import { useNavigate, Navigate } from "react-router";
import { connect } from "react-redux";

import {register} from "../../redux/actions";

function Register(props){
    // 单选按钮
    const [type, setType] = useState("laoban");
    // 输入的用户名
    const [username, setUsername] = useState("");
    // 输入的密码
    const [password, setPassword] = useState("");
    // 输入的确认密码
    const [password2, setPassword2] = useState("");
    
    // 编程导航
    let navigate = useNavigate();

    // 已有用户的点击事件
    function hasuser(){
        navigate('/login');
    }
    // 注册的点击事件
    function register(){
        const user = {type,username,password, password2};
        props.register(user);
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
                        <Form.Item label='确认密码' name='checkPassword' >
                            <Input placeholder='请再次输入密码' clearable type='password' value={password2} onChange={(value) => {setPassword2(value)}}/>
                        </Form.Item>
                        <Radio.Group value={type} onChange={type => {setType(type)}}>
                            <Space justify="center" block>
                                <Radio value="laoban">老板</Radio>
                                <Radio value="dashen">大神</Radio>
                            </Space>
                        </Radio.Group>
                        <Button block color='primary' size='large' onClick={register}>注册</Button>
                        <Button block onClick={hasuser}>已有用户</Button>  
                    </Space>
                </Form>     
        </div>
    )
}

export default connect(state => ({user: state.user}),{register})(Register);