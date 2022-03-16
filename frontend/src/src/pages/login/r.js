import fire from "../../api/commonFirebase";
import "antd/dist/antd.css";
import {Form, Input, Button, message, InputNumber,Radio} from "antd";
import React,{Component} from "react";
class  RegistrationForm extends Component{
    state = {
        weight_training_level_ratio:0,
        gender:'male',
        activity_level_ratio:0,
    }
     formItemLayout = {
        labelCol: {
            xs: {
                span: 24
            },
            sm: {
                span: 8
            }
        },
        wrapperCol: {
            xs: {
                span: 24
            },
            sm: {
                span: 16
            }
        }
    };
     tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 16,
                offset: 8
            }
        }
    };

    /**
     * @function：onFinish
     * @parameter：Various information about registered users
     * @description： Calculate BMI, BMR and so on and store them in the database
     */
     onFinish = (v) => {
         console.log(v)
         //send create user request
        fire.auth().createUserWithEmailAndPassword(v.email,v.password).then((u)=>{
            var user =v.email.split(".")[0];
            fire.database().ref('userinformation/' + user).set({
                address:'null',
                age: v.age,
                weight:v.weight,
                height:v.height,
                introduction:'null',
                gender:v.gender,
                telephone:'null',
                bmi:v.bmi,
                bmistring:v.bmistring,
                frequency:v.frequency,
                dailycalories:v.dailycalories,
                bmr:v.bmr
            });
            message.success(v.email+" Create success!")
        }).catch((error)=>{
            message.error(error.message);
        });
    };


    render() {

        /**
         * @function：weight_training_level_Change
         * @parameter：Various information about registered users
         * @description： Parameter Change  weight_training_level
         */
        const weight_training_level_Change = (value)=> {
            this.setState({weight_training_level_ratio:value.target.value})
            console.log("weight_training_level_Change:"+this.state.weight_training_level_ratio)
            console.log("Current value:"+value.target.value)

        }

        const activity_level_Change = (value)=> {
            this.setState({activity_level_ratio:value.target.value})
            console.log("activity_level_Change:"+this.state.activity_level_ratio)
            console.log("Current value"+value.target.value)
        }

        const genderChange = (value)=> {
            console.log("genderChange:"+value.target.value)
            this.setState({gender:value})
        }
        return(
            <Form
                {...this.formItemLayout}
                form={this.form}
                name="register"
                onFinish={this.onFinish}

                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!"
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!"
                        },{
                            min: 6,
                            message: "Please enter a length of at least 6 digits"
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password!"
                        },
                        {
                            min: 6,
                            message: "Please enter a length of at least 6 digits"
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    "The two passwords that you entered do not match!"
                                );
                            }
                        })
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="height"
                    label="Height(cm)"
                    rules={[
                        {
                            required: true,
                            message: "Please input your height!"
                        }
                    ]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="weight"
                    label="Weight(kg)"
                    rules={[
                        {
                            required: true,
                            message: "Please input your correct weight!",
                            min:20
                        }
                    ]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="Weight_goal"
                    label="Weight Goal(Kg)"

                    rules={[
                        {
                            required: true,
                            message: "Please input your correct weight Goal!",
                            min:20
                        }
                    ]}>
                    <InputNumber/>
                </Form.Item>


                <Form.Item name={'age'} label="Age" rules={[{ required: true,type: 'number', min: 0, max: 99 }]}>
                    <InputNumber/>
                </Form.Item>


                <Form.Item
                    name="dietary_restrictions"
                    label="Dietary Restrictions"
                    initialValue="None"

                >
                    <input/>
                </Form.Item>


                <Form.Item name={'gender'} label="Gender">
                    <Radio.Group onChange={genderChange} defaultValue={'male'} value={this.state.gender}>
                        <Radio value={'male'}>male</Radio>
                        <Radio value={'female'}>female</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name={'activity_level'} label="Activity Level" rules={[{ required: true,message: "Please input your activity level !"}]}>
                    <Radio.Group onChange={activity_level_Change} >
                        <Radio value={"Sedentary"}>Sedentary</Radio>
                        <Radio value={"Lightly"}>Lightly Active</Radio>
                        <Radio value={"Moderately"}>Moderately Active</Radio>
                        <Radio value={"Very"}>Very Active</Radio>
                    </Radio.Group>
                </Form.Item>


                <Form.Item name={'weight_training_level'} label="Weight Training Level" rules={[{ required: true,message: "Please input your weight training level !"}]}>
                    <Radio.Group onChange={weight_training_level_Change} >
                        <Radio value={"Beginner"}>Beginner (0-1 years)</Radio>
                        <Radio value={"Intermediate"}>Intermediate (2-4 years)</Radio>
                        <Radio value={"Advanced"}>Advanced (4+ years)</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item {...this.tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>

            </Form>
        )
    }
}
export default RegistrationForm;