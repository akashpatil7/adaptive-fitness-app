import fire, {db} from "./commonFirebase";
import storageUtils from "../utils/storageUtils";
import memoryUtils from "../utils/memoryUtils";
import {message} from "antd";
import {reqRegister} from "./index";
import ajax from "./ajax";


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

export function addData(collectionPath,doc,data){
    db.collection(collectionPath).doc(doc).set(data)
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

export function getPlansData(collectionPath,doc)
{
    var docRef = db.collection(collectionPath).doc(doc);

    docRef.get().then(async (doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            let response = await ajax('/food/getPlans', doc.data(), 'POST')
            if (response.data)
            {
                console.log(response.data);
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

export async function register(username, password,v) {

    try {
        var promise = await fire.auth().createUserWithEmailAndPassword(username, password)
        var token = await promise.user.getIdToken()
        message.success("Success!")
        console.log("Current token : " + token)
        var data = {
            "email":v.email,
            "experience":v.experience,
            "gender": v.gender,
            "activity_level_ratio": v.activity_level,
            "dietary_restrictions": v.dietary_restrictions,
            "gym_equipment":v.gym_equipment,
            "weight_goals":v.weight_goals,
            "age": v.age,
            "height": v.height,
            "weight":v.weight
        }
        addData("users",v.email,data)



        memoryUtils.userToken = token
        memoryUtils.user={username,password}
        memoryUtils.registerUser=username
        //const response = await reqRegister(JSON.stringify(v));
        return true
    }catch (e) {
        console.log(e.message)
        message.error(e.message)
        return false
    }


}
