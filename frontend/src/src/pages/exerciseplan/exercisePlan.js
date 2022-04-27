import React, {Component} from 'react';
import {Tabs,Progress } from 'antd';
import dinner from "../plan/dinner";
import Back from "./back";


const { TabPane } = Tabs;

export default class exercisePlan extends Component{

    render() {
        return (
            <div className="card-container">
                <Tabs type="card">

                    <TabPane tab="Back" key="1">
                        < Back></Back>
                    </TabPane>

                    <TabPane tab="Chest" key="2">
                        Chest
                    </TabPane>

                    <TabPane tab="Core" key="3">
                        Core
                    </TabPane>

                    <TabPane tab="Legs" key="4">
                        Legs
                    </TabPane>

                    <TabPane tab="Shoulders/Arms" key="5">
                        Shoulders/Arms
                    </TabPane>

                </Tabs>
            </div>
        )
    }
}