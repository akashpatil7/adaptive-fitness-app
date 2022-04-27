import React, {Component} from 'react';
import {Card, Button, Popover, Tooltip, Image, Divider, Tag, Row, message,Alert,Checkbox} from 'antd';
import {  DeleteOutlined } from '@ant-design/icons';
import {EnvironmentTwoTone,FireTwoTone,DeploymentUnitOutlined,WarningOutlined,NodeIndexOutlined,HeartTwoTone} from '@ant-design/icons';
import memoryUtils from "../../utils/memoryUtils";
import fire, {db} from "../../api/commonFirebase";
import ajax from "../../api/ajax";
const { Meta } = Card;
const desc = ['terrible', 'bad', 'aaa', 'good', 'wonderful'];

export default class myCollection extends Component{
    state = {
        value: 3,
        list:[],
    };

    handleChange = value => {
        this.setState({ value });
    };

    componentDidMount() {
        this.state.list.push({
            type:"Back",
            imageurl:"https://firebasestorage.googleapis.com/v0/b/blackbird-545eb.appspot.com/o/workout%2FCrunch.gif?alt=media&token=1fac50fe-43f6-45bc-b970-18001adf3c5c",
            ExerciseName:"Glute Bridge",
            RepRange:"4,10",
            Rest:"1",
            StartingReps:"5",
            StartingSets:"3",
            StartingWeight:"NA",
            WeightIncrement:"NA"
        }
        )
        this.state.list.push({
                type:"Chest",
                imageurl:"https://firebasestorage.googleapis.com/v0/b/blackbird-545eb.appspot.com/o/workout%2FHollow-body%20Holds.gif?alt=media&token=39a08c5b-e2a6-4e38-9db7-dfa942812ebd",
                ExerciseName:"Hollow-body Holds",
                RepRange:"4,10",
                Rest:"1",
                StartingReps:"5",
                StartingSets:"3",
                StartingWeight:"NA",
                WeightIncrement:"NA"
            }
        )
        this.state.list.push({
                type:"Core",
                imageurl:"https://firebasestorage.googleapis.com/v0/b/blackbird-545eb.appspot.com/o/workout%2FKneeling%20Pushups.gif?alt=media&token=c194c180-43f1-422a-8d36-89af967f6989",
                ExerciseName:"Kneeling Pushups",
                RepRange:"4,10",
                Rest:"1",
                StartingReps:"5",
                StartingSets:"3",
                StartingWeight:"NA",
                WeightIncrement:"NA"
            }
        )
        this.state.list.push({
                type:"Legs",
                imageurl:"https://firebasestorage.googleapis.com/v0/b/blackbird-545eb.appspot.com/o/workout%2FLeg%20Extension.gif?alt=media&token=bfed5692-eecb-4eb1-bca7-7a263e80bdc3",
                ExerciseName:"Leg Extension",
                RepRange:"4,10",
                Rest:"1",
                StartingReps:"5",
                StartingSets:"3",
                StartingWeight:"NA",
                WeightIncrement:"NA"
            }
        )
        this.state.list.push({
                type:"Shoulders/Arms",
                imageurl:"https://firebasestorage.googleapis.com/v0/b/blackbird-545eb.appspot.com/o/workout%2FSeated-Curls.gif?alt=media&token=83225dc7-8bd3-4921-9e84-4ffac01eb14d",
                ExerciseName:"Seated-Curls",
                RepRange:"4,10",
                Rest:"1",
                StartingReps:"5",
                StartingSets:"3",
                StartingWeight:"NA",
                WeightIncrement:"NA"
            }
        )
    }

    /**
     * @function：DeleteCollection
     * @parameter： user information
     * @description： Delete the corresponding favorites with the corresponding  ID
     */
    DeleteCollection =(user)=>{
        var Myuser = memoryUtils.user.username;
        var ref = fire.database().ref("foodcollection/"+user._ID).remove()
        this.queryCollection();
        message.success("Delete success!:"+user.name)
        this.setState({loading:false})
    }
    onChange = (v)=>
    {

    }
    render() {
        const { value,list } = this.state;

        const renderCard = (card,index)=>{
            return(

                <Card
                    hoverable
                    style={{ width: 290 }}
                    cover={
                        <Image width={290} height={290} alt="example" src={card.imageurl}   fallback="data:image/png;base64,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"
                        />}
                    className="box">

                    <Meta title={card.ExerciseName} >

                    </Meta>
                    <Divider />
                    <Alert
                        message=""
                        description={card.type}
                        type="info"
                    />

                    <Divider />
                    <Tag color="red" icon={< FireTwoTone  ></FireTwoTone>} color="red">
                        Starting Reps :{card.StartingReps}
                    </Tag>

                    <Divider type="vertical" />
                    <Tag icon={ <WarningOutlined />} color="orange">
                        Starting Sets:{card.StartingSets}
                    </Tag>


                    <Divider type="vertical" />
                    <Tag icon={< DeploymentUnitOutlined  ></DeploymentUnitOutlined>} color="orange">
                        Starting Reps :    {card.StartingReps}
                    </Tag>

                    <Divider type="vertical" />
                    <Tag icon={< DeploymentUnitOutlined  ></DeploymentUnitOutlined>} color="orange">
                        Starting Weight :    {card.StartingWeight}
                    </Tag>
                    <Divider type="vertical" />
                    <Tag icon={<NodeIndexOutlined />} color="orange">
                        WeightIncrement :{card.WeightIncrement}
                    </Tag>
                    <Divider type="vertical" />
                    <Tag icon={<HeartTwoTone twoToneColor="#eb2f96"/>} color="green">
                        Rest :{card.Rest}
                    </Tag>

                    <Divider/>
                    <Checkbox onChange={this.onChange}>Finished</Checkbox>

                </Card>
            )
        }
        return (
            //Use a map to traverse the card data and display it on the page
            <Row className="grid">
                {list.map(renderCard)}
            </Row>

        )
    }
}