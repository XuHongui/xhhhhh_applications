import { TabBar, Image, Badge } from "antd-mobile"
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

export default function FootNav (props){
    // 获取location
    const location = useLocation();
    // 获取当前的地址
    const {pathname} = location;
    let {navList} = props;
    const navigata = useNavigate();
    // 过滤掉多余的nav
    navList = navList.filter(nav=> !nav.hide);
    let icon = "";
    // 获取初始话的激活图标
    navList.forEach((nav) => {
        if(nav.path === pathname){
            icon = nav.icon;
        }
    })
    // 初始化被激活的元素
    const [activeKey, setActiveKey] = useState(icon);
    return (
        <TabBar activeKey={activeKey} onChange={(key)=> {
            let navTo = key;
            if(key === "dashen"){
                navTo = "laoban";
            }else if(key === "laoban"){
                navTo = "dashen";
            }
            setActiveKey(key); 
            navigata(`/${navTo}`);
            }}>
            {navList.map((nav) => {
                return <TabBar.Item 
                key={nav.icon} 
                icon={nav.icon==="message"? <Badge content={props.unReadCount}><Image src={activeKey===nav.icon?require(`./image/${nav.icon}-selected.png`):require(`./image/${nav.icon}.png`)} width={22} height={22}/></Badge>:<Image src={activeKey===nav.icon?require(`./image/${nav.icon}-selected.png`):require(`./image/${nav.icon}.png`)} width={22} height={22}/>} title={nav.text}/>
            })}
        </TabBar>
    )
}