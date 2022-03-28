import React, {Component} from 'react';
import {Badge, Descriptions, Divider , message,Modal,Button} from "antd";
import memoryUtils from "../../utils/memoryUtils";
import DrawerForm from './informationdrawer'
import fire from "../../api/commonFirebase";

import {Redirect} from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {authenticationSign} from "../../api/firebaseApi";
const ReachableContext = React.createContext();
const UnreachableContext = React.createContext();
const { confirm } = Modal;
export default class PersonalInformation extends Component{
    state = {
        list: {},
    };
    componentDidMount() {
        //this.queryInformation();
    }
    render() {
        /**
         * @function：showDeleteConfirm
         * @parameter：null
         * @description：Delete account operations and delete all data information for this account
         */
        function showDeleteConfirm() {
            confirm(
                {
                title: 'Delete the account',
                icon: <ExclamationCircleOutlined />,
                content: ' Are you sure you want to delete your account? Any information that contains you will disappear!',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    //Login your account again
                    authenticationSign(memoryUtils.user.username,memoryUtils.user.password)


                    console.log("signIn:"+user)
                    //delete account
                    user.delete().then(function() {
                        //If successful
                        var user = memoryUtils.user.username;
                        //delete food collection
                        fire.database().ref("foodcollection").orderByChild("id").equalTo(user).once("value",(data)=> {

                            const value = data.val();
                            for (let id in value) {
                                fire.database().ref("foodcollection/" + id).remove()
                            }
                        });
                        //delete comments data
                        fire.database().ref("comments").orderByChild("ID").equalTo(user).once("value",(data)=> {

                            const value = data.val();
                            for (let id in value) {
                                fire.database().ref("comments/" + id).remove()
                            }
                        });
                        //delete userinformation data
                        fire.database().ref("userinformation/"+memoryUtils.user.username.split('.')[0]).remove()
                        memoryUtils.user = {};
                        message.success("Delete succeed")
                    }).catch(function(error) {
                        // An error happened.
                        message.error(error.toString())
                    });

                    return <Redirect to = '/login/'/>

                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        const user = memoryUtils.user;
        return (

            <div style={{ background: '#ffffff',top: '-16px'  }}>
                <Divider />
                <Descriptions title=" &nbsp;  &nbsp; &nbsp;User Info" bordered>
                    <Descriptions.Item label="UserName">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="Height(cm)">{"height_value"}</Descriptions.Item>

                    <Descriptions.Item label="Weight(kg)">{"weight_value"}</Descriptions.Item>
                    <Descriptions.Item label="Weight Goal(Kg)">{"weight_goal_value"} Kcal</Descriptions.Item>
                    <Descriptions.Item label="Age">{"age_value"}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{"gender_value"}</Descriptions.Item>

                    <Descriptions.Item label="Dietary Restrictions" span={2}>
                        {this.state.list.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                        <Badge status="processing" text="online" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Activity Level">{"activity_level_value"}</Descriptions.Item>
                    <Descriptions.Item label="Weight Training Level">{"weight_training_level"}</Descriptions.Item>

                    <Descriptions.Item label="Extras">
                        {"extras_value"}
                    </Descriptions.Item>
                </Descriptions>
                <DrawerForm/>
                {/*<Button className="site-button-ghost-wrapper"  danger onClick={showDeleteConfirm} type="dashed">*/}
                {/*    Delete the account*/}
                {/*</Button>*/}
            </div>

        )
    }
}