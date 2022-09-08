import {connect} from "react-redux"
import {List, Badge} from "antd-mobile";
import {useNavigate} from 'react-router'

function Message(props){
    // 获取navigate钩子
    const navigate = useNavigate();
    // 拿出自己的id
    const userid = props.user._id;
    // 拿出chatMsgs
    const {chatMsgs, users} = props.chat;
    //如果chatMsgs没有获取到返回空画面
    if(!chatMsgs){
        return null;
    }
    let lastChat = {};
    // 遍历整个chatMsgs最后发出的数据
    chatMsgs.forEach((chat) => {
        // 如果这个数组没有则直接加进最后的lastChat中
        
        // 给chat身上挂在一个readCount
        if(!chat.read && userid === chat.to){
            // 如果没有已读过则为1
            chat.readCount = 1;
        }else{
            // 如果已读则为0
            chat.readCount = 0;
        }
        if(!lastChat[chat.chat_id]){
            lastChat[chat.chat_id] = chat;
        }else{
            // 更新未读数量
            const readCount = lastChat[chat.chat_id].readCount + chat.readCount;
            // 让lastchat相关的记录和chat的创建时间相比如果大则覆盖
            if(chat.create_time > lastChat[chat.chat_id].create_time){
                lastChat[chat.chat_id] = chat;
            }
            // 写入lastChat中对应的消息中
            lastChat[chat.chat_id].readCount = readCount;
        }
    });
    // 将筛查好的数据变成数组
    let chatMsgList = Object.values(lastChat);
    // 对这个数组进行排序，时间大的在前时间小的在后
    chatMsgList.sort((a, b) => b.create_time - a.create_time);

    // 点击message时的回调
    function navToChat(targetId){
        navigate(`/chat/${targetId}`);
    }
    return (
        <div className="context">
            <List>
                {chatMsgList.map((chat) => {
                    // 得到目标的id
                    let targetId = "";
                    if(userid === chat.to){
                        targetId = chat.from;
                    }else{
                        targetId = chat.to;
                    }
                    // 得到目标的头像
                    const header = users[targetId].header;
                    return <List.Item 
                    onClick={() => {navToChat(targetId)}} 
                    key={chat.chat_id} 
                    prefix={header?<img alt="" src={require(`../../assets/images/${header}.png`)}/>: null} 
                    extra={<Badge content={chat.readCount}><div>{users[targetId].username}</div></Badge>}>{chat.content}</List.Item>
                })}
            </List>
        </div>
    )  
}

export default connect(state => ({chat: state.chat, user: state.user}))(Message);