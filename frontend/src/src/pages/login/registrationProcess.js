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
                    mode="multiple"
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

                    <Option value="Chest Fly Machine" label="Chest Fly Machine">
                        <div className="Chest_Fly_Machine">
                            Chest Fly Machine
                        </div>
                    </Option>

                    <Option value="Dumbbells" label="Dumbbells">
                        <div className="Dumbbells">
                            Dumbbells
                        </div>
                    </Option>

                    <Option value="Shoulders Press Machine" label="Shoulders Press Machine">
                        <div className="Shoulders_Press_Machine">
                            Shoulders Press Machine
                        </div>
                    </Option>

                    <Option value="Cable Machine" label="Cable Machine">
                        <div className="Cable_Machine">
                            Cable Machine
                        </div>
                    </Option>

                    <Option value="Bench" label="Bench">
                        <div className="Bench">
                            Bench
                        </div>
                    </Option>

                    <Option value="Leg Press Machine" label="Leg Press Machine">
                        <div className="Leg_Press_Machine">
                            Leg Press Machine
                        </div>
                    </Option>

                    <Option value="Leg Extension Machine" label="Leg Extension Machine">
                        <div className="Leg_Extension_Machine">
                            Leg Extension Machine
                        </div>
                    </Option>

                    <Option value="Kettlebell OR Dumbbells" label="Kettlebell OR Dumbbells">
                        <div className="Kettlebell_OR_Dumbbells">
                            Kettlebell OR Dumbbells
                        </div>
                    </Option>

                    <Option value="Pullup Bar" label="Pullup Bar">
                        <div className="Pullup_Bar">
                            Pullup Bar
                        </div>
                    </Option>

                    <Option value="Dip Bars" label="Dip Bars">
                        <div className="Dip_Bars">
                            Dip Bars
                        </div>
                    </Option>

                    <Option value="Barbell" label="Barbell">
                        <div className="Barbell">
                            Barbell
                        </div>
                    </Option>
                    <Option value="Rack" label="Rack">
                        <div className="Rack">
                            Rack
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


                <Form.Item name={'experience'} label='Experience' initialValue={0}>
                    <Select defaultValue={0} style={{ width: 150 }} onChange={experience}>
                        <Option value={0}>level 1</Option>
                        <Option value={1}>level 2</Option>
                        <Option value={2}>level 3</Option>
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