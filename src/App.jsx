import { useRoutes } from "react-router"

// 引入路由表
import routers from "./routers"

export default function App(){
    const element = useRoutes(routers);
    return (
        <div>
            {element}
        </div>
    )
}