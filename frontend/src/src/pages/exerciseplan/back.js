import React, {Component} from 'react';
import firebase from "firebase";
import {List, Card, Table, Button, message, Tabs, Image, Col, Row, Divider, Progress, Statistic, Tag} from 'antd';
import memoryUtils from "../../utils/memoryUtils";
import fire, {db} from "../../api/commonFirebase";
import plantTest from "../mycollection/image/erro.png";
import {
    ArrowUpOutlined,
    DeploymentUnitOutlined,
    FireTwoTone, HeartTwoTone,
    NodeIndexOutlined,
    WarningOutlined
} from '@ant-design/icons';
import ajax from "../../api/ajax";


const { TabPane } = Tabs;

export default class Back extends Component{
    state = {
        loading:false,
        foodkcala:0,
        listinformation:[],
        datalist:[],
        fat:0,
        cal:0,
        carbs:0,
        protein:0,
    }
    getNewExercisePlans = async () => {
        var docRef = await db.collection("users").doc(memoryUtils.user.username);
        let valuelist = [];
        docRef.get().then(async (doc) => {
            if (doc.exists) {
                let response = await ajax('/workouts/getPlans', doc.data(), 'POST')
                console.log("Workouts Plans", response);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    DeleteCollection =(user)=>{
        var Myuser = memoryUtils.user.username;
        var ref = fire.database().ref("foodcollection/"+user._ID).remove()
        this.queryCollection();
        message.success("Delete success!:"+user.name)
        this.setState({loading:false})
    }

    componentWillMount() {
        this.initColumns()
    }
    async componentDidMount() {

    }

    render() {
        let data = []
        let {datalist,loading} = this.state
        for(let a in datalist)
        {
            data.push(datalist[a])
        }

        return (
            <div>

            </div>
        )
    }
}