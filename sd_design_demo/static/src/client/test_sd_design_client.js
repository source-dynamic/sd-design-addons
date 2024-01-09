/** @odoo-module **/

import {Component, useState, xml} from "@odoo/owl";
import {registry} from "@web/core/registry";

const {Input, InputNumber, Row, Col, List, Checkbox, Select, Switch, __info__} = sdDesign;

export class TestSdDesignClient extends Component {
    static components = {Input, InputNumber, Row, Col, List, Select, Checkbox, CheckboxGroup: Checkbox.Group, Switch};

    static template = xml`
<div style="padding: 20px">
    <h1>SD Design</h1>
    <p>Version: <t t-esc="state.version"/></p>
    <Row gutter="[0, 20]">
        <Col span="4" offset="20" pull="20">
            <h3>input输入框</h3>
            <Input placeholder="'Input'" />
        </Col>
        
        <Col span="4" offset="20" pull="20">
            <h3>数字输入框</h3>
            <InputNumber placeholder="'InputNumber'"/>
        </Col>
        
        <Col span="8" offset="16" pull="16">
            <h3>通用列表</h3>
            <List dataSource="state.list" virtual="true" height="200" itemHeight="30">
                <t t-set-slot="item" t-slot-scope="scope">
                    <t t-esc="scope.data.name"/>
                </t>
            </List>
        </Col>
        
        <Col span="8" offset="16" pull="16">
            <h3>下拉选择器</h3>
            <Select options="[]"/>
        </Col>
        
        <Col span="8" offset="16" pull="16">
            <h3>复选框</h3>
            <CheckboxGroup value="state.checkboxGroupValue" onChange="(values) => this.state.checkboxGroupValue = values">
                <span>当前选中：<t t-esc="checkedValue"/></span>
                <div>-------</div>
                <Checkbox name="'选项1'">选项1</Checkbox>
                <div>-------</div>
                <Checkbox name="'选项2'">选项2</Checkbox>
                <div>-------</div>
                <Checkbox name="'选项3'">选项3</Checkbox>
            </CheckboxGroup>
        </Col>
        
        <Col span="8" offset="16" pull="16">
            <h3>开关</h3>
            <Switch>
                <t t-set-slot="checked">开启</t>
                <t t-set-slot="unchecked">关闭</t>
            </Switch>
            <span style="margin-left: 20px"></span>
            <Switch loading="true"/>
        </Col>
    </Row>
</div>
`;
    state = useState({
        version: __info__.version,
        list: Array.from({length: 1000}, (_, i) => ({
            id: i,
            name: `Item ${i}`
        })),
        checkboxGroupValue: []
    });

    get checkedValue() {
        return this.state.checkboxGroupValue.join(', ');
    }
}

registry.category("actions").add("test_sd_design_demo_client", TestSdDesignClient);
