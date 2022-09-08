import {Card, Space} from 'antd-mobile';
import {useNavigate} from 'react-router'

export default function UserList(props){   
    // 获取navigate
    const navigate = useNavigate();
    // 获取userlist
    let {userList} = props;
    // 如果还没有获取时先显示空白
    if(!userList){
        return null;
    }
    if(userList)
    userList = userList.filter((user) => user.header);
    // 点击用户后跳转到聊天界面
    function navToChat(toId){
        navigate(`/chat/${toId}`);
    }
    return (
        <div> 
            <Space direction='vertical' block>
                {userList.map((user) => {
                    return (
                        <Card key={user._id} title={<img alt={user.header} src={require(`../../assets/images/${user.header}.png`)}/>} extra={user.username} onClick={() => {navToChat(user._id)}}>
                            <div>职位: {user.post}</div>
                            {user.company? <div>公司: {user.company}</div>: null}
                            {user.salary? <div>薪资: {user.salary}</div>: null}
                            <div>描述: {user.info}</div>
                        </Card>
                        )
                })} 
            </Space>
        </div>
    )
} 