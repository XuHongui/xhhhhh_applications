import { connect } from "react-redux";
import { useEffect } from "react";

import UserList from "../../components/UserList";
import {getUserList} from '../../redux/actions';

function Dashen(props){
    // 当此画面渲染的时候得到userList
    useEffect(() =>{
        props.getUserList('laoban');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="context">
            <UserList userList={props.userList}/>
        </div>
    )  
}

export default connect(state => ({userList: state.userList}), {getUserList})(Dashen);