/** @odoo-module **/

import {Component, xml, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";

const {Input, InputNumber, Row, Col, List, __info__} = sdDesign;

export class TestSdDesignClient extends Component {
    static components = {Input, InputNumber, Row, Col, List};

    static template = xml`
<div style="padding: 20px">
    <h1>SD Design</h1>
    <p>Version: <t t-esc="state.version"/></p>
    <Row gutter="[0, 20]">
        <Col span="4">
            <Input placeholder="'Input'" />
        </Col>
        <Col span="20"/>

        <Col span="4">
            <InputNumber placeholder="'InputNumber'"/>
        </Col>
        
        <Col span="20"/>
        
        <Col span="4">
            <List dataSource="state.list" virtual="true" height="200" itemHeight="30">
                <t t-set-slot="item" t-slot-scope="scope">
                    <t t-esc="scope.data.name"/>
                </t>
            </List>
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
    });
}

registry.category("actions").add("test_sd_design_demo_client", TestSdDesignClient);
