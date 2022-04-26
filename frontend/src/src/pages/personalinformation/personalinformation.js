import React, {Component} from 'react';
import {Badge, Descriptions, Divider , message,Modal,Button} from "antd";
import memoryUtils from "../../utils/memoryUtils";
import DrawerForm from './informationdrawer'
import fire, {db} from "../../api/commonFirebase";

import { ExclamationCircleOutlined } from '@ant-design/icons';
const ReachableContext = React.createContext();
const UnreachableContext = React.createContext();
const { confirm } = Modal;
export default class PersonalInformation extends Component{
    state = {
        list: {},
    };
    componentDidMount() {
        var docRef = db.collection("users").doc(memoryUtils.user.username);
        docRef.get().then(async (doc) => {
            if (doc.exists) {
                this.setState({list: doc.data()}, () => {

                    console.log(this.state.list);
                })
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
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
                    <Descriptions.Item label="Height(cm)">{this.state.list.height}</Descriptions.Item>

                    <Descriptions.Item label="Weight(kg)">{this.state.list.weight}</Descriptions.Item>
                    <Descriptions.Item label="Activity Level Ratio">{this.state.list.activity_level_ratio}</Descriptions.Item>
                    <Descriptions.Item label="Age">{this.state.list.age}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{this.state.list.gender}</Descriptions.Item>

                    <Descriptions.Item label="Experience" span={2}>
                        {this.state.list.experience}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                        <Badge status="processing" text="online" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Gym Equipment">{this.state.list.gym_equipment}</Descriptions.Item>
                    <Descriptions.Item label="Weight Goals">{this.state.list.weight_goals}</Descriptions.Item>

                    <Descriptions.Item label="Dietary Restrictions">
                        {this.state.list.dietary_restrictions}
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