import { Outlet, Navigate, useLocation } from "react-router"
import { connect } from "react-redux"
import Cookies from "js-cookie"
import {useEffect} from "react"
import {NavBar} from 'antd-mobile'

import {get} from "../../redux/actions"
import {getRedirectTo} from "../../utils/index"
import FootNav from "../../components/FootNav"

function Main(props){
    // 获取当前在路由的路径
    const {pathname} = useLocation();
    
    // 给组件对象添加属性
    let navList = [ // 包含所有导航组件的相关信息数据
        {
        path: '/laoban', // 路由路径
        title: '大神列表',
        icon: 'dashen',
        text: '大神',
        },
        {
        path: '/dashen', // 路由路径
        title: '老板列表',
        icon: 'laoban',
        text: '老板',
        },
        {
        path: '/message', // 路由路径
        title: '消息列表',
        icon: 'message',
        text: '消息',
        },
        {
        path: '/personal', // 路由路径
        title: '用户中心',
        icon: 'personal',
        text: '个人',
        }
    ]

    // 自动登录模块
    // 如果登录时有user._id则说明已登录， 如果没有但有cookie说明以前登录过

    // 获取cookie中userid 
    const userid = Cookies.get('userid');

    // 加载完后如果有cookie但没有id则进行登录
    useEffect(() => {
        // 如果userid存在（cookie中有数据）且user中没有_id说明还没进行登录
        if(userid && ! props.user._id){
            props.get();
        }
     }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 如果userid不存在则说明没有登录过重定到login路由
    if(!userid){
        return <Navigate to="/login" />
    }

    
    // cookie中存在id 但没有登录
    // 如果没登录先返回null 在加载完后去登录
    if(!props.user._id){
        return null;
    }else{
        // 如果路径仅有/则说明访问了主路由要重定路径
        if(pathname === '/'){
            const {type, header} = props.user;
            // 获取要跳转的页面
            let path = getRedirectTo(type, header);
            return <Navigate to={path}/>
        }

        // 获取当前页面显示的nav
        const currentNav = navList.find(nav => nav.path === pathname)
        // 既有cookie 又有 id 的情况则正常现实
        
        //如果地址中有dashen则隐藏laoban 与此相反如果有laoban隐藏大神
        if(props.user.type === 'laoban'){
            navList[1].hide = true;
        }else if(props.user.type === 'dashen'){
            navList[0].hide = true;
        }

        return (
            <div>
                {currentNav?<NavBar className="navHeader" back = {null} style = {{background: "RGB(20,211,122)", color: "white"}}>{currentNav.title}</NavBar>: null}
                <Outlet/>
                {currentNav?<FootNav navList={navList} unReadCount={props.unReadCount}/>: null}
            </div>
        )
    }

}

export default connect((state) => ({user: state.user, unReadCount: state.chat.unReadCount}), {get})(Main);