import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './drawer.css';
import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, InputNumber, message, Radio} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import memoryUtils from "../../utils/memoryUtils";
import fire from "../../api/commonFirebase";
//a
const { Option } = Select;

export  default  class DrawerForm extends React.Component {
    state = {
        list: {},
        visible: false,
        activity_level_ratio:"sedentary",
        weight_training_level_ratio: "beginner"
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    componentDidMount() {
        this.queryInformation();
    }
    /**
     * @function：queryInformation
     * @parameter：null
     * @description： Query the matching user information through the user mailbox
     */
    queryInformation ()
    {

        var user = memoryUtils.user.username.split(".")[0];
        //Get user information by Rest API

        this.setState({list: {test:""}})


    };
    render() {

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        /**
         * @function：validateMessages
         * @parameter：null
         * @description： The rules set
         */
        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not a valid email!',
                number: '${label} is not a valid number!',
            },
            number: {
                range: '${label} must be between ${min} and ${max}',
            },
        };

        /**
         * @function：onFinish
         * @parameter：values:The user
         * @description： Determine whether the user has changed the value. If it has not changed, the original data will be written; otherwise, the new data will be written
         */
        const onFinish = values => {
            console.log(values);
            //Determine if the user has changed the value
            var user = memoryUtils.user.username.split(".")[0];
            //var vaddress = (values.address === undefined ? this.state.list.address : values.address)
            //var vfrequency =  (this.state.ratio === undefined ? this.state.list.ratio:this.state.ratio)

            //send data by Rest API

            message.success("modify successfully !")
        };
        const activity_level_change = (value)=> {
            this.setState({activity_level_ratio:value.target.value})
            console.log("activity_level:"+this.state.ratio)
        }
        const weight_training_level_change = (value)=> {
            this.setState({weight_training_level_ratio:value.target.value})
            console.log("weight_training_level:"+this.state.ratio)
        }

        return (


            <>
                <Button type="primary" onClick={this.showDrawer}>
                    <SettingOutlined />Setting
                </Button>
                <Drawer
                    title="Modify personal information "
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                        </div>
                    }
                >
                    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                        <Form.Item name={'Height(cm)'} label="height">
                            <InputNumber  ref="text" defaultValue={0}></InputNumber>
                        </Form.Item>

                        <Form.Item name={'Weight'} label="weight" >
                            <InputNumber defaultValue={0}/>
                        </Form.Item>

                        <Form.Item name={'Weight Goal(Kg)'} label="weight_goal">
                            <Input defaultValue={"default_weight_goal_value"}/>
                        </Form.Item>

                        <Form.Item name={'Dietary Restrictions'} label="dietary_restrictions">
                            <Input defaultValue={"default_dietary_restrictions"}/>
                        </Form.Item>


                        <Form.Item name={'Activity Level'} label="activity_level" rules={[{  required: true,
                            message: "Please input your activity level" }]}>
                            <Radio.Group onChange={activity_level_change}  defaultValue={"sedentary"}>
                                <Radio value={"sedentary"}>Sedentary</Radio>
                                <Radio value={"lightly"}>Lightly Active</Radio>
                                <Radio value={"moderately"}>Moderately Active</Radio>
                                <Radio value={"very"}>Very Active</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name={'Weight Training Level'} label="weight_training_level" rules={[{  required: true,
                            message: "Please input your weight training level" }]}>
                            <Radio.Group onChange={weight_training_level_change} defaultValue={"beginner"} >
                                <Radio value={"beginner"}>Beginner (0-1 years)</Radio>
                                <Radio value={"intermediate"}>Intermediate (2-4 years)</Radio>
                                <Radio value={"advanced"}>Advanced (4+ years)</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            </>
        );
    }
}
