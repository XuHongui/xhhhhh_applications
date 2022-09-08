import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {NavBar, List, Image, Avatar, Grid, Form, Input, Button} from "antd-mobile";
import { Navigate } from "react-router";

import {updata} from "../../redux/actions";

function Laobaninfo(props){
    // 用来装图片数组
    const [arrImage, setArrImage] = useState([]);
    // 装具体头像、招聘职位、公司名称、职位薪资、职位要求
    const [header, setHeader] = useState("");
    const [post, setPost] = useState("");
    const [info, setInfo] = useState("");
    const [company, setCompany] = useState("");
    const [salary, setSalary] = useState("");

    // 当前选择的头像
    const [icon, setIcon] = useState(null);
    
    // 当作conponentWillMonut
    useEffect(() => {
        // 导入图片资源
        let tempImage = [];
        for(let i = 0; i < 20; i++){
            tempImage.push({text: `头像${(i+1)}`,icon:require(`../../assets/images/头像${(i+1)}.png`)});
        }
        setArrImage(tempImage);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 当点击图片时的事件
    function clickHeader(image){
        const {icon, text} = image;
        setHeader(text);
        setIcon(icon);
    }

    // 保存的点击事件
    function save(){
        // 整合user
        const user = {header, post, info, salary,company};
        props.updata(user);
    }

    return (
        <div>
            {props.user.header ? <Navigate to={`/${props.user.type}`}/>: null}
            <NavBar back = {null} style = {{background: "RGB(20,211,122)", color: "white"}}>老板信息完善</NavBar>
            <List>
                    <List.Item extra={<Image src={icon? icon: null} style={{ borderRadius: 20 }} fit='cover' width={40} height={40}/>} description={"已选头像为"}></List.Item>
                    <Grid columns={5} gap={4}>
                    {arrImage.map((image) => {
                        return (
                            <Grid.Item key={image.text}> 
                                <div style={{height: "70px", textAlign: "center"}} onClick={ () => {clickHeader(image)}}>
                                    <Avatar src={image.icon} style={{ '--size': '21px', margin:"0 auto 5px auto"}}/>
                                    <span>{image.text}</span>
                                </div>
                            </Grid.Item>
                        )
                    })}
                   </Grid>
                   <Form layout='horizontal' mode='card'>
                        <Form.Item label='招聘职位：'>
                        <Input placeholder='请输入' value={post} onChange={(value) => {setPost(value)}}/>
                        </Form.Item>
                        <Form.Item label='公司名称：'>
                        <Input placeholder='请输入' value={company} onChange={(value) => {setCompany(value)}}/>
                        </Form.Item>
                        <Form.Item label='职位薪资：'>
                        <Input placeholder='请输入' value={salary} onChange={(value) => {setSalary(value)}}/>
                        </Form.Item>
                        <Form.Item label='职位要求：'>
                        <Input placeholder='请输入' value={info} onChange={(value) => {setInfo(value)}}/>
                        </Form.Item>
                        <Form.Header />
                    </Form>
            </List>
            <Button block color='primary' size='large' style={{position: "absolute", bottom: "-45px"}} onClick={save}>保存</Button>
        </div>
    );
}

export default connect((state) => ({user: state.user}), {updata})(Laobaninfo);