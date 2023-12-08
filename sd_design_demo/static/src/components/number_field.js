/** @odoo-module **/

import {useComponent, xml, useEffect, useState} from "@odoo/owl";
import {IntegerField} from "@web/views/fields/integer/integer_field";
import {registry} from "@web/core/registry";
import {useBus} from "@web/core/utils/hooks";

const {InputNumber} = sdDesign;

export class NumberField extends IntegerField {
    static components = {InputNumber};

    static template = xml`
<span t-if="props.readonly" t-esc="formattedValue" />   
<t t-else="">
    <InputNumber onChange.bind="onChange" value="state.value"/>
</t>
`

    async onChange(value) {
        const component = this.component;
        this.state.value = value;
        this.pendingUpdate = true;
        await component.props.record.update({[component.props.name]: value});
        this.pendingUpdate = false;
        component.props.record.model.bus.trigger("FIELD_IS_DIRTY", false);
    }

    async commitChanges(urgent) {
        const component = this.component;
        if (!this.state.value) {
            return;
        }

        if ((urgent && this.pendingUpdate)) {
            if ((this.state.value || false) !== (component.props.record.data[component.props.name] || false)) {
                await component.props.record.update({[component.props.name]: this.state.value});
                component.props.record.model.bus.trigger("FIELD_IS_DIRTY", false);
            }
        }
    }

    setup() {
        this.component = useComponent();
        this.pendingUpdate = false;
        this.state = useState({
            value: this.value
        })

        useEffect(() => {
            if (this.value !== this.state.value) {
                this.state.value = this.value;
            }
        });

        const {model} = this.component.props.record;
        useBus(model.bus, "WILL_SAVE_URGENTLY", () => this.commitChanges(true));
        useBus(model.bus, "NEED_LOCAL_CHANGES", (ev) => ev.detail.proms.push(this.commitChanges()));
    }
}

const numberField = {
    component: NumberField,
    displayName: 'NumberField',
    supportedOptions: [
        // 目前仅演示，该处省略
    ],
    supportedTypes: ["integer"],
    isEmpty: (record, fieldName) => !record.data[fieldName],
    extractProps: ({attrs, options}) => ({
        // 目前仅演示，该处省略
    }),
};

registry.category("fields").add("numberField", numberField);