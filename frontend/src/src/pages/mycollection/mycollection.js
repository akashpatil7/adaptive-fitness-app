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
        back_tag:false,
        chest_tag:false,
        core_tag:false,
        legs_tag:false,
        shoulders_tag:false
    };

    handleChange = value => {
        this.setState({ value });
    };
    makeRecommendations =async () => {
        let send_data = {
                "email": memoryUtils.user.username,
                "core": this.state.core_tag,
                "chest": this.state.chest_tag,
                "legs": this.state.legs_tag,
                "shoulders": this.state.shoulders_tag,
                "back": this.state.back_tag
            }


        await this.setState({chest_tag: false})

        await this.setState({core_tag: false})

        await this.setState({legs_tag: false})

        await this.setState({back_tag: false})

        await this.setState({shoulders_tag: false})

        console.log("makeRecommendations send data: ",send_data);
        let response = await ajax('/workouts/makeRecommendations', send_data, 'POST')
        console.log("makeRecommendations response: ",response.data);
        let data = response.data
        await this.setState({list: []})
        console.log(data)
        for(let key in data)
        {
            console.log("key:",key)
            console.log("key:",data[key])
            var docRef = await db.collection("exercise_images").doc(data[key].Name);
            await docRef.get().then(async (doc) => {
                if (doc.exists) {
                    this.state.list.push({
                        Id: data[key].Id,
                        type: key,
                        imageurl: doc.data().url,
                        ExerciseName: data[key].Name,
                        StartingReps:  data[key].Reps,
                        StartingSets:  data[key].Sets,
                        StartingWeight:  data[key].Weight,
                        WeightIncrement: data[key].WeightIncrement
                    })
                }
            })

        }
    }



    getNewExercisePlans = async () => {
        var docRef = await db.collection("users").doc(memoryUtils.user.username);
        let valuelist = [];
        docRef.get().then(async (doc) => {
            if (doc.exists) {
                console.log("Workouts Plans send");
                let response = await ajax('/workouts/getPlans', doc.data(), 'POST')
                let data = response.data
                console.log(data)
                for(let key in data)
                {
                    console.log("key:",key)
                    console.log("key:",data[key])
                    var docRef = await db.collection("exercise_images").doc(data[key].Name);
                    await docRef.get().then(async (doc) => {
                        if (doc.exists) {
                            this.state.list.push({
                                Id: data[key].Id,
                                type: key,
                                imageurl: doc.data().url,
                                ExerciseName: data[key].Name,
                                StartingReps:  data[key].Reps,
                                StartingSets:  data[key].Sets,
                                StartingWeight:  data[key].Weight,
                            })
                        }
                    })

                }




            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    componentDidMount() {
        this.getNewExercisePlans()

    }



    onChange = async (v) => {
        switch (v.type) {
            case 'chest':
                await this.setState({chest_tag: !this.state.chest_tag})
                break;
            case 'core':
                await this.setState({core_tag: !this.state.core_tag})
                break;
            case 'legs':
                await this.setState({legs_tag: !this.state.legs_tag})
                break;
            case 'back':
                await this.setState({back_tag: !this.state.back_tag})
                break;
            case 'shoulders':
                await this.setState({shoulders_tag: !this.state.shoulders_tag})
                break;
        }
        console.log("current tag:", this.state)
    }
    render() {
        const { value,list } = this.state;

        const renderCard = (card,index)=>{
            return(

                <Card
                    hoverable
                    style={{ width: 310 }}
                    cover={
                        <Image width={310} height={310} alt="example" src={card.imageurl}   fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />}
                    className="box">

                    <Meta title={card.ExerciseName + "-" +card.Id} >

                    </Meta>
                    <Divider />
                    <Alert
                        message=""
                        description={card.type}
                        type="info"
                    />

                    <Divider />
                    <Tag color="red" icon={< FireTwoTone  ></FireTwoTone>} color="red">
                        Reps :{card.StartingReps}
                    </Tag>

                    <Divider type="vertical" />
                    <Tag icon={ <WarningOutlined />} color="orange">
                        Sets:{card.StartingSets}
                    </Tag>




                    <Divider type="vertical" />
                    <Tag icon={< DeploymentUnitOutlined  ></DeploymentUnitOutlined>} color="orange">
                       Weight :    {card.StartingWeight}
                    </Tag>


                    <Divider/>
                    <Checkbox onChange={()=>this.onChange(card)}>Finished</Checkbox>

                </Card>
            )
        }
        return (
            //Use a map to traverse the card data and display it on the page
            <div>
                <div  style={{display: 'table-cell' }}>
                    <Row className="grid">
                        {list.map(renderCard)}
                    </Row>
                    <Button onClick={this.makeRecommendations}  style={{float: "right" }} type="primary" >
                        Update
                    </Button>
                </div>

            </div>


        )
    }
}