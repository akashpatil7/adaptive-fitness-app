import fire from "./commonFirebase";
import storageUtils from "../utils/storageUtils";
import memoryUtils from "../utils/memoryUtils";
import {message} from "antd";


export function authenticationSign(username,password)
    {

        fire.auth().signInWithEmailAndPassword(username,password).then((u)=>{
            //Persistent login
            memoryUtils.user = {username,password} //Store the username in memory
            storageUtils.saveUser( {username,password} )//store local
            message.success("Success!"+username );

            fire.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                // Send token to your backend via HTTPS
                memoryUtils.userToken = idToken;
                console.log("success get JWT!"+idToken);
            }).catch(function(error) {
                // Handle error
            });


        }).catch((error)=>{
            message.error("Username or Password Error :"+error)
        })
    }
