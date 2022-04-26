import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './drawer.css';
import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, InputNumber, message, Radio} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import memoryUtils from "../../utils/memoryUtils";
import fire, {db} from "../../api/commonFirebase";
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

    async componentDidMount() {
        var docRef = await db.collection("users").doc(memoryUtils.user.username);
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
            
            var washingtonRef = db.collection("users").doc(memoryUtils.user.username);
            //Set the "capital" field of the city 'DC'
            return washingtonRef.update(values)
                .then(() => {
                    message.success("successfully updated!")
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        };

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
                        <Form.Item
                            name="email"
                            label="E-mail"
                            initialValue={this.state.list.email}
                        >
                            <Input disabled={true}  defaultValue={this.state.list.email}/>
                        </Form.Item>

                        <Form.Item
                            name="height"
                            label="Height(cm)"
                            initialValue={this.state.list.height}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your height!"
                                }
                            ]}
                        >
                            <InputNumber  defaultValue={this.state.list.height}/>
                        </Form.Item>

                        <Form.Item
                            name="weight"
                            label="Weight(kg)"
                            initialValue={ this.state.list.weight}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your weight!",
                                }
                            ]}
                        >
                            <InputNumber defaultValue={this.state.list.weight}/>
                        </Form.Item>

                        <Form.Item name={'weight_goals'} label="Weight Goals" initialValue={this.state.list.weight_goals}>
                            <Radio.Group defaultValue={this.state.list.weight_goals}>
                                <Radio value={'gain_weight'}>Gain Weight</Radio>
                                <Radio value={'lose_weight'}>Lose Weight </Radio>
                                <Radio value={'maintain_weight'}>Maintain Weight</Radio>
                            </Radio.Group>
                        </Form.Item>


                        <Form.Item name={'age'} label="Age" rules={[{ required: true,type: 'number', min: 0, max: 99 }]} initialValue={this.state.list.age}>
                            <InputNumber defaultValue={this.state.list.age}/>
                        </Form.Item>



                        <Form.Item name={'gender'} label="Gender" initialValue={this.state.list.gender}>
                            <Radio.Group  defaultValue={this.state.list.gender} disabled={true}>
                                <Radio value={'male'}>Male</Radio>
                                <Radio value={'female'}>Female</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name={'dietary_restrictions'} label='Dietary Restrictions' initialValue={this.state.list.dietary_restrictions}>
                            <Select defaultValue={this.state.list.dietary_restrictions} style={{ width: 150 }} >
                                <Option value="no_restriction">No Restrictions</Option>
                                <Option value="vegetarian_vegan">Vegetarian</Option>
                                <Option value="gluten_free">Gluten-free</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name={'gym_equipment'} label='Gym Equipment' initialValue={this.state.list.gym_equipment}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="select one country"
                                defaultValue={this.state.list.dietary_restrictions}
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




                        <Form.Item name={'activity_level'} label='Activity Level' initialValue={this.state.list.activity_level_ratio}>
                            <Select style={{ width: 150 }}  defaultValue={this.state.activity_level_ratio}>
                                <Option value={"sedentary"}>Sedentary</Option>
                                <Option value={"lightly"}>Lightly active</Option>
                                <Option value={"moderate"}>moderate active</Option>
                                <Option value={"active"}>Very active</Option>
                                <Option value={"athlete"}>Athlete</Option>
                            </Select>
                        </Form.Item>


                        <Form.Item name={'experience'} label='Experience' initialValue={this.state.list.experience}>
                            <Select defaultValue={this.state.list.experience} style={{ width: 150 }} >
                                <Option value={"1 month"}>1 month</Option>
                                <Option value={"6 months"}>6 months</Option>
                                <Option value={"1 year"}>1 year</Option>
                                <Option value={"2 year"}>2 years</Option>
                            </Select>
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
