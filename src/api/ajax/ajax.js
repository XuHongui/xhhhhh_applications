import axios from "axios";

const baseUrl = "";
/**
 *  参数    1、url
 *          2、要传输的数据
 *          3、传输的类型，使用大写如get请求就为GET
 */
export default function ajax(url, data = {}, type = "GET"){
    url = baseUrl + url;  
    if(type === "GET"){
        // 如果是get请求则需要拼串因为数据只能通过&xxx=55的方式去发送
        let paramStr = ""
        Object.keys(data).forEach( (key) => {
            paramStr = paramStr + `${key}=${data[key]}&`;
        })
        // 如果有参数进行拼串处理
        if(paramStr){
            paramStr = paramStr.substring(0, paramStr.length - 1);
            paramStr = "?" + paramStr;
        }
        return axios.get(url + paramStr);
    }else{
        // 如果不是GET请求都请求POST
        return axios.post(url, data);
    }
}