import {connect} from 'react-redux'
import {NavBar, List, Input, Form} from 'antd-mobile'
import {useState} from 'react'
import {useParams, useNavigate} from 'react-router'

import {sendChatMsg, readChat} from '../../redux/actions.js'

function Chat(props){
    // 获取navigate
    const navigate = useNavigate();
    // 记录输入框的值
    const [content, setContent] = useState("");
    // 查看聊天对象的id
    const params = useParams();
    const targetUserid = params.userid;
    // 自己的id
    const userid = props.user._id;

    // 发送信息的点击事件
    function sendContend(){
        // from的id
        const chatMsg = {
            from: userid,
            to: targetUserid,
            content,
            create_time: Date.now()
        }
        setContent("");
        props.sendChatMsg(chatMsg);
    }
    // 如果数据还没有返回 chat画面显示白屏
    if(!props.chat.users){
        return null;
    }

    // 找出与我和对方相关的聊天记录
    const chatMsgList = props.chat.chatMsgs.filter( (msg) => {
        // 通过自己的id和对方id去过滤多余的消息
        const chat_id = [targetUserid, userid].sort().join('_');
        return chat_id === msg.chat_id;
    })

    // 点击返回按钮的事件
    function toBack(){
        navigate(-1);
        props.readChat(targetUserid, userid);
    }

    return (
        <div>
            <NavBar className='chatHeader navHeader' onBack={toBack}>{props.chat.users[targetUserid].username}</NavBar>
            <List className='chatList'>
                {chatMsgList.map( (chatMsg) => {
                    // 自己发的消息在左边
                    if(chatMsg.from === props.user._id){
                        return <List.Item className='chat-me' extra="我" key={chatMsg._id}>{chatMsg.content}</List.Item>
                    }else{
                        return <List.Item prefix="他" key={chatMsg._id}>{chatMsg.content}</List.Item>
                    }
                })}
            </List>
            <Form className="chatContent">
                <Form.Item extra={<span onClick={sendContend}>发送</span>}>
                    <Input 
                        placeholder='请输入内容'
                        value={content}
                        onChange={val => {
                            setContent(val);
                        }}/> 
                </Form.Item>
            </Form>      
        </div>
    )
}
export default connect(state => ({user: state.user, chat: state.chat}), {sendChatMsg, readChat})(Chat);