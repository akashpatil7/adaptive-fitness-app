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

export default class breakfast extends Component{
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

    DeleteCollection =(user)=>{
        var Myuser = memoryUtils.user.username;
        var ref = fire.database().ref("foodcollection/"+user._ID).remove()
        this.queryCollection();
        message.success("Delete success!:"+user.name)
        this.setState({loading:false})
    }
    initColumns = () =>{
        this.columns = [
            {
                title: 'Food name',
                dataIndex: 'name'
            },
            {
                title: 'GRAMS',
                dataIndex: 'grams'
            },
            {
                title: 'image',
                dataIndex: 'imageurl',
                render: (dataIndex) => <Image width={60} height={60}  src={dataIndex}></Image>,
            }


        ];
    }
    componentWillMount() {
        this.initColumns()
    }
    async componentDidMount() {
        var docRef = await db.collection("users").doc(memoryUtils.user.username);
        let valuelist = [];
        docRef.get().then(async (doc) => {
            if (doc.exists) {
                let response = await ajax('/food/getPlans', doc.data(), 'POST')
                if (response.data) {

                    let value = response.data[0]
                    let nutrition = value.nutrition
                    console.log(value)
                    this.setState({cal: nutrition.cal})
                    this.setState({carbs: nutrition.carbs})
                    this.setState({fat: nutrition.fat})
                    this.setState({protein: nutrition.protein})
                    for (var prop in value.ingredients) {
                        let foodname = "";
                        let current_imageurl = "";
                        let grams = ""
                        if (value.ingredients.hasOwnProperty(prop)) {
                            // "prop: " + prop + " value: " + obj[prop]
                            console.log(value.ingredients[prop]);
                            foodname = prop
                            grams = value.ingredients[prop]
                            var docRef = await db.collection("images").doc(prop);
                            await  docRef.get().then( async (doc) => {
                                if (doc.exists) {
                                    let url_value = doc.data()
                                    console.log(url_value.url);
                                    current_imageurl = url_value.url
                                } else {
                                    // doc.data() will be undefined in this case
                                    console.log("No such document!");
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });


                        }
                        valuelist.push({
                            name:foodname,
                            grams:grams,
                            imageurl:current_imageurl
                        })
                    }

                }

            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        this.setState({loading: false})
        this.setState({datalist: valuelist})


    }

    render() {


        let data = []

        let {datalist,loading} = this.state


        for(let a in datalist)
        {
            data.push(datalist[a])
        }
        const BreakfastCardTitle ="Breakfast plan";
        return (
            <div>
                <Card title={BreakfastCardTitle} >
                    <Table
                        bordered = {true}
                        dataSource={data}
                        loading = {loading}
                        columns={this.columns}
                        pagination = {{defaultPageSize:3,showQuickJumper:true}}
                    />
                </Card>
                <Divider />
                <Row gutter={16}>

                    <Col span={8}>
                        <Card   style={{ width: 480,height:150 }} title="All types of intake" bordered={false}>
                            <Tag color="red" icon={< FireTwoTone  ></FireTwoTone>} color="red">
                                Cal:{this.state.cal}
                            </Tag>
                            <Divider type="vertical" />
                            <Tag icon={ <WarningOutlined />} color="orange">
                                Carbs:{this.state.carbs}
                            </Tag>
                            <Divider type="vertical" />

                            <Tag icon={< DeploymentUnitOutlined  ></DeploymentUnitOutlined>} color="orange">
                                Fat:{this.state.fat}
                            </Tag>
                            <Divider type="vertical" />
                            <Tag icon={<NodeIndexOutlined />} color="green">
                                Protein:{this.state.protein}
                            </Tag>
                            <Divider type="vertical" />
                           </Card>
                    </Col>
                </Row>

            </div>
        )
    }
}