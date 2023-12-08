/** @odoo-module **/

import {Component, xml, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";

const {Input, InputNumber, Row, Col, __info__} = sdDesign;

export class TestSdDesignClient extends Component {
    static components = {Input, InputNumber, Row, Col};

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
    </Row>
</div>
`;
    state = useState({
        version: __info__.version
    });
}

registry.category("actions").add("test_sd_design_demo_client", TestSdDesignClient);
