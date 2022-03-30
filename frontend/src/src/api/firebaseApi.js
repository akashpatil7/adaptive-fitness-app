import fire from "./commonFirebase";
import storageUtils from "../utils/storageUtils";
import memoryUtils from "../utils/memoryUtils";
import {message} from "antd";
import {reqRegister} from "./index";


export async function authenticationSign(username, password) {

    if(username == memoryUtils.registerUser)
    {
        console.log("just reg")
        return true;
    }
    var promise = await fire.auth().signInWithEmailAndPassword(username, password).catch((error) => {
        message.error("Username or Password Error :" + error)
        return
     })
    try {
    var token = await promise.user.getIdToken().catch((error)=>{
        message.error("getIdToken Error :" + error)
        return false;
    })

    }catch (e) {
        return false;
    }

    console.log("Current token : " + token)
    memoryUtils.userToken = token
    memoryUtils.user={username,password}
    message.success("Success!")
    return true;
};

export async function register(username, password,v) {

    try {
        var promise = await fire.auth().createUserWithEmailAndPassword(username, password)
        var token = await promise.user.getIdToken()
        message.success("Success!")
        console.log("Current token : " + token)
        memoryUtils.userToken = token
        memoryUtils.user={username,password}
        memoryUtils.registerUser=username
        const response = await reqRegister(JSON.stringify(v));

    }catch (e) {
        console.log(e.message)
        return
    }


}
