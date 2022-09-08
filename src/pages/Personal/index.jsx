import {Result, List, Button, Modal} from 'antd-mobile'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'

import {resetUserAction} from '../../redux/actions'

function Personal(props){
    const {user} = props;
    const {header, username, company, post, info, salary} = user;
    // 退出登录的onclick
    function logout(){
        Modal.show({
            content: '是否要退出登录',
            closeOnAction: true,
            actions: [
                {
                    key: 'exit',
                    text: '退出',
                    primary: true,
                    onClick: () => {
                        // 如果点击退出则将在浏览器中的cookie删除
                        // 将redux中的user初始化
                        Cookies.remove('userid');
                        props.resetUserAction();
                    }
                },
                {
                    key: 'cancel',
                    text: '取消',
                }
            ]
        });
    }

    return (
        <div className="context">
            <Result
            icon={<img alt="头像" src= {require(`../../assets/images/${header}.png`)}/>}
            status='success'
            title={username}
            description={company}
            />
            <List header='相关信息'>
                <List.Item>职位:{post}</List.Item>
                <List.Item>简介:{info}</List.Item>
                {salary? <List.Item>薪资:{salary}</List.Item>: null}
            </List>
            <Button 
            block color='danger' 
            size='large'
            onClick={logout}
            >
                退出登录
            </Button>
        </div>
    )  
}

export default connect(state => ({user: state.user}), {resetUserAction})(Personal);