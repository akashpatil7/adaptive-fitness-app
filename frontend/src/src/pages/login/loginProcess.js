import {Form, Input, Drawer, Button, Checkbox, message, Modal, Divider} from 'antd';
import React,{Component} from "react";
import DrawerForm from './registrationDrawer'
import fire from "../../api/commonFirebase";
import { withRouter } from 'react-router-dom';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {authenticationSign, getPlansData} from "../../api/firebaseApi";
import axios from "axios";
import ajax from "../../api/ajax";
class  Demo extends Component{
    state = { visible: false };
     layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 200
            },
            sm: {
                span: 200,
                offset: 50
            }
        }
    };
    tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
     onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    /**
     * @function：onFinishforget
     * @parameter： User account name
     * @description： Forget passwords via the Firebase API
     */
    onFinishforget = (v) => {
        //send email
        fire.auth().sendPasswordResetEmail(v.email).then((u)=>{
            message.success(v.email+" A 'Reset Password Email' has been sent to your email address")


        }).catch((error)=>{
            message.error(error.message);
        });
    };

    /**
     * @function：onFinish
     * @parameter： User account email and password
     * @description： Authenticate through the Firebase API
     */
     onFinish = async (e) => {
         withRouter(Demo)
         //Authentication request
         var boole = await authenticationSign(e.username, e.password)
         if(boole)
         {
             getPlansData('users',e.username)
             this.props.history.replace('/personal');
         }

     };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    //Rule setting and display
    showConfirm = () => {
        Modal.info({
            title: 'Forgot password?',
            okText: 'close',
            destroyOnClose: true,
            content: (
                <div>
                    <Form
                        {...this.formItemLayout}
                        form={this.form}
                        name="register"
                        onFinish={this.onFinishforget}

                        scrollToFirstError
                    >
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: "email",
                                    message: "The input is not a valid E-mail!"
                                },
                                {
                                    required: true,
                                    message: "Please input your E-mail!"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item {...this.tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Send
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
            onOk() {
            },
            onCancel() {
            },
        });
    }
    render(){

        return(
            <Form
                {...this.layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
            >

                <Form.Item
                    label="Email"
                    name="username"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...this.tailLayout} name="remember" valuePropName="checked">

                    <Divider />



                </Form.Item>

                <Form.Item {...this.tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <DrawerForm/>
                    <Button onClick={this.showConfirm} type="dashed">forget password</Button>
                </Form.Item>

            </Form>
        )
    }
}

export default withRouter(Demo);

