import "antd/dist/antd.css";
import {Form, Input, Button, message, InputNumber,Radio,Select} from "antd";
import React,{Component} from "react";
import '../../api'
import {register} from "../../api/firebaseApi";
const { Option } = Select;



class  RegistrationForm extends Component{
    state = {
        experience:'1 month',
        gender:'male',
        activity_level_ratio:0,
        dietary_restrictions:'no',
        gym_equipment: ['no'],
        weight_goals:'weight gain',
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
     * @description：
     */
     onFinish = async (v) => {
         console.log(v)
         console.log(JSON.stringify(v))
         await register(v.email, v.password, v)
     };


    render() {
        const dietary_restrictions = (value)=>{
            this.setState({dietary_restrictions:value})
            console.log(`dietary selected ${this.state.dietary_restrictions}`);
        }

        const gym_equipment = (value)=>{
            this.setState({gym_equipment:value})
            console.log(`Gym Equipment ${this.state.gym_equipment}`);
        }

        /**
         * @function：weight_training_level_Change
         * @parameter：Various information about registered users
         * @description： Parameter Change  weight_training_level
         */
        const experience = (value)=> {
            this.setState({experience:value})
            console.log("experience:"+this.state.experience)

        }

        const activity_level_Change = (value)=> {
            this.setState({activity_level_ratio:value.value})
            console.log("activity_level_Change:"+this.state.activity_level_ratio)
        }

        const genderChange = (value)=> {
            console.log("genderChange:"+value.target.value)
            this.setState({gender:value})
        }

        const weight_goals = (value)=> {

            this.setState({weight_goals:value.target.value})

            console.log("Weight Goals:"+this.state.weight_goals)
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
                            message: "Please input your weight!",
                        }
                    ]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item name={'weight_goals'} label="Weight Goals" initialValue={"gain_weight"}>
                    <Radio.Group onChange={weight_goals} defaultValue={'gain_weight'}>
                        <Radio value={'gain_weight'}>Gain Weight</Radio>
                        <Radio value={'lose_weight'}>Lose Weight </Radio>
                        <Radio value={'maintain_weight'}>Maintain Weight</Radio>
                    </Radio.Group>
                </Form.Item>


                <Form.Item name={'age'} label="Age" rules={[{ required: true,type: 'number', min: 0, max: 99 }]}>
                    <InputNumber/>
                </Form.Item>



                <Form.Item name={'gender'} label="Gender" initialValue={"male"}>
                    <Radio.Group onChange={genderChange} defaultValue={'male'}>
                        <Radio value={'male'}>Male</Radio>
                        <Radio value={'female'}>Female</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name={'dietary_restrictions'} label='Dietary Restrictions' initialValue={"no_restriction"}>
                    <Select defaultValue="no_restriction" style={{ width: 150 }} onChange={dietary_restrictions}>
                        <Option value="no_restriction">No Restrictions</Option>
                        <Option value="vegetarian_vegan">Vegetarian</Option>
                        <Option value="gluten_free">Gluten-free</Option>
                    </Select>
                </Form.Item>

            <Form.Item name={'gym_equipment'} label='Gym Equipment' initialValue={"0"}>
                <Select
                    style={{ width: '100%' }}
                    defaultValue="0"
                    onChange={gym_equipment}
                    optionLabelProp="label"
                >

                    <Option value="0" label="No Equipment">
                        <div className="no_equipment">
                            No equipment
                        </div>
                    </Option>

                    <Option value="dumbbells" label="Dumbbells">
                        <div className="dumbbells">
                            Dumbbells
                        </div>
                    </Option>

                    <Option value="yoga mat" label="Yoga Mat">
                        <div className="yoga_mat">
                            Yoga Mat
                        </div>
                    </Option>

                    <Option value="resistance bands" label="Resistance Bands">
                        <div className="resistance_bands">
                            Resistance Bands
                        </div>
                    </Option>

                    <Option value="pull-up bar" label="Pull-up Bar">
                        <div className="pull_up_bar">
                            Pull-up Bar
                        </div>
                    </Option>

                    <Option value="machines" label="Machines">
                        <div className="machines">
                            Machines
                        </div>
                    </Option>
                </Select>
            </Form.Item>




                <Form.Item name={'activity_level'} label='Activity Level' initialValue={'sedentary'}>
                    <Select defaultValue={"sedentary"} style={{ width: 150 }} onChange={activity_level_Change}>
                        <Option value={"sedentary"}>Sedentary</Option>
                        <Option value={"lightly"}>Lightly active</Option>
                        <Option value={"moderate"}>moderate active</Option>
                        <Option value={"active"}>Very active</Option>
                        <Option value={"athlete"}>Athlete</Option>
                    </Select>
                </Form.Item>


                <Form.Item name={'experience'} label='Experience' initialValue={'1 month'}>
                    <Select defaultValue={"1 month"} style={{ width: 150 }} onChange={experience}>
                        <Option value={"1 month"}>1 month</Option>
                        <Option value={"6 months"}>6 months</Option>
                        <Option value={"1 year"}>1 year</Option>
                        <Option value={"2 year"}>2 years</Option>
                    </Select>
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