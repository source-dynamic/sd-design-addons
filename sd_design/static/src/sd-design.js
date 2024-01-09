(function (exports, owl) {
    'use strict';

    const responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const responsiveMap = {
        xs: '(max-width: 575px)',
        sm: '(min-width: 576px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 992px)',
        xl: '(min-width: 1200px)',
        xxl: '(min-width: 1600px)'
    };
    const subscribers = new Map();
    let subUid = -1;
    let screens = {};
    const responsiveObserve = {
        matchHandlers: {},
        dispatch(pointMap) {
            screens = pointMap;
            subscribers.forEach(func => func(screens));
            return subscribers.size >= 1;
        },
        subscribe(func) {
            if (!subscribers.size) {
                this.register();
            }
            subUid += 1;
            subscribers.set(subUid, func);
            func(screens);
            return subUid;
        },
        unsubscribe(token) {
            subscribers.delete(token);
            if (!subscribers.size) {
                this.unregister();
            }
        },
        unregister() {
            Object.keys(responsiveMap).forEach((screen) => {
                const matchMediaQuery = responsiveMap[screen];
                const handler = this.matchHandlers[matchMediaQuery];
                handler?.mql.removeListener(handler?.listener);
            });
            subscribers.clear();
        },
        register() {
            Object.keys(responsiveMap).forEach((screen) => {
                const matchMediaQuery = responsiveMap[screen];
                const listener = ({ matches }) => {
                    this.dispatch({
                        ...screens,
                        [screen]: matches
                    });
                };
                const mql = window.matchMedia(matchMediaQuery);
                mql.addListener(listener);
                this.matchHandlers[matchMediaQuery] = {
                    mql,
                    listener
                };
                listener(mql);
            });
        }
    };

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var classnames = {exports: {}};

    /*!
    	Copyright (c) 2018 Jed Watson.
    	Licensed under the MIT License (MIT), see
    	http://jedwatson.github.io/classnames
    */

    (function (module) {
    	/* global define */

    	(function () {

    		var hasOwn = {}.hasOwnProperty;

    		function classNames() {
    			var classes = [];

    			for (var i = 0; i < arguments.length; i++) {
    				var arg = arguments[i];
    				if (!arg) continue;

    				var argType = typeof arg;

    				if (argType === 'string' || argType === 'number') {
    					classes.push(arg);
    				} else if (Array.isArray(arg)) {
    					if (arg.length) {
    						var inner = classNames.apply(null, arg);
    						if (inner) {
    							classes.push(inner);
    						}
    					}
    				} else if (argType === 'object') {
    					if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
    						classes.push(arg.toString());
    						continue;
    					}

    					for (var key in arg) {
    						if (hasOwn.call(arg, key) && arg[key]) {
    							classes.push(key);
    						}
    					}
    				}
    			}

    			return classes.join(' ');
    		}

    		if (module.exports) {
    			classNames.default = classNames;
    			module.exports = classNames;
    		} else {
    			window.classNames = classNames;
    		}
    	}()); 
    } (classnames));

    var classnamesExports = classnames.exports;
    var classNames = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

    /**
     * 将style键值对转换为style字符串
     * @param styleObj
     */
    function stylesToString(styleObj) {
        let styleStr = '';
        for (const style in styleObj) {
            if (styleObj[style] == undefined || styleObj[style] === '')
                continue;
            styleStr += `${style}: ${styleObj[style]};`;
        }
        return styleStr;
    }
    /**
     * 根据类名返回带前缀的类名
     * @param suffixCls 类名
     * @param customizePrefixCls  自定义类前缀名，此值会覆盖默认前缀
     */
    const getPrefixCls = (suffixCls, customizePrefixCls) => {
        if (customizePrefixCls) {
            return `${customizePrefixCls}-${suffixCls}`;
        }
        return `sd-${suffixCls}`;
    };
    /**
     * 给svg字符串添加属性
     * @param svgString svg字符串
     * @param attributes 属性键值对
     */
    const addSvgAttributes = (svgString, attributes = {}) => {
        if (!attributes.fill) {
            attributes['fill'] = 'currentcolor';
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = doc.documentElement;
        Object.entries(attributes).forEach(([name, value]) => {
            svgElement.setAttribute(name, value);
        });
        return new XMLSerializer().serializeToString(doc);
    };
    /**
     * 获取svg渲染到节点的字符串
     * @param svgString
     * @param attributes
     * @param className
     */
    const getSDSVG = (svgString, attributes = {}, className) => {
        return `<span class="${classNames(getPrefixCls('icon'), className)}">${addSvgAttributes(svgString, attributes)}</span>`;
    };
    /**
     * 从指定对象中删除指定键，并返回结果
     * @param obj 指定的对象
     * @param keysToOmit 要删除的键
     */
    const omit = (obj, keysToOmit) => {
        const result = { ...obj };
        for (const key of keysToOmit) {
            if (key in result) {
                delete result[key];
            }
        }
        return result;
    };

    const baseProps = {
        slots: { type: Object, optional: true },
        ref: { type: Object, optional: true }
    };

    const parseFlex = (flex) => {
        if (typeof flex === 'number') {
            return `${flex} ${flex} auto`;
        }
        if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
            return `0 0 ${flex}`;
        }
        return flex;
    };
    class Col extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            span: { type: [Number, String], optional: true },
            order: { type: [Number, String], optional: true },
            offset: { type: [Number, String], optional: true },
            push: { type: [Number, String], optional: true },
            pull: { type: [Number, String], optional: true },
            xs: { type: [Number, Object], optional: true },
            sm: { type: [Number, Object], optional: true },
            md: { type: [Number, Object], optional: true },
            lg: { type: [Number, Object], optional: true },
            xl: { type: [Number, Object], optional: true },
            xxl: { type: [Number, Object], optional: true },
            flex: { type: [Number, String], optional: true },
            ...baseProps
        };
        static template = owl.xml `
    <div t-att-class="getClasses()" t-att-style="getStyle()">
        <t t-slot="default"/>
    </div>
    `;
        getStyle() {
            let colStyle = {};
            if (this.props.flex) {
                colStyle.flex = parseFlex(this.props.flex);
            }
            return stylesToString(colStyle) || undefined;
        }
        getClasses() {
            const { span, order, offset, push, pull } = this.props;
            const prefixCls = getPrefixCls('col');
            let sizeClassObj = {};
            // 组装响应式class类
            responsiveArray.forEach((size) => {
                let sizeProps = {};
                const propSize = this.props[size];
                if (typeof propSize === 'number') {
                    sizeProps.span = propSize;
                }
                else if (typeof propSize === 'object') {
                    sizeProps = propSize || {};
                }
                sizeClassObj = {
                    ...sizeClassObj,
                    [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
                    [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
                    [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
                    [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
                    [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0
                };
            });
            return classNames(prefixCls, this.props.className, {
                [`${prefixCls}-${span}`]: span !== undefined,
                [`${prefixCls}-order-${order}`]: order,
                [`${prefixCls}-offset-${offset}`]: offset,
                [`${prefixCls}-push-${push}`]: push,
                [`${prefixCls}-pull-${pull}`]: pull
            }, sizeClassObj);
        }
    }

    class Row extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            gutter: { type: [Number, Array], optional: true },
            align: { type: String, optional: true },
            justify: { type: String, optional: true },
            wrap: { type: Boolean, optional: true },
            ...baseProps
        };
        static template = owl.xml `
        <div t-att-class="state.className" t-att-style="state.style">
            <t t-slot="default"/>
        </div>
    `;
        state = owl.useState({
            className: undefined,
            style: undefined,
            screens: {
                xs: true,
                sm: true,
                md: true,
                lg: true,
                xl: true,
                xxl: true
            }
        });
        getGutter(screens) {
            const results = [0, 0];
            const { gutter = 0 } = this.props;
            const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
            normalizedGutter.forEach((g, index) => {
                if (typeof g === 'object') {
                    for (let breakpoint of responsiveArray) {
                        if (screens[breakpoint] && g[breakpoint] !== undefined) {
                            results[index] = g[breakpoint];
                            break;
                        }
                    }
                }
                else {
                    results[index] = g || 0;
                }
            });
            return results;
        }
        getStyle(screens) {
            const gutter = this.getGutter(screens);
            return {
                ...(gutter[0] > 0
                    ? {
                        'column-gap ': `${gutter[0]}px`
                    }
                    : {}),
                ...(gutter[1] > 0
                    ? {
                        'row-gap': `${gutter[1]}px`
                    }
                    : {})
            };
        }
        getClasses() {
            const { justify, align, wrap } = this.props;
            const prefixCls = getPrefixCls('row');
            return classNames(this.props.className, prefixCls, {
                [`${prefixCls}-${justify}`]: justify,
                [`${prefixCls}-${align}`]: align,
                [`${prefixCls}-nowrap`]: wrap === false
            });
        }
        setup() {
            owl.useChildSubEnv({ row: this });
            owl.useEffect(() => {
                const token = responsiveObserve.subscribe((screens) => {
                    const currentGutter = this.props.gutter || 0;
                    if ((!Array.isArray(currentGutter) && typeof currentGutter === 'object') ||
                        (Array.isArray(currentGutter) &&
                            (typeof currentGutter[0] === 'object' || typeof currentGutter[1] === 'object'))) {
                        this.state.screens = screens;
                    }
                    this.state.style = stylesToString(this.getStyle(screens)) || undefined;
                    this.state.className = this.getClasses() || undefined;
                });
                return () => {
                    responsiveObserve.unsubscribe(token);
                };
            }, () => [this.props]);
        }
    }

    function getInputClassName(prefixCls, bordered, size, disabled) {
        return classNames(prefixCls, {
            [`${prefixCls}-sm`]: size === 'small',
            [`${prefixCls}-lg`]: size === 'large',
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-borderless`]: !bordered
        });
    }

    var _closeSVG$1 = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M514.133 85.333C275.2 85.333 87.467 273.067 87.467 512c0 234.667 189.866 426.667 424.533 426.667s426.667-192 426.667-426.667c0-236.8-192-426.667-424.534-426.667zm162.134 558.934c8.533 8.533 8.533 21.333 0 29.866-4.267 4.267-10.667 6.4-14.934 6.4-6.4 0-10.666-2.133-14.933-6.4L512 539.733l-136.533 134.4c-4.267 4.267-10.667 6.4-14.934 6.4-6.4 0-10.666-2.133-14.933-6.4-8.533-8.533-8.533-21.333 0-29.866l134.4-134.4-134.4-134.4c-8.533-8.534-8.533-21.334 0-29.867 8.533-8.533 21.333-8.533 29.867 0l134.4 134.4 134.4-134.4c8.533-8.533 21.333-8.533 29.866 0 8.534 8.533 8.534 21.333 0 29.867l-134.4 134.4 136.534 134.4z\"/></svg>";

    const closeFillSVG = getSDSVG(_closeSVG$1, {
        width: '1em',
        height: '1em'
    });
    const showCountSpanClass = getPrefixCls('input-show-count-suffix');
    class ClearableLabeledWrapper extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            inputType: { type: String, optional: true },
            direction: { type: String, optional: true },
            value: { type: [String, Number], optional: true },
            allowClear: { type: Boolean, optional: true },
            disabled: { type: Boolean, optional: true },
            focused: { type: Boolean, optional: true },
            readOnly: { type: Boolean, optional: true },
            bordered: { type: Boolean, optional: true },
            handleReset: { type: Function, optional: true },
            count: { type: String, optional: true },
            size: { type: String, optional: true },
            ...baseProps
        };
        /**
         * 渲染清除按钮的模版
         */
        static clearTemplate = `
        <t t-set="clearIconClass" t-value="renderClearIconClass()"/>
        <span
          role="button"
          aria-label="close-circle"
          tabIndex="-1"
          t-on-click.stop="props.handleReset"
          t-att-class="clearIconClass"
        >
         ${closeFillSVG}
        </span> 
    `;
        /**
         * 渲染带有前缀或者后缀的input的模版
         */
        static innerTemplate = `
        <t t-if="!hasPrefixSuffix()">
            <t t-slot="default"/>
        </t>
        <t t-else="">
            <t t-set="labeledIconClass" t-value="renderLabeledIconClass()"/>
                        
            <span t-att-class="labeledIconClass.affixWrapperCls">
                <!--  prefix插槽  -->
                <t t-if="props.slots.prefix">
                    <span t-att-class="labeledIconClass.prefixClass">
                        <t t-slot="prefix"/>
                    </span>
                </t>
                
                <t t-slot="default" />
                
                <!--  suffix插槽  -->
                <t t-if="props.slots.suffix || props.allowClear || props.count">
                    <span t-att-class="labeledIconClass.suffixClass">
                        <t t-if="props.allowClear">
                            ${ClearableLabeledWrapper.clearTemplate}
                        </t>
                        <t t-if="props.count">
                            <span class="${showCountSpanClass}"><t t-esc="props.count"/></span>
                        </t>
                        <t t-slot="suffix"/>
                    </span>
                </t>
            </span>
        </t>
    `;
        static template = owl.xml `
        <t>
            <t t-if="props.inputType === 'input'">
                <t t-if="!hasAddon()">
                    ${ClearableLabeledWrapper.innerTemplate}
                </t>
                
                <t t-else="">
                    <t t-set="inputWithLabelClass" t-value="renderInputWithLabelClass()"/>
                
                    <span t-att-class="inputWithLabelClass.mergedGroupClassName">
                        <span t-att-class="inputWithLabelClass.mergedWrapperClassName">
                            <!--  addonBefore插槽  -->
                            <t t-if="props.slots.addonBefore">
                                <span t-att-class="inputWithLabelClass.addonClassName">
                                    <t t-slot="addonBefore"/>
                                </span>
                            </t>
                            
                            ${ClearableLabeledWrapper.innerTemplate}
                            
                            <!--  addonAfter插槽  -->
                            <t t-if="props.slots.addonAfter">
                                <span t-att-class="inputWithLabelClass.addonClassName">
                                    <t t-slot="addonAfter"/>
                                </span>
                            </t>
                        </span>
                    </span>
                </t>
            </t>
            <t t-else="">
                <t t-if="!hasTextSuffix()">
                    <t t-slot="default"/>
                </t>
                <t t-else="">
                    <t t-set="textAreaIconClass" t-value="renderTextAreaWithClearIconClass()"/>
                    <span t-att-class="textAreaIconClass.affixWrapperCls">
                        <t t-slot="default"/>
                        
                        <t t-set="labeledIconClass" t-value="renderLabeledIconClass()"/>
                        <span t-att-class="labeledIconClass.suffixClass">
                            <t t-if="props.allowClear">
                                ${ClearableLabeledWrapper.clearTemplate}
                            </t>
                            <t t-if="props.count">
                                <span class="${showCountSpanClass}"><t t-esc="props.count"/></span>
                            </t>
                        </span>
                    </span>
                </t>
            </t>
        </t>
    `;
        static defaultProps = {
            inputType: 'input',
            bordered: true
        };
        state = owl.useState({});
        hasTextSuffix() {
            return !!this.props.allowClear || !!this.props.count;
        }
        /**
         * 判断是否有前置、后置部分
         */
        hasAddon() {
            const { slots } = this.props;
            return !!(slots?.addonBefore || slots?.addonAfter);
        }
        /**
         * 判断是否有前缀、后缀
         */
        hasPrefixSuffix() {
            const { slots } = this.props;
            return !!(slots?.prefix || slots?.suffix || this.props.allowClear || !!this.props.count);
        }
        /**
         * 清除图标的class
         */
        renderClearIconClass() {
            const { value, allowClear, disabled, readOnly, slots } = this.props;
            if (!allowClear) {
                return;
            }
            const needClear = !disabled && !readOnly && value;
            const prefixCls = getPrefixCls('input');
            const className = `${prefixCls}-clear-icon`;
            return classNames({
                [`${className}-hidden`]: !needClear,
                [`${className}-has-suffix`]: !!slots?.suffix
            }, className);
        }
        /**
         * innerTemplate主区域部分的class
         */
        renderLabeledIconClass() {
            const { focused, value, size, disabled, allowClear, direction, readOnly, bordered, slots } = this.props;
            const prefixCls = getPrefixCls('input');
            const suffixClass = `${prefixCls}-suffix`;
            const prefixClass = `${prefixCls}-prefix`;
            const affixWrapperCls = classNames(`${prefixCls}-affix-wrapper`, {
                [`${prefixCls}-affix-wrapper-focused`]: focused,
                [`${prefixCls}-affix-wrapper-disabled`]: disabled,
                [`${prefixCls}-affix-wrapper-sm`]: size === 'small',
                [`${prefixCls}-affix-wrapper-lg`]: size === 'large',
                [`${prefixCls}-affix-wrapper-input-with-clear-btn`]: allowClear && value,
                [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
                [`${prefixCls}-affix-wrapper-readonly`]: readOnly,
                [`${prefixCls}-affix-wrapper-borderless`]: !bordered
            });
            const classes = getInputClassName(prefixCls, bordered, size, disabled);
            return { affixWrapperCls, prefixClass, suffixClass, classes };
        }
        /**
         * 外部区域的class
         */
        renderInputWithLabelClass() {
            const { size, className, direction } = this.props;
            const prefixCls = getPrefixCls('input');
            const wrapperClassName = `${prefixCls}-group`;
            const addonClassName = `${wrapperClassName}-addon`;
            const mergedWrapperClassName = classNames(`${prefixCls}-wrapper`, wrapperClassName, {
                [`${wrapperClassName}-rtl`]: direction === 'rtl'
            });
            const mergedGroupClassName = classNames(`${prefixCls}-group-wrapper`, {
                [`${prefixCls}-group-wrapper-sm`]: size === 'small',
                [`${prefixCls}-group-wrapper-lg`]: size === 'large',
                [`${prefixCls}-group-wrapper-rtl`]: direction === 'rtl'
            }, className);
            return { addonClassName, mergedWrapperClassName, mergedGroupClassName };
        }
        /**
         * 文本域带有清除按钮的class
         */
        renderTextAreaWithClearIconClass() {
            const { bordered, direction, disabled, allowClear, value } = this.props;
            const prefixCls = getPrefixCls('input');
            const affixWrapperCls = classNames(`${prefixCls}-affix-wrapper`, `${prefixCls}-affix-wrapper-textarea`, {
                [`${prefixCls}-affix-wrapper-textarea-with-clear-btn`]: allowClear && value,
                [`${prefixCls}-affix-wrapper-disabled`]: disabled,
                [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
                [`${prefixCls}-affix-wrapper-borderless`]: !bordered
            });
            return { affixWrapperCls };
        }
    }

    const formatValue = (value, format) => {
        if (value !== undefined) {
            value = format ? format(value) : value;
        }
        return value;
    };
    /**
     * 管理受控组件的值，比如props中未传入某个值时，由组件内部管理一个state，传入了则交由外部管理
     * @param props 组件的props
     * @param defaultState 默认值，必须包含所有待监控的key，未传入的key将被忽略
     * @param format 格式化函数，用于将props中的值转换为state中的值
     */
    const useControllableState = (props, defaultState, format) => {
        const state = owl.useState(defaultState);
        const updateState = (props) => {
            for (const key in props) {
                if (key in defaultState) {
                    state[key] = formatValue(props[key], format);
                }
            }
        };
        owl.onWillUpdateProps((nextProps) => {
            // props更新时，将被监控的值更新到state中
            updateState(nextProps);
        });
        const setState = (values) => {
            for (const key in values) {
                // 如果props中未传入该值，说明是非受控组件，则交由组件内部管理
                if (!(key in props)) {
                    state[key] = formatValue(values[key], format);
                }
            }
        };
        owl.onMounted(() => {
            updateState(props);
        });
        return {
            state,
            setState
        };
    };

    const useCompRef = () => {
        return owl.useState({
            current: undefined
        });
    };
    const useImperativeHandle = (createHandle, depends) => {
        const comp = owl.useComponent();
        owl.useEffect(() => {
            const props = comp.props;
            if (props.hasOwnProperty('ref') && !!props.ref) {
                props.ref.current = createHandle();
            }
            return () => {
                if (props.hasOwnProperty('ref') && !!props.ref) {
                    props.ref.current = undefined;
                }
            };
        }, depends);
    };

    function triggerFocus(element, option) {
        if (!element) {
            return;
        }
        element.focus(option);
        // Selection content
        const { cursor } = option || {};
        if (cursor) {
            const len = element.value.length;
            switch (cursor) {
                case 'start':
                    element.setSelectionRange(0, 0);
                    break;
                case 'end':
                    element.setSelectionRange(len, len);
                    break;
                default:
                    element.setSelectionRange(0, len);
            }
        }
    }
    class Input extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            size: { type: String, optional: true },
            disabled: { type: Boolean, optional: true },
            type: { type: String, optional: true },
            maxLength: { type: Number, optional: true },
            allowClear: { type: Boolean, optional: true },
            bordered: { type: Boolean, optional: true },
            placeholder: { type: String, optional: true },
            showCount: { type: Boolean, optional: true },
            defaultValue: { type: String, optional: true },
            value: { type: String, optional: true },
            onFocus: { type: Function, optional: true },
            onBlur: { type: Function, optional: true },
            onChange: { type: Function, optional: true },
            onInput: { type: Function, optional: true },
            onPressEnter: { type: Function, optional: true },
            onKeyDown: { type: Function, optional: true },
            readonly: { type: Boolean, optional: true },
            ...baseProps
        };
        static components = { ClearableLabeledWrapper };
        static template = owl.xml `
<ClearableLabeledWrapper className="props.className" inputType="'input'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="controllableState.state.value"
    handleReset.alike="(e) => this.handleReset(e)" slots="props.slots" count="state.count"
>
    <input 
        t-att="state.restProps"
        t-att-disabled="props.disabled"
        t-att-maxlength="props.maxLength"
        t-att-type="props.type"
        t-att-placeholder="props.placeholder"
        t-att-class="getClasses()"
        t-on-focus="onFocus"
        t-on-blur="onBlur"
        t-ref="input"
        t-on-keydown.stop="handleKeyDown"
        t-on-compositionstart="onCompositionstart"
        t-on-compositionend="onCompositionend"
        t-on-input="onInput"
        t-on-change="onChange"
    />
</ClearableLabeledWrapper>
`;
        inputRef = { el: null };
        static defaultProps = {
            type: 'text',
            bordered: true
        };
        // 区分当前是中文输入还是英文输入的flag
        compositionFlag = false;
        state = owl.useState({
            focused: false,
            count: undefined,
            restProps: {}
        });
        controllableState = useControllableState(this.props, {
            value: this.props.defaultValue ?? ''
        });
        getClasses() {
            const { size, disabled, bordered } = this.props;
            const prefixCls = getPrefixCls('input');
            return classNames(getInputClassName(prefixCls, bordered, size, disabled));
        }
        focus() {
            triggerFocus(this.inputRef.el);
            this.state.focused = true;
        }
        onFocus(event) {
            const { onFocus } = this.props;
            this.state.focused = true;
            onFocus?.(event);
        }
        blur() {
            this.inputRef.el.blur();
            this.state.focused = false;
        }
        onBlur(event) {
            const { onBlur } = this.props;
            this.state.focused = false;
            onBlur?.(event);
        }
        handleKeyDown(e) {
            const { onPressEnter, onKeyDown } = this.props;
            if (onPressEnter && e.key.toLowerCase() === 'enter') {
                onPressEnter(e);
            }
            onKeyDown?.(e);
        }
        ;
        onCompositionstart() {
            this.compositionFlag = true;
        }
        ;
        onCompositionend(e) {
            this.compositionFlag = false;
            this.onInput(e);
        }
        ;
        changeValue(value) {
            this.controllableState.setState({ value });
            this.inputRef.el.value = this.controllableState.state.value;
            this.props.onInput?.(value);
            this.props.onChange?.(value);
        }
        ;
        onChange(e) {
            const value = e.target.value;
            this.props.onChange?.(value);
        }
        onInput(e) {
            if (this.compositionFlag) {
                return;
            }
            // 设置input的value
            const value = e.target.value;
            this.changeValue(value);
        }
        ;
        /**
         * 清除输入框
         */
        handleReset() {
            this.changeValue('');
            triggerFocus(this.inputRef.el);
        }
        ;
        getRestProps() {
            return omit(this.props, [
                'className',
                'size',
                'disabled',
                'type',
                'maxLength',
                'allowClear',
                'bordered',
                'placeholder',
                'showCount',
                'defaultValue',
                'value',
                'onFocus',
                'onBlur',
                'onChange',
                'onPressEnter',
                'onKeyDown',
                'slots'
            ]);
        }
        setup() {
            this.inputRef = owl.useRef('input');
            useImperativeHandle(() => ({
                focus: this.focus.bind(this),
                blur: this.blur.bind(this)
            }), () => []);
            owl.useEffect(() => {
                this.state.restProps = this.getRestProps();
            }, () => [this.props]);
            owl.useEffect(() => {
                if (this.inputRef.el) {
                    this.inputRef.el.value = this.controllableState.state.value;
                }
            }, () => [this.inputRef.el]);
            owl.useEffect(() => {
                this.inputRef.el.value = this.controllableState.state.value;
                if (this.props.showCount) {
                    const value = this.controllableState.state.value;
                    this.state.count = this.props.maxLength ? `${value.length}/${this.props.maxLength}` : `${value.length}`;
                }
                else {
                    this.state.count = undefined;
                }
            }, () => [this.props.showCount, this.controllableState.state.value]);
        }
    }

    var _eyeSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3-7.7 16.2-7.7 35.2 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z\"/></svg>";

    var _eyeCloseSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m942.3 486.4-.1-.1-.1-.1c-36.4-76.7-80-138.7-130.7-186L760.7 351c43.7 40.2 81.5 93.7 114.1 160.9C791.5 684.2 673.4 766 512 766c-51.3 0-98.3-8.3-141.2-25.1l-54.7 54.7C374.6 823.8 439.8 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 .1-51.3zm-64-332.2-42.4-42.4c-3.1-3.1-8.2-3.1-11.3 0L707.8 228.5C649.4 200.2 584.2 186 512 186c-192.2 0-335.4 100.5-430.2 300.3v.1c-7.7 16.2-7.7 35.2 0 51.5 36.4 76.7 80 138.7 130.7 186.1L111.8 824.5c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.4c3.1 3.1 8.2 3.1 11.3 0l712.8-712.8c3.1-3 3.1-8.1 0-11.2zM398.9 537.4c-1.9-8.2-2.9-16.7-2.9-25.4 0-61.9 50.1-112 112-112 8.7 0 17.3 1 25.4 2.9L398.9 537.4zm184.5-184.5C560.5 342.1 535 336 508 336c-97.2 0-176 78.8-176 176 0 27 6.1 52.5 16.9 75.4L263.3 673c-43.7-40.2-81.5-93.7-114.1-160.9C232.6 339.8 350.7 258 512 258c51.3 0 98.3 8.3 141.2 25.1l-69.8 69.8zM508 624c-6.4 0-12.7-.5-18.8-1.6l-51.1 51.1c21.4 9.3 45.1 14.4 69.9 14.4 97.2 0 176-78.8 176-176 0-24.8-5.1-48.5-14.4-69.9l-51.1 51.1c1 6.1 1.6 12.4 1.6 18.8C620 573.9 569.9 624 508 624z\"/></svg>";

    const eyeSVG = getSDSVG(_eyeSVG, {
        width: '1em',
        height: '1em'
    });
    const eyeCloseSVG = getSDSVG(_eyeCloseSVG, {
        width: '1em',
        height: '1em'
    });
    const passwordClass = getPrefixCls('input-password');
    class Password extends Input {
        static props = {
            ...Input.props,
            visible: { type: Boolean, optional: true },
            onVisibleChange: { type: Function, optional: true }
        };
        static template = owl.xml `
 <ClearableLabeledWrapper className="props.className" inputType="'input'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="state.value"
    handleReset.alike="(e) => this.handleReset(e)" slots="props.slots">
    <t t-set-slot="suffix">
        <div t-on-click="togglePasswordVisibility" class="${passwordClass}-suffix">
            <t t-if="controllableState.state.visible">
                ${eyeCloseSVG}
            </t>
            <t t-else="">
                ${eyeSVG}
            </t>
        </div>
    </t>
    
    <input 
        t-att="state.restProps"
        t-att-disabled="props.disabled"
        t-att-maxlength="props.maxLength"
        t-att-type="state.type"
        t-att-placeholder="props.placeholder"
        t-att-class="getClasses()"
        t-on-focus.stop="onFocus"
        t-on-blur.stop="onBlur"
        t-ref="input"
        t-on-keydown.stop="handleKeyDown"
        t-model="state.value"
    />
 </ClearableLabeledWrapper>   
    `;
        state = owl.useState({
            focused: false,
            value: '',
            type: 'password',
            restProps: {}
        });
        controllableState = useControllableState(this.props, {
            visible: false,
            value: this.props.defaultValue || ''
        });
        getClasses() {
            return classNames(super.getClasses(), passwordClass);
        }
        togglePasswordVisibility() {
            if (!this.props.disabled) {
                this.controllableState.setState({
                    visible: !this.controllableState.state.visible
                });
                this.props.onVisibleChange?.(!this.controllableState.state.visible);
            }
        }
        getRestProps() {
            return omit(super.getRestProps(), ['visible', 'onVisibleChange']);
        }
        setup() {
            super.setup();
            owl.useEffect(() => {
                this.state.type = this.controllableState.state.visible ? 'text' : 'password';
            }, () => [this.controllableState.state.visible]);
        }
    }

    /**
     * @description: 计算textarea的自适应高度
     * 原理是通过挂载一个独立的textarea，并通过相同的样式渲染和value值，然后获取scrollHeight获取当前高度
     */
    let hideTextareaElement = undefined;
    const HIDDEN_TEXTAREA_STYLE = '\n  min-height:0 !important;\n  max-height:none !important;\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important;\n  pointer-events: none !important;\n';
    const SIZING_STYLE = [
        'letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size',
        'font-variant', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right',
        'border-width', 'box-sizing', 'word-break', 'white-space'
    ];
    function calculateNodeStyling(node) {
        const style = getComputedStyle(node);
        const boxSizing = style.getPropertyValue('box-sizing') || style.getPropertyValue('-moz-box-sizing') || style.getPropertyValue('-webkit-box-sizing');
        const paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));
        const borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));
        const sizingStyle = SIZING_STYLE.map(function (name) {
            return ''.concat(name, ':').concat(style.getPropertyValue(name));
        }).join(';');
        return {
            sizingStyle: sizingStyle,
            paddingSize: paddingSize,
            borderSize: borderSize,
            boxSizing: boxSizing
        };
    }
    const createTextareaElementIfNeed = () => {
        if (!hideTextareaElement) {
            hideTextareaElement = document.createElement('textarea');
            hideTextareaElement.setAttribute('tab-index', '-1');
            hideTextareaElement.setAttribute('aria-hidden', 'true');
            document.body.appendChild(hideTextareaElement);
        }
    };
    const calculateAutoSizeHeight = (uiTextElement) => {
        createTextareaElementIfNeed();
        if (uiTextElement.getAttribute('wrap')) {
            hideTextareaElement.setAttribute('wrap', uiTextElement.getAttribute('wrap'));
        }
        else {
            hideTextareaElement.removeAttribute('wrap');
        }
        const _calculateNodeStyling = calculateNodeStyling(uiTextElement), sizingStyle = _calculateNodeStyling.sizingStyle;
        hideTextareaElement.setAttribute('style', ''.concat(sizingStyle, ';').concat(HIDDEN_TEXTAREA_STYLE));
        hideTextareaElement.value = uiTextElement.value || uiTextElement.placeholder || '';
        const height = hideTextareaElement.scrollHeight;
        hideTextareaElement.value = '';
        return height;
    };

    const textareaClass = getPrefixCls('input-textarea');
    class TextArea extends Input {
        static props = {
            ...Input.props,
            rows: { type: Number, optional: true },
            autoSize: { type: [Boolean, Object], optional: true },
            onResize: { type: Function, optional: true }
        };
        static template = owl.xml `
<ClearableLabeledWrapper className="props.className" inputType="'text'" bordered="props.bordered" size="props.size"
    disabled="props.disabled" focused="state.focused" allowClear="props.allowClear" value="controllableState.state.value"
    handleReset.alike="(e) => this.handleReset(e)" count="state.count"
>
    <textarea
            t-att-style="textState.style"
            t-att="state.restProps"
            t-att-disabled="props.disabled"
            t-att-maxlength="props.maxLength"
            t-att-type="props.type"
            t-att-placeholder="props.placeholder"
            t-att-class="getClasses()"
            t-on-focus.stop="onFocus"
            t-on-blur.stop="onBlur"
            t-ref="input"
            t-on-keydown.stop="handleKeyDown"
            t-on-compositionstart="onCompositionstart"
            t-on-compositionend="onCompositionend"
            t-on-input="onInput"
            t-on-change="onChange"
        />
</ClearableLabeledWrapper>
`;
        textState = owl.useState({
            style: undefined
        });
        getClasses() {
            return classNames(super.getClasses(), textareaClass, {
                [`${textareaClass}-autosize`]: this.props.autoSize
            });
        }
        getRestProps() {
            return omit(super.getRestProps(), ['autoSize', 'onResize']);
        }
        resizeRows() {
            if (!this.props.autoSize) {
                this.textState.style = undefined;
                return;
            }
            let maxRows = 2;
            let minRows = 2;
            const el = this.inputRef.el;
            const style = window.getComputedStyle(el);
            const attrs = ['padding-top', 'padding-bottom'];
            const [paddingTop, paddingBottom] = attrs.map(item => style.getPropertyValue(item));
            const lineHeight = parseFloat(style.getPropertyValue('line-height'));
            const rowsHeight = calculateAutoSizeHeight(el) - parseFloat(paddingTop) - parseFloat(paddingBottom);
            const rows = Math.ceil(rowsHeight / lineHeight);
            if (this.props.autoSize === true) {
                maxRows = Math.max(rows, maxRows); // 随自身内容高度变化
            }
            else if (typeof this.props.autoSize === 'object') {
                minRows = this.props.autoSize.minRows;
                maxRows = this.props.autoSize.maxRows;
            }
            const realRows = Math.min(Math.max(rows, minRows), maxRows);
            this.textState.style = stylesToString({
                'height': `${realRows * lineHeight + parseFloat(paddingTop) + parseFloat(paddingBottom)}px`
            });
        }
        changeValue(value) {
            super.changeValue(value);
            if (this.props.autoSize) {
                this.resizeRows();
            }
            else {
                this.textState.style = undefined;
            }
        }
        setup() {
            super.setup();
            owl.useEffect(() => {
                if (this.inputRef.el) {
                    const element = this.inputRef.el;
                    const resizeObserver = new ResizeObserver((entries) => {
                        const contentBoxSize = entries?.[0].borderBoxSize?.[0];
                        if (contentBoxSize) {
                            this.props.onResize?.({ width: contentBoxSize.inlineSize, height: contentBoxSize.blockSize });
                        }
                    });
                    resizeObserver.observe(element);
                    return () => {
                        resizeObserver.unobserve(element);
                    };
                }
            }, () => [this.inputRef.el]);
            owl.useEffect(() => {
                if (this.props.autoSize && this.inputRef.el) {
                    this.resizeRows();
                }
            }, () => [this.props.autoSize, this.inputRef.el, this.props.size]);
        }
    }

    const InputComponent = Input;
    InputComponent.Password = Password;
    InputComponent.TextArea = TextArea;

    var _upSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M890.5 755.3 537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3c-3.8 5.3-.1 12.7 6.5 12.7h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z\"/></svg>";

    var _downSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z\"/></svg>";

    /*
     *      bignumber.js v9.1.2
     *      A JavaScript library for arbitrary-precision arithmetic.
     *      https://github.com/MikeMcl/bignumber.js
     *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
     *      MIT Licensed.
     *
     *      BigNumber.prototype methods     |  BigNumber methods
     *                                      |
     *      absoluteValue            abs    |  clone
     *      comparedTo                      |  config               set
     *      decimalPlaces            dp     |      DECIMAL_PLACES
     *      dividedBy                div    |      ROUNDING_MODE
     *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
     *      exponentiatedBy          pow    |      RANGE
     *      integerValue                    |      CRYPTO
     *      isEqualTo                eq     |      MODULO_MODE
     *      isFinite                        |      POW_PRECISION
     *      isGreaterThan            gt     |      FORMAT
     *      isGreaterThanOrEqualTo   gte    |      ALPHABET
     *      isInteger                       |  isBigNumber
     *      isLessThan               lt     |  maximum              max
     *      isLessThanOrEqualTo      lte    |  minimum              min
     *      isNaN                           |  random
     *      isNegative                      |  sum
     *      isPositive                      |
     *      isZero                          |
     *      minus                           |
     *      modulo                   mod    |
     *      multipliedBy             times  |
     *      negated                         |
     *      plus                            |
     *      precision                sd     |
     *      shiftedBy                       |
     *      squareRoot               sqrt   |
     *      toExponential                   |
     *      toFixed                         |
     *      toFormat                        |
     *      toFraction                      |
     *      toJSON                          |
     *      toNumber                        |
     *      toPrecision                     |
     *      toString                        |
     *      valueOf                         |
     *
     */


    var
      isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
      mathceil = Math.ceil,
      mathfloor = Math.floor,

      bignumberError = '[BigNumber Error] ',
      tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

      BASE = 1e14,
      LOG_BASE = 14,
      MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
      // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
      POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
      SQRT_BASE = 1e7,

      // EDITABLE
      // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
      // the arguments to toExponential, toFixed, toFormat, and toPrecision.
      MAX = 1E9;                                   // 0 to MAX_INT32


    /*
     * Create and return a BigNumber constructor.
     */
    function clone(configObject) {
      var div, convertBase, parseNumeric,
        P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
        ONE = new BigNumber(1),


        //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


        // The default values below must be integers within the inclusive ranges stated.
        // The values can also be changed at run-time using BigNumber.set.

        // The maximum number of decimal places for operations involving division.
        DECIMAL_PLACES = 20,                     // 0 to MAX

        // The rounding mode used when rounding to the above decimal places, and when using
        // toExponential, toFixed, toFormat and toPrecision, and round (default value).
        // UP         0 Away from zero.
        // DOWN       1 Towards zero.
        // CEIL       2 Towards +Infinity.
        // FLOOR      3 Towards -Infinity.
        // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
        // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
        // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
        // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
        // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
        ROUNDING_MODE = 4,                       // 0 to 8

        // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

        // The exponent value at and beneath which toString returns exponential notation.
        // Number type: -7
        TO_EXP_NEG = -7,                         // 0 to -MAX

        // The exponent value at and above which toString returns exponential notation.
        // Number type: 21
        TO_EXP_POS = 21,                         // 0 to MAX

        // RANGE : [MIN_EXP, MAX_EXP]

        // The minimum exponent value, beneath which underflow to zero occurs.
        // Number type: -324  (5e-324)
        MIN_EXP = -1e7,                          // -1 to -MAX

        // The maximum exponent value, above which overflow to Infinity occurs.
        // Number type:  308  (1.7976931348623157e+308)
        // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
        MAX_EXP = 1e7,                           // 1 to MAX

        // Whether to use cryptographically-secure random number generation, if available.
        CRYPTO = false,                          // true or false

        // The modulo mode used when calculating the modulus: a mod n.
        // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
        // The remainder (r) is calculated as: r = a - n * q.
        //
        // UP        0 The remainder is positive if the dividend is negative, else is negative.
        // DOWN      1 The remainder has the same sign as the dividend.
        //             This modulo mode is commonly known as 'truncated division' and is
        //             equivalent to (a % n) in JavaScript.
        // FLOOR     3 The remainder has the same sign as the divisor (Python %).
        // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
        // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
        //             The remainder is always positive.
        //
        // The truncated division, floored division, Euclidian division and IEEE 754 remainder
        // modes are commonly used for the modulus operation.
        // Although the other rounding modes can also be used, they may not give useful results.
        MODULO_MODE = 1,                         // 0 to 9

        // The maximum number of significant digits of the result of the exponentiatedBy operation.
        // If POW_PRECISION is 0, there will be unlimited significant digits.
        POW_PRECISION = 0,                       // 0 to MAX

        // The format specification used by the BigNumber.prototype.toFormat method.
        FORMAT = {
          prefix: '',
          groupSize: 3,
          secondaryGroupSize: 0,
          groupSeparator: ',',
          decimalSeparator: '.',
          fractionGroupSize: 0,
          fractionGroupSeparator: '\xA0',        // non-breaking space
          suffix: ''
        },

        // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
        // '-', '.', whitespace, or repeated character.
        // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
        alphabetHasNormalDecimalDigits = true;


      //------------------------------------------------------------------------------------------


      // CONSTRUCTOR


      /*
       * The BigNumber constructor and exported function.
       * Create and return a new instance of a BigNumber object.
       *
       * v {number|string|BigNumber} A numeric value.
       * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
       */
      function BigNumber(v, b) {
        var alphabet, c, caseChanged, e, i, isNum, len, str,
          x = this;

        // Enable constructor call without `new`.
        if (!(x instanceof BigNumber)) return new BigNumber(v, b);

        if (b == null) {

          if (v && v._isBigNumber === true) {
            x.s = v.s;

            if (!v.c || v.e > MAX_EXP) {
              x.c = x.e = null;
            } else if (v.e < MIN_EXP) {
              x.c = [x.e = 0];
            } else {
              x.e = v.e;
              x.c = v.c.slice();
            }

            return;
          }

          if ((isNum = typeof v == 'number') && v * 0 == 0) {

            // Use `1 / n` to handle minus zero also.
            x.s = 1 / v < 0 ? (v = -v, -1) : 1;

            // Fast path for integers, where n < 2147483648 (2**31).
            if (v === ~~v) {
              for (e = 0, i = v; i >= 10; i /= 10, e++);

              if (e > MAX_EXP) {
                x.c = x.e = null;
              } else {
                x.e = e;
                x.c = [v];
              }

              return;
            }

            str = String(v);
          } else {

            if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

            x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
          }

          // Decimal point?
          if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

          // Exponential form?
          if ((i = str.search(/e/i)) > 0) {

            // Determine exponent.
            if (e < 0) e = i;
            e += +str.slice(i + 1);
            str = str.substring(0, i);
          } else if (e < 0) {

            // Integer.
            e = str.length;
          }

        } else {

          // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
          intCheck(b, 2, ALPHABET.length, 'Base');

          // Allow exponential notation to be used with base 10 argument, while
          // also rounding to DECIMAL_PLACES as with other bases.
          if (b == 10 && alphabetHasNormalDecimalDigits) {
            x = new BigNumber(v);
            return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
          }

          str = String(v);

          if (isNum = typeof v == 'number') {

            // Avoid potential interpretation of Infinity and NaN as base 44+ values.
            if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

            x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

            // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
            if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
              throw Error
               (tooManyDigits + v);
            }
          } else {
            x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
          }

          alphabet = ALPHABET.slice(0, b);
          e = i = 0;

          // Check that str is a valid base b number.
          // Don't use RegExp, so alphabet can contain special characters.
          for (len = str.length; i < len; i++) {
            if (alphabet.indexOf(c = str.charAt(i)) < 0) {
              if (c == '.') {

                // If '.' is not the first character and it has not be found before.
                if (i > e) {
                  e = len;
                  continue;
                }
              } else if (!caseChanged) {

                // Allow e.g. hexadecimal 'FF' as well as 'ff'.
                if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                    str == str.toLowerCase() && (str = str.toUpperCase())) {
                  caseChanged = true;
                  i = -1;
                  e = 0;
                  continue;
                }
              }

              return parseNumeric(x, String(v), isNum, b);
            }
          }

          // Prevent later check for length on converted number.
          isNum = false;
          str = convertBase(str, b, 10, x.s);

          // Decimal point?
          if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
          else e = str.length;
        }

        // Determine leading zeros.
        for (i = 0; str.charCodeAt(i) === 48; i++);

        // Determine trailing zeros.
        for (len = str.length; str.charCodeAt(--len) === 48;);

        if (str = str.slice(i, ++len)) {
          len -= i;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (isNum && BigNumber.DEBUG &&
            len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
              throw Error
               (tooManyDigits + (x.s * v));
          }

           // Overflow?
          if ((e = e - i - 1) > MAX_EXP) {

            // Infinity.
            x.c = x.e = null;

          // Underflow?
          } else if (e < MIN_EXP) {

            // Zero.
            x.c = [x.e = 0];
          } else {
            x.e = e;
            x.c = [];

            // Transform base

            // e is the base 10 exponent.
            // i is where to slice str to get the first element of the coefficient array.
            i = (e + 1) % LOG_BASE;
            if (e < 0) i += LOG_BASE;  // i < 1

            if (i < len) {
              if (i) x.c.push(+str.slice(0, i));

              for (len -= LOG_BASE; i < len;) {
                x.c.push(+str.slice(i, i += LOG_BASE));
              }

              i = LOG_BASE - (str = str.slice(i)).length;
            } else {
              i -= len;
            }

            for (; i--; str += '0');
            x.c.push(+str);
          }
        } else {

          // Zero.
          x.c = [x.e = 0];
        }
      }


      // CONSTRUCTOR PROPERTIES


      BigNumber.clone = clone;

      BigNumber.ROUND_UP = 0;
      BigNumber.ROUND_DOWN = 1;
      BigNumber.ROUND_CEIL = 2;
      BigNumber.ROUND_FLOOR = 3;
      BigNumber.ROUND_HALF_UP = 4;
      BigNumber.ROUND_HALF_DOWN = 5;
      BigNumber.ROUND_HALF_EVEN = 6;
      BigNumber.ROUND_HALF_CEIL = 7;
      BigNumber.ROUND_HALF_FLOOR = 8;
      BigNumber.EUCLID = 9;


      /*
       * Configure infrequently-changing library-wide settings.
       *
       * Accept an object with the following optional properties (if the value of a property is
       * a number, it must be an integer within the inclusive range stated):
       *
       *   DECIMAL_PLACES   {number}           0 to MAX
       *   ROUNDING_MODE    {number}           0 to 8
       *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
       *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
       *   CRYPTO           {boolean}          true or false
       *   MODULO_MODE      {number}           0 to 9
       *   POW_PRECISION       {number}           0 to MAX
       *   ALPHABET         {string}           A string of two or more unique characters which does
       *                                       not contain '.'.
       *   FORMAT           {object}           An object with some of the following properties:
       *     prefix                 {string}
       *     groupSize              {number}
       *     secondaryGroupSize     {number}
       *     groupSeparator         {string}
       *     decimalSeparator       {string}
       *     fractionGroupSize      {number}
       *     fractionGroupSeparator {string}
       *     suffix                 {string}
       *
       * (The values assigned to the above FORMAT object properties are not checked for validity.)
       *
       * E.g.
       * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
       *
       * Ignore properties/parameters set to null or undefined, except for ALPHABET.
       *
       * Return an object with the properties current values.
       */
      BigNumber.config = BigNumber.set = function (obj) {
        var p, v;

        if (obj != null) {

          if (typeof obj == 'object') {

            // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
            // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
            if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              DECIMAL_PLACES = v;
            }

            // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
            // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
            if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
              v = obj[p];
              intCheck(v, 0, 8, p);
              ROUNDING_MODE = v;
            }

            // EXPONENTIAL_AT {number|number[]}
            // Integer, -MAX to MAX inclusive or
            // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
            // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
            if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, 0, p);
                intCheck(v[1], 0, MAX, p);
                TO_EXP_NEG = v[0];
                TO_EXP_POS = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
              }
            }

            // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
            // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
            // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
            if (obj.hasOwnProperty(p = 'RANGE')) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, -1, p);
                intCheck(v[1], 1, MAX, p);
                MIN_EXP = v[0];
                MAX_EXP = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                if (v) {
                  MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                } else {
                  throw Error
                   (bignumberError + p + ' cannot be zero: ' + v);
                }
              }
            }

            // CRYPTO {boolean} true or false.
            // '[BigNumber Error] CRYPTO not true or false: {v}'
            // '[BigNumber Error] crypto unavailable'
            if (obj.hasOwnProperty(p = 'CRYPTO')) {
              v = obj[p];
              if (v === !!v) {
                if (v) {
                  if (typeof crypto != 'undefined' && crypto &&
                   (crypto.getRandomValues || crypto.randomBytes)) {
                    CRYPTO = v;
                  } else {
                    CRYPTO = !v;
                    throw Error
                     (bignumberError + 'crypto unavailable');
                  }
                } else {
                  CRYPTO = v;
                }
              } else {
                throw Error
                 (bignumberError + p + ' not true or false: ' + v);
              }
            }

            // MODULO_MODE {number} Integer, 0 to 9 inclusive.
            // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
            if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
              v = obj[p];
              intCheck(v, 0, 9, p);
              MODULO_MODE = v;
            }

            // POW_PRECISION {number} Integer, 0 to MAX inclusive.
            // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
            if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              POW_PRECISION = v;
            }

            // FORMAT {object}
            // '[BigNumber Error] FORMAT not an object: {v}'
            if (obj.hasOwnProperty(p = 'FORMAT')) {
              v = obj[p];
              if (typeof v == 'object') FORMAT = v;
              else throw Error
               (bignumberError + p + ' not an object: ' + v);
            }

            // ALPHABET {string}
            // '[BigNumber Error] ALPHABET invalid: {v}'
            if (obj.hasOwnProperty(p = 'ALPHABET')) {
              v = obj[p];

              // Disallow if less than two characters,
              // or if it contains '+', '-', '.', whitespace, or a repeated character.
              if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
                ALPHABET = v;
              } else {
                throw Error
                 (bignumberError + p + ' invalid: ' + v);
              }
            }

          } else {

            // '[BigNumber Error] Object expected: {v}'
            throw Error
             (bignumberError + 'Object expected: ' + obj);
          }
        }

        return {
          DECIMAL_PLACES: DECIMAL_PLACES,
          ROUNDING_MODE: ROUNDING_MODE,
          EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
          RANGE: [MIN_EXP, MAX_EXP],
          CRYPTO: CRYPTO,
          MODULO_MODE: MODULO_MODE,
          POW_PRECISION: POW_PRECISION,
          FORMAT: FORMAT,
          ALPHABET: ALPHABET
        };
      };


      /*
       * Return true if v is a BigNumber instance, otherwise return false.
       *
       * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
       *
       * v {any}
       *
       * '[BigNumber Error] Invalid BigNumber: {v}'
       */
      BigNumber.isBigNumber = function (v) {
        if (!v || v._isBigNumber !== true) return false;
        if (!BigNumber.DEBUG) return true;

        var i, n,
          c = v.c,
          e = v.e,
          s = v.s;

        out: if ({}.toString.call(c) == '[object Array]') {

          if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

            // If the first element is zero, the BigNumber value must be zero.
            if (c[0] === 0) {
              if (e === 0 && c.length === 1) return true;
              break out;
            }

            // Calculate number of digits that c[0] should have, based on the exponent.
            i = (e + 1) % LOG_BASE;
            if (i < 1) i += LOG_BASE;

            // Calculate number of digits of c[0].
            //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
            if (String(c[0]).length == i) {

              for (i = 0; i < c.length; i++) {
                n = c[i];
                if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
              }

              // Last element cannot be zero, unless it is the only element.
              if (n !== 0) return true;
            }
          }

        // Infinity/NaN
        } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
          return true;
        }

        throw Error
          (bignumberError + 'Invalid BigNumber: ' + v);
      };


      /*
       * Return a new BigNumber whose value is the maximum of the arguments.
       *
       * arguments {number|string|BigNumber}
       */
      BigNumber.maximum = BigNumber.max = function () {
        return maxOrMin(arguments, -1);
      };


      /*
       * Return a new BigNumber whose value is the minimum of the arguments.
       *
       * arguments {number|string|BigNumber}
       */
      BigNumber.minimum = BigNumber.min = function () {
        return maxOrMin(arguments, 1);
      };


      /*
       * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
       * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
       * zeros are produced).
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
       * '[BigNumber Error] crypto unavailable'
       */
      BigNumber.random = (function () {
        var pow2_53 = 0x20000000000000;

        // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
        // Check if Math.random() produces more than 32 bits of randomness.
        // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
        // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
        var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
         ? function () { return mathfloor(Math.random() * pow2_53); }
         : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
           (Math.random() * 0x800000 | 0); };

        return function (dp) {
          var a, b, e, k, v,
            i = 0,
            c = [],
            rand = new BigNumber(ONE);

          if (dp == null) dp = DECIMAL_PLACES;
          else intCheck(dp, 0, MAX);

          k = mathceil(dp / LOG_BASE);

          if (CRYPTO) {

            // Browsers supporting crypto.getRandomValues.
            if (crypto.getRandomValues) {

              a = crypto.getRandomValues(new Uint32Array(k *= 2));

              for (; i < k;) {

                // 53 bits:
                // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                //                                     11111 11111111 11111111
                // 0x20000 is 2^21.
                v = a[i] * 0x20000 + (a[i + 1] >>> 11);

                // Rejection sampling:
                // 0 <= v < 9007199254740992
                // Probability that v >= 9e15, is
                // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                if (v >= 9e15) {
                  b = crypto.getRandomValues(new Uint32Array(2));
                  a[i] = b[0];
                  a[i + 1] = b[1];
                } else {

                  // 0 <= v <= 8999999999999999
                  // 0 <= (v % 1e14) <= 99999999999999
                  c.push(v % 1e14);
                  i += 2;
                }
              }
              i = k / 2;

            // Node.js supporting crypto.randomBytes.
            } else if (crypto.randomBytes) {

              // buffer
              a = crypto.randomBytes(k *= 7);

              for (; i < k;) {

                // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                // 0x100000000 is 2^32, 0x1000000 is 2^24
                // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                // 0 <= v < 9007199254740992
                v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                   (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                   (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

                if (v >= 9e15) {
                  crypto.randomBytes(7).copy(a, i);
                } else {

                  // 0 <= (v % 1e14) <= 99999999999999
                  c.push(v % 1e14);
                  i += 7;
                }
              }
              i = k / 7;
            } else {
              CRYPTO = false;
              throw Error
               (bignumberError + 'crypto unavailable');
            }
          }

          // Use Math.random.
          if (!CRYPTO) {

            for (; i < k;) {
              v = random53bitInt();
              if (v < 9e15) c[i++] = v % 1e14;
            }
          }

          k = c[--i];
          dp %= LOG_BASE;

          // Convert trailing digits to zeros according to dp.
          if (k && dp) {
            v = POWS_TEN[LOG_BASE - dp];
            c[i] = mathfloor(k / v) * v;
          }

          // Remove trailing elements which are zero.
          for (; c[i] === 0; c.pop(), i--);

          // Zero?
          if (i < 0) {
            c = [e = 0];
          } else {

            // Remove leading elements which are zero and adjust exponent accordingly.
            for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

            // Count the digits of the first element of c to determine leading zeros, and...
            for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

            // adjust the exponent accordingly.
            if (i < LOG_BASE) e -= LOG_BASE - i;
          }

          rand.e = e;
          rand.c = c;
          return rand;
        };
      })();


       /*
       * Return a BigNumber whose value is the sum of the arguments.
       *
       * arguments {number|string|BigNumber}
       */
      BigNumber.sum = function () {
        var i = 1,
          args = arguments,
          sum = new BigNumber(args[0]);
        for (; i < args.length;) sum = sum.plus(args[i++]);
        return sum;
      };


      // PRIVATE FUNCTIONS


      // Called by BigNumber and BigNumber.prototype.toString.
      convertBase = (function () {
        var decimal = '0123456789';

        /*
         * Convert string of baseIn to an array of numbers of baseOut.
         * Eg. toBaseOut('255', 10, 16) returns [15, 15].
         * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
         */
        function toBaseOut(str, baseIn, baseOut, alphabet) {
          var j,
            arr = [0],
            arrL,
            i = 0,
            len = str.length;

          for (; i < len;) {
            for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

            arr[0] += alphabet.indexOf(str.charAt(i++));

            for (j = 0; j < arr.length; j++) {

              if (arr[j] > baseOut - 1) {
                if (arr[j + 1] == null) arr[j + 1] = 0;
                arr[j + 1] += arr[j] / baseOut | 0;
                arr[j] %= baseOut;
              }
            }
          }

          return arr.reverse();
        }

        // Convert a numeric string of baseIn to a numeric string of baseOut.
        // If the caller is toString, we are converting from base 10 to baseOut.
        // If the caller is BigNumber, we are converting from baseIn to base 10.
        return function (str, baseIn, baseOut, sign, callerIsToString) {
          var alphabet, d, e, k, r, x, xc, y,
            i = str.indexOf('.'),
            dp = DECIMAL_PLACES,
            rm = ROUNDING_MODE;

          // Non-integer.
          if (i >= 0) {
            k = POW_PRECISION;

            // Unlimited precision.
            POW_PRECISION = 0;
            str = str.replace('.', '');
            y = new BigNumber(baseIn);
            x = y.pow(str.length - i);
            POW_PRECISION = k;

            // Convert str as if an integer, then restore the fraction part by dividing the
            // result by its base raised to a power.

            y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
             10, baseOut, decimal);
            y.e = y.c.length;
          }

          // Convert the number as integer.

          xc = toBaseOut(str, baseIn, baseOut, callerIsToString
           ? (alphabet = ALPHABET, decimal)
           : (alphabet = decimal, ALPHABET));

          // xc now represents str as an integer and converted to baseOut. e is the exponent.
          e = k = xc.length;

          // Remove trailing zeros.
          for (; xc[--k] == 0; xc.pop());

          // Zero?
          if (!xc[0]) return alphabet.charAt(0);

          // Does str represent an integer? If so, no need for the division.
          if (i < 0) {
            --e;
          } else {
            x.c = xc;
            x.e = e;

            // The sign is needed for correct rounding.
            x.s = sign;
            x = div(x, y, dp, rm, baseOut);
            xc = x.c;
            r = x.r;
            e = x.e;
          }

          // xc now represents str converted to baseOut.

          // THe index of the rounding digit.
          d = e + dp + 1;

          // The rounding digit: the digit to the right of the digit that may be rounded up.
          i = xc[d];

          // Look at the rounding digits and mode to determine whether to round up.

          k = baseOut / 2;
          r = r || d < 0 || xc[d + 1] != null;

          r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
                : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                 rm == (x.s < 0 ? 8 : 7));

          // If the index of the rounding digit is not greater than zero, or xc represents
          // zero, then the result of the base conversion is zero or, if rounding up, a value
          // such as 0.00001.
          if (d < 1 || !xc[0]) {

            // 1^-dp or 0
            str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
          } else {

            // Truncate xc to the required number of decimal places.
            xc.length = d;

            // Round up?
            if (r) {

              // Rounding up may mean the previous digit has to be rounded up and so on.
              for (--baseOut; ++xc[--d] > baseOut;) {
                xc[d] = 0;

                if (!d) {
                  ++e;
                  xc = [1].concat(xc);
                }
              }
            }

            // Determine trailing zeros.
            for (k = xc.length; !xc[--k];);

            // E.g. [4, 11, 15] becomes 4bf.
            for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

            // Add leading zeros, decimal point and trailing zeros as required.
            str = toFixedPoint(str, e, alphabet.charAt(0));
          }

          // The caller will add the sign.
          return str;
        };
      })();


      // Perform division in the specified base. Called by div and convertBase.
      div = (function () {

        // Assume non-zero x and k.
        function multiply(x, k, base) {
          var m, temp, xlo, xhi,
            carry = 0,
            i = x.length,
            klo = k % SQRT_BASE,
            khi = k / SQRT_BASE | 0;

          for (x = x.slice(); i--;) {
            xlo = x[i] % SQRT_BASE;
            xhi = x[i] / SQRT_BASE | 0;
            m = khi * xlo + xhi * klo;
            temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
            carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
            x[i] = temp % base;
          }

          if (carry) x = [carry].concat(x);

          return x;
        }

        function compare(a, b, aL, bL) {
          var i, cmp;

          if (aL != bL) {
            cmp = aL > bL ? 1 : -1;
          } else {

            for (i = cmp = 0; i < aL; i++) {

              if (a[i] != b[i]) {
                cmp = a[i] > b[i] ? 1 : -1;
                break;
              }
            }
          }

          return cmp;
        }

        function subtract(a, b, aL, base) {
          var i = 0;

          // Subtract b from a.
          for (; aL--;) {
            a[aL] -= i;
            i = a[aL] < b[aL] ? 1 : 0;
            a[aL] = i * base + a[aL] - b[aL];
          }

          // Remove leading zeros.
          for (; !a[0] && a.length > 1; a.splice(0, 1));
        }

        // x: dividend, y: divisor.
        return function (x, y, dp, rm, base) {
          var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
            yL, yz,
            s = x.s == y.s ? 1 : -1,
            xc = x.c,
            yc = y.c;

          // Either NaN, Infinity or 0?
          if (!xc || !xc[0] || !yc || !yc[0]) {

            return new BigNumber(

             // Return NaN if either NaN, or both Infinity or 0.
             !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

              // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
              xc && xc[0] == 0 || !yc ? s * 0 : s / 0
           );
          }

          q = new BigNumber(s);
          qc = q.c = [];
          e = x.e - y.e;
          s = dp + e + 1;

          if (!base) {
            base = BASE;
            e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
            s = s / LOG_BASE | 0;
          }

          // Result exponent may be one less then the current value of e.
          // The coefficients of the BigNumbers from convertBase may have trailing zeros.
          for (i = 0; yc[i] == (xc[i] || 0); i++);

          if (yc[i] > (xc[i] || 0)) e--;

          if (s < 0) {
            qc.push(1);
            more = true;
          } else {
            xL = xc.length;
            yL = yc.length;
            i = 0;
            s += 2;

            // Normalise xc and yc so highest order digit of yc is >= base / 2.

            n = mathfloor(base / (yc[0] + 1));

            // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
            // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
            if (n > 1) {
              yc = multiply(yc, n, base);
              xc = multiply(xc, n, base);
              yL = yc.length;
              xL = xc.length;
            }

            xi = yL;
            rem = xc.slice(0, yL);
            remL = rem.length;

            // Add zeros to make remainder as long as divisor.
            for (; remL < yL; rem[remL++] = 0);
            yz = yc.slice();
            yz = [0].concat(yz);
            yc0 = yc[0];
            if (yc[1] >= base / 2) yc0++;
            // Not necessary, but to prevent trial digit n > base, when using base 3.
            // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

            do {
              n = 0;

              // Compare divisor and remainder.
              cmp = compare(yc, rem, yL, remL);

              // If divisor < remainder.
              if (cmp < 0) {

                // Calculate trial digit, n.

                rem0 = rem[0];
                if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

                // n is how many times the divisor goes into the current remainder.
                n = mathfloor(rem0 / yc0);

                //  Algorithm:
                //  product = divisor multiplied by trial digit (n).
                //  Compare product and remainder.
                //  If product is greater than remainder:
                //    Subtract divisor from product, decrement trial digit.
                //  Subtract product from remainder.
                //  If product was less than remainder at the last compare:
                //    Compare new remainder and divisor.
                //    If remainder is greater than divisor:
                //      Subtract divisor from remainder, increment trial digit.

                if (n > 1) {

                  // n may be > base only when base is 3.
                  if (n >= base) n = base - 1;

                  // product = divisor * trial digit.
                  prod = multiply(yc, n, base);
                  prodL = prod.length;
                  remL = rem.length;

                  // Compare product and remainder.
                  // If product > remainder then trial digit n too high.
                  // n is 1 too high about 5% of the time, and is not known to have
                  // ever been more than 1 too high.
                  while (compare(prod, rem, prodL, remL) == 1) {
                    n--;

                    // Subtract divisor from product.
                    subtract(prod, yL < prodL ? yz : yc, prodL, base);
                    prodL = prod.length;
                    cmp = 1;
                  }
                } else {

                  // n is 0 or 1, cmp is -1.
                  // If n is 0, there is no need to compare yc and rem again below,
                  // so change cmp to 1 to avoid it.
                  // If n is 1, leave cmp as -1, so yc and rem are compared again.
                  if (n == 0) {

                    // divisor < remainder, so n must be at least 1.
                    cmp = n = 1;
                  }

                  // product = divisor
                  prod = yc.slice();
                  prodL = prod.length;
                }

                if (prodL < remL) prod = [0].concat(prod);

                // Subtract product from remainder.
                subtract(rem, prod, remL, base);
                remL = rem.length;

                 // If product was < remainder.
                if (cmp == -1) {

                  // Compare divisor and new remainder.
                  // If divisor < new remainder, subtract divisor from remainder.
                  // Trial digit n too low.
                  // n is 1 too low about 5% of the time, and very rarely 2 too low.
                  while (compare(yc, rem, yL, remL) < 1) {
                    n++;

                    // Subtract divisor from remainder.
                    subtract(rem, yL < remL ? yz : yc, remL, base);
                    remL = rem.length;
                  }
                }
              } else if (cmp === 0) {
                n++;
                rem = [0];
              } // else cmp === 1 and n will be 0

              // Add the next digit, n, to the result array.
              qc[i++] = n;

              // Update the remainder.
              if (rem[0]) {
                rem[remL++] = xc[xi] || 0;
              } else {
                rem = [xc[xi]];
                remL = 1;
              }
            } while ((xi++ < xL || rem[0] != null) && s--);

            more = rem[0] != null;

            // Leading zero?
            if (!qc[0]) qc.splice(0, 1);
          }

          if (base == BASE) {

            // To calculate q.e, first get the number of digits of qc[0].
            for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

            round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

          // Caller is convertBase.
          } else {
            q.e = e;
            q.r = +more;
          }

          return q;
        };
      })();


      /*
       * Return a string representing the value of BigNumber n in fixed-point or exponential
       * notation rounded to the specified decimal places or significant digits.
       *
       * n: a BigNumber.
       * i: the index of the last digit required (i.e. the digit that may be rounded up).
       * rm: the rounding mode.
       * id: 1 (toExponential) or 2 (toPrecision).
       */
      function format(n, i, rm, id) {
        var c0, e, ne, len, str;

        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        if (!n.c) return n.toString();

        c0 = n.c[0];
        ne = n.e;

        if (i == null) {
          str = coeffToString(n.c);
          str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
           ? toExponential(str, ne)
           : toFixedPoint(str, ne, '0');
        } else {
          n = round(new BigNumber(n), i, rm);

          // n.e may have changed if the value was rounded up.
          e = n.e;

          str = coeffToString(n.c);
          len = str.length;

          // toPrecision returns exponential notation if the number of significant digits
          // specified is less than the number of digits necessary to represent the integer
          // part of the value in fixed-point notation.

          // Exponential notation.
          if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

            // Append zeros?
            for (; len < i; str += '0', len++);
            str = toExponential(str, e);

          // Fixed-point notation.
          } else {
            i -= ne;
            str = toFixedPoint(str, e, '0');

            // Append zeros?
            if (e + 1 > len) {
              if (--i > 0) for (str += '.'; i--; str += '0');
            } else {
              i += e - len;
              if (i > 0) {
                if (e + 1 == len) str += '.';
                for (; i--; str += '0');
              }
            }
          }
        }

        return n.s < 0 && c0 ? '-' + str : str;
      }


      // Handle BigNumber.max and BigNumber.min.
      // If any number is NaN, return NaN.
      function maxOrMin(args, n) {
        var k, y,
          i = 1,
          x = new BigNumber(args[0]);

        for (; i < args.length; i++) {
          y = new BigNumber(args[i]);
          if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
            x = y;
          }
        }

        return x;
      }


      /*
       * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
       * Called by minus, plus and times.
       */
      function normalise(n, c, e) {
        var i = 1,
          j = c.length;

         // Remove trailing zeros.
        for (; !c[--j]; c.pop());

        // Calculate the base 10 exponent. First get the number of digits of c[0].
        for (j = c[0]; j >= 10; j /= 10, i++);

        // Overflow?
        if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

          // Infinity.
          n.c = n.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          n.c = [n.e = 0];
        } else {
          n.e = e;
          n.c = c;
        }

        return n;
      }


      // Handle values that fail the validity test in BigNumber.
      parseNumeric = (function () {
        var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
          dotAfter = /^([^.]+)\.$/,
          dotBefore = /^\.([^.]+)$/,
          isInfinityOrNaN = /^-?(Infinity|NaN)$/,
          whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

        return function (x, str, isNum, b) {
          var base,
            s = isNum ? str : str.replace(whitespaceOrPlus, '');

          // No exception on ±Infinity or NaN.
          if (isInfinityOrNaN.test(s)) {
            x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
          } else {
            if (!isNum) {

              // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
              s = s.replace(basePrefix, function (m, p1, p2) {
                base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                return !b || b == base ? p1 : m;
              });

              if (b) {
                base = b;

                // E.g. '1.' to '1', '.1' to '0.1'
                s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
              }

              if (str != s) return new BigNumber(s, base);
            }

            // '[BigNumber Error] Not a number: {n}'
            // '[BigNumber Error] Not a base {b} number: {n}'
            if (BigNumber.DEBUG) {
              throw Error
                (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
            }

            // NaN
            x.s = null;
          }

          x.c = x.e = null;
        }
      })();


      /*
       * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
       * If r is truthy, it is known that there are more digits after the rounding digit.
       */
      function round(x, sd, rm, r) {
        var d, i, j, k, n, ni, rd,
          xc = x.c,
          pows10 = POWS_TEN;

        // if x is not Infinity or NaN...
        if (xc) {

          // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
          // n is a base 1e14 number, the value of the element of array x.c containing rd.
          // ni is the index of n within x.c.
          // d is the number of digits of n.
          // i is the index of rd within n including leading zeros.
          // j is the actual index of rd within n (if < 0, rd is a leading zero).
          out: {

            // Get the number of digits of the first element of xc.
            for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
            i = sd - d;

            // If the rounding digit is in the first element of xc...
            if (i < 0) {
              i += LOG_BASE;
              j = sd;
              n = xc[ni = 0];

              // Get the rounding digit at index j of n.
              rd = mathfloor(n / pows10[d - j - 1] % 10);
            } else {
              ni = mathceil((i + 1) / LOG_BASE);

              if (ni >= xc.length) {

                if (r) {

                  // Needed by sqrt.
                  for (; xc.length <= ni; xc.push(0));
                  n = rd = 0;
                  d = 1;
                  i %= LOG_BASE;
                  j = i - LOG_BASE + 1;
                } else {
                  break out;
                }
              } else {
                n = k = xc[ni];

                // Get the number of digits of n.
                for (d = 1; k >= 10; k /= 10, d++);

                // Get the index of rd within n.
                i %= LOG_BASE;

                // Get the index of rd within n, adjusted for leading zeros.
                // The number of leading zeros of n is given by LOG_BASE - d.
                j = i - LOG_BASE + d;

                // Get the rounding digit at index j of n.
                rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
              }
            }

            r = r || sd < 0 ||

            // Are there any non-zero digits after the rounding digit?
            // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
            // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
             xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

            r = rm < 4
             ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
             : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

              // Check whether the digit to the left of the rounding digit is odd.
              ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
               rm == (x.s < 0 ? 8 : 7));

            if (sd < 1 || !xc[0]) {
              xc.length = 0;

              if (r) {

                // Convert sd to decimal places.
                sd -= x.e + 1;

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                x.e = -sd || 0;
              } else {

                // Zero.
                xc[0] = x.e = 0;
              }

              return x;
            }

            // Remove excess digits.
            if (i == 0) {
              xc.length = ni;
              k = 1;
              ni--;
            } else {
              xc.length = ni + 1;
              k = pows10[LOG_BASE - i];

              // E.g. 56700 becomes 56000 if 7 is the rounding digit.
              // j > 0 means i > number of leading zeros of n.
              xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
            }

            // Round up?
            if (r) {

              for (; ;) {

                // If the digit to be rounded up is in the first element of xc...
                if (ni == 0) {

                  // i will be the length of xc[0] before k is added.
                  for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                  j = xc[0] += k;
                  for (k = 1; j >= 10; j /= 10, k++);

                  // if i != k the length has increased.
                  if (i != k) {
                    x.e++;
                    if (xc[0] == BASE) xc[0] = 1;
                  }

                  break;
                } else {
                  xc[ni] += k;
                  if (xc[ni] != BASE) break;
                  xc[ni--] = 0;
                  k = 1;
                }
              }
            }

            // Remove trailing zeros.
            for (i = xc.length; xc[--i] === 0; xc.pop());
          }

          // Overflow? Infinity.
          if (x.e > MAX_EXP) {
            x.c = x.e = null;

          // Underflow? Zero.
          } else if (x.e < MIN_EXP) {
            x.c = [x.e = 0];
          }
        }

        return x;
      }


      function valueOf(n) {
        var str,
          e = n.e;

        if (e === null) return n.toString();

        str = coeffToString(n.c);

        str = e <= TO_EXP_NEG || e >= TO_EXP_POS
          ? toExponential(str, e)
          : toFixedPoint(str, e, '0');

        return n.s < 0 ? '-' + str : str;
      }


      // PROTOTYPE/INSTANCE METHODS


      /*
       * Return a new BigNumber whose value is the absolute value of this BigNumber.
       */
      P.absoluteValue = P.abs = function () {
        var x = new BigNumber(this);
        if (x.s < 0) x.s = 1;
        return x;
      };


      /*
       * Return
       *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
       *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
       *   0 if they have the same value,
       *   or null if the value of either is NaN.
       */
      P.comparedTo = function (y, b) {
        return compare(this, new BigNumber(y, b));
      };


      /*
       * If dp is undefined or null or true or false, return the number of decimal places of the
       * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
       *
       * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
       * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
       * ROUNDING_MODE if rm is omitted.
       *
       * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       */
      P.decimalPlaces = P.dp = function (dp, rm) {
        var c, n, v,
          x = this;

        if (dp != null) {
          intCheck(dp, 0, MAX);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);

          return round(new BigNumber(x), dp + x.e + 1, rm);
        }

        if (!(c = x.c)) return null;
        n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

        // Subtract the number of trailing zeros of the last number.
        if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
        if (n < 0) n = 0;

        return n;
      };


      /*
       *  n / 0 = I
       *  n / N = N
       *  n / I = 0
       *  0 / n = 0
       *  0 / 0 = N
       *  0 / N = N
       *  0 / I = 0
       *  N / n = N
       *  N / 0 = N
       *  N / N = N
       *  N / I = N
       *  I / n = I
       *  I / 0 = I
       *  I / N = N
       *  I / I = N
       *
       * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
       * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
       */
      P.dividedBy = P.div = function (y, b) {
        return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
      };


      /*
       * Return a new BigNumber whose value is the integer part of dividing the value of this
       * BigNumber by the value of BigNumber(y, b).
       */
      P.dividedToIntegerBy = P.idiv = function (y, b) {
        return div(this, new BigNumber(y, b), 0, 1);
      };


      /*
       * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
       *
       * If m is present, return the result modulo m.
       * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
       * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
       *
       * The modular power operation works efficiently when x, n, and m are integers, otherwise it
       * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
       *
       * n {number|string|BigNumber} The exponent. An integer.
       * [m] {number|string|BigNumber} The modulus.
       *
       * '[BigNumber Error] Exponent not an integer: {n}'
       */
      P.exponentiatedBy = P.pow = function (n, m) {
        var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
          x = this;

        n = new BigNumber(n);

        // Allow NaN and ±Infinity, but not other non-integers.
        if (n.c && !n.isInteger()) {
          throw Error
            (bignumberError + 'Exponent not an integer: ' + valueOf(n));
        }

        if (m != null) m = new BigNumber(m);

        // Exponent of MAX_SAFE_INTEGER is 15.
        nIsBig = n.e > 14;

        // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
        if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

          // The sign of the result of pow when x is negative depends on the evenness of n.
          // If +n overflows to ±Infinity, the evenness of n would be not be known.
          y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
          return m ? y.mod(m) : y;
        }

        nIsNeg = n.s < 0;

        if (m) {

          // x % m returns NaN if abs(m) is zero, or m is NaN.
          if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

          isModExp = !nIsNeg && x.isInteger() && m.isInteger();

          if (isModExp) x = x.mod(m);

        // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
        // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
        } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
          // [1, 240000000]
          ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
          // [80000000000000]  [99999750000000]
          : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

          // If x is negative and n is odd, k = -0, else k = 0.
          k = x.s < 0 && isOdd(n) ? -0 : 0;

          // If x >= 1, k = ±Infinity.
          if (x.e > -1) k = 1 / k;

          // If n is negative return ±0, else return ±Infinity.
          return new BigNumber(nIsNeg ? 1 / k : k);

        } else if (POW_PRECISION) {

          // Truncating each coefficient array to a length of k after each multiplication
          // equates to truncating significant digits to POW_PRECISION + [28, 41],
          // i.e. there will be a minimum of 28 guard digits retained.
          k = mathceil(POW_PRECISION / LOG_BASE + 2);
        }

        if (nIsBig) {
          half = new BigNumber(0.5);
          if (nIsNeg) n.s = 1;
          nIsOdd = isOdd(n);
        } else {
          i = Math.abs(+valueOf(n));
          nIsOdd = i % 2;
        }

        y = new BigNumber(ONE);

        // Performs 54 loop iterations for n of 9007199254740991.
        for (; ;) {

          if (nIsOdd) {
            y = y.times(x);
            if (!y.c) break;

            if (k) {
              if (y.c.length > k) y.c.length = k;
            } else if (isModExp) {
              y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
            }
          }

          if (i) {
            i = mathfloor(i / 2);
            if (i === 0) break;
            nIsOdd = i % 2;
          } else {
            n = n.times(half);
            round(n, n.e + 1, 1);

            if (n.e > 14) {
              nIsOdd = isOdd(n);
            } else {
              i = +valueOf(n);
              if (i === 0) break;
              nIsOdd = i % 2;
            }
          }

          x = x.times(x);

          if (k) {
            if (x.c && x.c.length > k) x.c.length = k;
          } else if (isModExp) {
            x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
          }
        }

        if (isModExp) return y;
        if (nIsNeg) y = ONE.div(y);

        return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
      };


      /*
       * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
       * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
       *
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
       */
      P.integerValue = function (rm) {
        var n = new BigNumber(this);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);
        return round(n, n.e + 1, rm);
      };


      /*
       * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
       * otherwise return false.
       */
      P.isEqualTo = P.eq = function (y, b) {
        return compare(this, new BigNumber(y, b)) === 0;
      };


      /*
       * Return true if the value of this BigNumber is a finite number, otherwise return false.
       */
      P.isFinite = function () {
        return !!this.c;
      };


      /*
       * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
       * otherwise return false.
       */
      P.isGreaterThan = P.gt = function (y, b) {
        return compare(this, new BigNumber(y, b)) > 0;
      };


      /*
       * Return true if the value of this BigNumber is greater than or equal to the value of
       * BigNumber(y, b), otherwise return false.
       */
      P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
        return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

      };


      /*
       * Return true if the value of this BigNumber is an integer, otherwise return false.
       */
      P.isInteger = function () {
        return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
      };


      /*
       * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
       * otherwise return false.
       */
      P.isLessThan = P.lt = function (y, b) {
        return compare(this, new BigNumber(y, b)) < 0;
      };


      /*
       * Return true if the value of this BigNumber is less than or equal to the value of
       * BigNumber(y, b), otherwise return false.
       */
      P.isLessThanOrEqualTo = P.lte = function (y, b) {
        return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
      };


      /*
       * Return true if the value of this BigNumber is NaN, otherwise return false.
       */
      P.isNaN = function () {
        return !this.s;
      };


      /*
       * Return true if the value of this BigNumber is negative, otherwise return false.
       */
      P.isNegative = function () {
        return this.s < 0;
      };


      /*
       * Return true if the value of this BigNumber is positive, otherwise return false.
       */
      P.isPositive = function () {
        return this.s > 0;
      };


      /*
       * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
       */
      P.isZero = function () {
        return !!this.c && this.c[0] == 0;
      };


      /*
       *  n - 0 = n
       *  n - N = N
       *  n - I = -I
       *  0 - n = -n
       *  0 - 0 = 0
       *  0 - N = N
       *  0 - I = -I
       *  N - n = N
       *  N - 0 = N
       *  N - N = N
       *  N - I = N
       *  I - n = I
       *  I - 0 = I
       *  I - N = N
       *  I - I = N
       *
       * Return a new BigNumber whose value is the value of this BigNumber minus the value of
       * BigNumber(y, b).
       */
      P.minus = function (y, b) {
        var i, j, t, xLTy,
          x = this,
          a = x.s;

        y = new BigNumber(y, b);
        b = y.s;

        // Either NaN?
        if (!a || !b) return new BigNumber(NaN);

        // Signs differ?
        if (a != b) {
          y.s = -b;
          return x.plus(y);
        }

        var xe = x.e / LOG_BASE,
          ye = y.e / LOG_BASE,
          xc = x.c,
          yc = y.c;

        if (!xe || !ye) {

          // Either Infinity?
          if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

          // Either zero?
          if (!xc[0] || !yc[0]) {

            // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
            return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

             // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
             ROUNDING_MODE == 3 ? -0 : 0);
          }
        }

        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();

        // Determine which is the bigger number.
        if (a = xe - ye) {

          if (xLTy = a < 0) {
            a = -a;
            t = xc;
          } else {
            ye = xe;
            t = yc;
          }

          t.reverse();

          // Prepend zeros to equalise exponents.
          for (b = a; b--; t.push(0));
          t.reverse();
        } else {

          // Exponents equal. Check digit by digit.
          j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

          for (a = b = 0; b < j; b++) {

            if (xc[b] != yc[b]) {
              xLTy = xc[b] < yc[b];
              break;
            }
          }
        }

        // x < y? Point xc to the array of the bigger number.
        if (xLTy) {
          t = xc;
          xc = yc;
          yc = t;
          y.s = -y.s;
        }

        b = (j = yc.length) - (i = xc.length);

        // Append zeros to xc if shorter.
        // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
        if (b > 0) for (; b--; xc[i++] = 0);
        b = BASE - 1;

        // Subtract yc from xc.
        for (; j > a;) {

          if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i]; xc[i] = b);
            --xc[i];
            xc[j] += BASE;
          }

          xc[j] -= yc[j];
        }

        // Remove leading zeros and adjust exponent accordingly.
        for (; xc[0] == 0; xc.splice(0, 1), --ye);

        // Zero?
        if (!xc[0]) {

          // Following IEEE 754 (2008) 6.3,
          // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
          y.s = ROUNDING_MODE == 3 ? -1 : 1;
          y.c = [y.e = 0];
          return y;
        }

        // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
        // for finite x and y.
        return normalise(y, xc, ye);
      };


      /*
       *   n % 0 =  N
       *   n % N =  N
       *   n % I =  n
       *   0 % n =  0
       *  -0 % n = -0
       *   0 % 0 =  N
       *   0 % N =  N
       *   0 % I =  0
       *   N % n =  N
       *   N % 0 =  N
       *   N % N =  N
       *   N % I =  N
       *   I % n =  N
       *   I % 0 =  N
       *   I % N =  N
       *   I % I =  N
       *
       * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
       * BigNumber(y, b). The result depends on the value of MODULO_MODE.
       */
      P.modulo = P.mod = function (y, b) {
        var q, s,
          x = this;

        y = new BigNumber(y, b);

        // Return NaN if x is Infinity or NaN, or y is NaN or zero.
        if (!x.c || !y.s || y.c && !y.c[0]) {
          return new BigNumber(NaN);

        // Return x if y is Infinity or x is zero.
        } else if (!y.c || x.c && !x.c[0]) {
          return new BigNumber(x);
        }

        if (MODULO_MODE == 9) {

          // Euclidian division: q = sign(y) * floor(x / abs(y))
          // r = x - qy    where  0 <= r < abs(y)
          s = y.s;
          y.s = 1;
          q = div(x, y, 0, 3);
          y.s = s;
          q.s *= s;
        } else {
          q = div(x, y, 0, MODULO_MODE);
        }

        y = x.minus(q.times(y));

        // To match JavaScript %, ensure sign of zero is sign of dividend.
        if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

        return y;
      };


      /*
       *  n * 0 = 0
       *  n * N = N
       *  n * I = I
       *  0 * n = 0
       *  0 * 0 = 0
       *  0 * N = N
       *  0 * I = N
       *  N * n = N
       *  N * 0 = N
       *  N * N = N
       *  N * I = N
       *  I * n = I
       *  I * 0 = N
       *  I * N = N
       *  I * I = I
       *
       * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
       * of BigNumber(y, b).
       */
      P.multipliedBy = P.times = function (y, b) {
        var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
          base, sqrtBase,
          x = this,
          xc = x.c,
          yc = (y = new BigNumber(y, b)).c;

        // Either NaN, ±Infinity or ±0?
        if (!xc || !yc || !xc[0] || !yc[0]) {

          // Return NaN if either is NaN, or one is 0 and the other is Infinity.
          if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
            y.c = y.e = y.s = null;
          } else {
            y.s *= x.s;

            // Return ±Infinity if either is ±Infinity.
            if (!xc || !yc) {
              y.c = y.e = null;

            // Return ±0 if either is ±0.
            } else {
              y.c = [0];
              y.e = 0;
            }
          }

          return y;
        }

        e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
        y.s *= x.s;
        xcL = xc.length;
        ycL = yc.length;

        // Ensure xc points to longer array and xcL to its length.
        if (xcL < ycL) {
          zc = xc;
          xc = yc;
          yc = zc;
          i = xcL;
          xcL = ycL;
          ycL = i;
        }

        // Initialise the result array with zeros.
        for (i = xcL + ycL, zc = []; i--; zc.push(0));

        base = BASE;
        sqrtBase = SQRT_BASE;

        for (i = ycL; --i >= 0;) {
          c = 0;
          ylo = yc[i] % sqrtBase;
          yhi = yc[i] / sqrtBase | 0;

          for (k = xcL, j = i + k; j > i;) {
            xlo = xc[--k] % sqrtBase;
            xhi = xc[k] / sqrtBase | 0;
            m = yhi * xlo + xhi * ylo;
            xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
            c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
            zc[j--] = xlo % base;
          }

          zc[j] = c;
        }

        if (c) {
          ++e;
        } else {
          zc.splice(0, 1);
        }

        return normalise(y, zc, e);
      };


      /*
       * Return a new BigNumber whose value is the value of this BigNumber negated,
       * i.e. multiplied by -1.
       */
      P.negated = function () {
        var x = new BigNumber(this);
        x.s = -x.s || null;
        return x;
      };


      /*
       *  n + 0 = n
       *  n + N = N
       *  n + I = I
       *  0 + n = n
       *  0 + 0 = 0
       *  0 + N = N
       *  0 + I = I
       *  N + n = N
       *  N + 0 = N
       *  N + N = N
       *  N + I = N
       *  I + n = I
       *  I + 0 = I
       *  I + N = N
       *  I + I = I
       *
       * Return a new BigNumber whose value is the value of this BigNumber plus the value of
       * BigNumber(y, b).
       */
      P.plus = function (y, b) {
        var t,
          x = this,
          a = x.s;

        y = new BigNumber(y, b);
        b = y.s;

        // Either NaN?
        if (!a || !b) return new BigNumber(NaN);

        // Signs differ?
         if (a != b) {
          y.s = -b;
          return x.minus(y);
        }

        var xe = x.e / LOG_BASE,
          ye = y.e / LOG_BASE,
          xc = x.c,
          yc = y.c;

        if (!xe || !ye) {

          // Return ±Infinity if either ±Infinity.
          if (!xc || !yc) return new BigNumber(a / 0);

          // Either zero?
          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
        }

        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();

        // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
        if (a = xe - ye) {
          if (a > 0) {
            ye = xe;
            t = yc;
          } else {
            a = -a;
            t = xc;
          }

          t.reverse();
          for (; a--; t.push(0));
          t.reverse();
        }

        a = xc.length;
        b = yc.length;

        // Point xc to the longer array, and b to the shorter length.
        if (a - b < 0) {
          t = yc;
          yc = xc;
          xc = t;
          b = a;
        }

        // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
        for (a = 0; b;) {
          a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
          xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
        }

        if (a) {
          xc = [a].concat(xc);
          ++ye;
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0
        // ye = MAX_EXP + 1 possible
        return normalise(y, xc, ye);
      };


      /*
       * If sd is undefined or null or true or false, return the number of significant digits of
       * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
       * If sd is true include integer-part trailing zeros in the count.
       *
       * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
       * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
       * ROUNDING_MODE if rm is omitted.
       *
       * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
       *                     boolean: whether to count integer-part trailing zeros: true or false.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
       */
      P.precision = P.sd = function (sd, rm) {
        var c, n, v,
          x = this;

        if (sd != null && sd !== !!sd) {
          intCheck(sd, 1, MAX);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);

          return round(new BigNumber(x), sd, rm);
        }

        if (!(c = x.c)) return null;
        v = c.length - 1;
        n = v * LOG_BASE + 1;

        if (v = c[v]) {

          // Subtract the number of trailing zeros of the last element.
          for (; v % 10 == 0; v /= 10, n--);

          // Add the number of digits of the first element.
          for (v = c[0]; v >= 10; v /= 10, n++);
        }

        if (sd && x.e + 1 > n) n = x.e + 1;

        return n;
      };


      /*
       * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
       * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
       *
       * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
       */
      P.shiftedBy = function (k) {
        intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
        return this.times('1e' + k);
      };


      /*
       *  sqrt(-n) =  N
       *  sqrt(N) =  N
       *  sqrt(-I) =  N
       *  sqrt(I) =  I
       *  sqrt(0) =  0
       *  sqrt(-0) = -0
       *
       * Return a new BigNumber whose value is the square root of the value of this BigNumber,
       * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
       */
      P.squareRoot = P.sqrt = function () {
        var m, n, r, rep, t,
          x = this,
          c = x.c,
          s = x.s,
          e = x.e,
          dp = DECIMAL_PLACES + 4,
          half = new BigNumber('0.5');

        // Negative/NaN/Infinity/zero?
        if (s !== 1 || !c || !c[0]) {
          return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
        }

        // Initial estimate.
        s = Math.sqrt(+valueOf(x));

        // Math.sqrt underflow/overflow?
        // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
        if (s == 0 || s == 1 / 0) {
          n = coeffToString(c);
          if ((n.length + e) % 2 == 0) n += '0';
          s = Math.sqrt(+n);
          e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

          if (s == 1 / 0) {
            n = '5e' + e;
          } else {
            n = s.toExponential();
            n = n.slice(0, n.indexOf('e') + 1) + e;
          }

          r = new BigNumber(n);
        } else {
          r = new BigNumber(s + '');
        }

        // Check for zero.
        // r could be zero if MIN_EXP is changed after the this value was created.
        // This would cause a division by zero (x/t) and hence Infinity below, which would cause
        // coeffToString to throw.
        if (r.c[0]) {
          e = r.e;
          s = e + dp;
          if (s < 3) s = 0;

          // Newton-Raphson iteration.
          for (; ;) {
            t = r;
            r = half.times(t.plus(div(x, t, dp, 1)));

            if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

              // The exponent of r may here be one less than the final result exponent,
              // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
              // are indexed correctly.
              if (r.e < e) --s;
              n = n.slice(s - 3, s + 1);

              // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
              // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
              // iteration.
              if (n == '9999' || !rep && n == '4999') {

                // On the first iteration only, check to see if rounding up gives the
                // exact result as the nines may infinitely repeat.
                if (!rep) {
                  round(t, t.e + DECIMAL_PLACES + 2, 0);

                  if (t.times(t).eq(x)) {
                    r = t;
                    break;
                  }
                }

                dp += 4;
                s += 4;
                rep = 1;
              } else {

                // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                // result. If not, then there are further digits and m will be truthy.
                if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                  // Truncate to the first rounding digit.
                  round(r, r.e + DECIMAL_PLACES + 2, 1);
                  m = !r.times(r).eq(x);
                }

                break;
              }
            }
          }
        }

        return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
      };


      /*
       * Return a string representing the value of this BigNumber in exponential notation and
       * rounded using ROUNDING_MODE to dp fixed decimal places.
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       */
      P.toExponential = function (dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp++;
        }
        return format(this, dp, rm, 1);
      };


      /*
       * Return a string representing the value of this BigNumber in fixed-point notation rounding
       * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
       *
       * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
       * but e.g. (-0.00001).toFixed(0) is '-0'.
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       */
      P.toFixed = function (dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp = dp + this.e + 1;
        }
        return format(this, dp, rm);
      };


      /*
       * Return a string representing the value of this BigNumber in fixed-point notation rounded
       * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
       * of the format or FORMAT object (see BigNumber.set).
       *
       * The formatting object may contain some or all of the properties shown below.
       *
       * FORMAT = {
       *   prefix: '',
       *   groupSize: 3,
       *   secondaryGroupSize: 0,
       *   groupSeparator: ',',
       *   decimalSeparator: '.',
       *   fractionGroupSize: 0,
       *   fractionGroupSeparator: '\xA0',      // non-breaking space
       *   suffix: ''
       * };
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       * [format] {object} Formatting options. See FORMAT pbject above.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       * '[BigNumber Error] Argument not an object: {format}'
       */
      P.toFormat = function (dp, rm, format) {
        var str,
          x = this;

        if (format == null) {
          if (dp != null && rm && typeof rm == 'object') {
            format = rm;
            rm = null;
          } else if (dp && typeof dp == 'object') {
            format = dp;
            dp = rm = null;
          } else {
            format = FORMAT;
          }
        } else if (typeof format != 'object') {
          throw Error
            (bignumberError + 'Argument not an object: ' + format);
        }

        str = x.toFixed(dp, rm);

        if (x.c) {
          var i,
            arr = str.split('.'),
            g1 = +format.groupSize,
            g2 = +format.secondaryGroupSize,
            groupSeparator = format.groupSeparator || '',
            intPart = arr[0],
            fractionPart = arr[1],
            isNeg = x.s < 0,
            intDigits = isNeg ? intPart.slice(1) : intPart,
            len = intDigits.length;

          if (g2) {
            i = g1;
            g1 = g2;
            g2 = i;
            len -= i;
          }

          if (g1 > 0 && len > 0) {
            i = len % g1 || g1;
            intPart = intDigits.substr(0, i);
            for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
            if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
            if (isNeg) intPart = '-' + intPart;
          }

          str = fractionPart
           ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
            ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
             '$&' + (format.fractionGroupSeparator || ''))
            : fractionPart)
           : intPart;
        }

        return (format.prefix || '') + str + (format.suffix || '');
      };


      /*
       * Return an array of two BigNumbers representing the value of this BigNumber as a simple
       * fraction with an integer numerator and an integer denominator.
       * The denominator will be a positive non-zero value less than or equal to the specified
       * maximum denominator. If a maximum denominator is not specified, the denominator will be
       * the lowest value necessary to represent the number exactly.
       *
       * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
       *
       * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
       */
      P.toFraction = function (md) {
        var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
          x = this,
          xc = x.c;

        if (md != null) {
          n = new BigNumber(md);

          // Throw if md is less than one or is not an integer, unless it is Infinity.
          if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
            throw Error
              (bignumberError + 'Argument ' +
                (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
          }
        }

        if (!xc) return new BigNumber(x);

        d = new BigNumber(ONE);
        n1 = d0 = new BigNumber(ONE);
        d1 = n0 = new BigNumber(ONE);
        s = coeffToString(xc);

        // Determine initial denominator.
        // d is a power of 10 and the minimum max denominator that specifies the value exactly.
        e = d.e = s.length - x.e - 1;
        d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
        md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

        exp = MAX_EXP;
        MAX_EXP = 1 / 0;
        n = new BigNumber(s);

        // n0 = d1 = 0
        n0.c[0] = 0;

        for (; ;)  {
          q = div(n, d, 0, 1);
          d2 = d0.plus(q.times(d1));
          if (d2.comparedTo(md) == 1) break;
          d0 = d1;
          d1 = d2;
          n1 = n0.plus(q.times(d2 = n1));
          n0 = d2;
          d = n.minus(q.times(d2 = d));
          n = d2;
        }

        d2 = div(md.minus(d0), d1, 0, 1);
        n0 = n0.plus(d2.times(n1));
        d0 = d0.plus(d2.times(d1));
        n0.s = n1.s = x.s;
        e = e * 2;

        // Determine which fraction is closer to x, n0/d0 or n1/d1
        r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
            div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

        MAX_EXP = exp;

        return r;
      };


      /*
       * Return the value of this BigNumber converted to a number primitive.
       */
      P.toNumber = function () {
        return +valueOf(this);
      };


      /*
       * Return a string representing the value of this BigNumber rounded to sd significant digits
       * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
       * necessary to represent the integer part of the value in fixed-point notation, then use
       * exponential notation.
       *
       * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
       */
      P.toPrecision = function (sd, rm) {
        if (sd != null) intCheck(sd, 1, MAX);
        return format(this, sd, rm, 2);
      };


      /*
       * Return a string representing the value of this BigNumber in base b, or base 10 if b is
       * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
       * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
       * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
       * TO_EXP_NEG, return exponential notation.
       *
       * [b] {number} Integer, 2 to ALPHABET.length inclusive.
       *
       * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
       */
      P.toString = function (b) {
        var str,
          n = this,
          s = n.s,
          e = n.e;

        // Infinity or NaN?
        if (e === null) {
          if (s) {
            str = 'Infinity';
            if (s < 0) str = '-' + str;
          } else {
            str = 'NaN';
          }
        } else {
          if (b == null) {
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS
             ? toExponential(coeffToString(n.c), e)
             : toFixedPoint(coeffToString(n.c), e, '0');
          } else if (b === 10 && alphabetHasNormalDecimalDigits) {
            n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
            str = toFixedPoint(coeffToString(n.c), n.e, '0');
          } else {
            intCheck(b, 2, ALPHABET.length, 'Base');
            str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
          }

          if (s < 0 && n.c[0]) str = '-' + str;
        }

        return str;
      };


      /*
       * Return as toString, but do not accept a base argument, and include the minus sign for
       * negative zero.
       */
      P.valueOf = P.toJSON = function () {
        return valueOf(this);
      };


      P._isBigNumber = true;

      P[Symbol.toStringTag] = 'BigNumber';

      // Node.js v10.12.0+
      P[Symbol.for('nodejs.util.inspect.custom')] = P.valueOf;

      if (configObject != null) BigNumber.set(configObject);

      return BigNumber;
    }


    // PRIVATE HELPER FUNCTIONS

    // These functions don't need access to variables,
    // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


    function bitFloor(n) {
      var i = n | 0;
      return n > 0 || n === i ? i : i - 1;
    }


    // Return a coefficient array as a string of base 10 digits.
    function coeffToString(a) {
      var s, z,
        i = 1,
        j = a.length,
        r = a[0] + '';

      for (; i < j;) {
        s = a[i++] + '';
        z = LOG_BASE - s.length;
        for (; z--; s = '0' + s);
        r += s;
      }

      // Determine trailing zeros.
      for (j = r.length; r.charCodeAt(--j) === 48;);

      return r.slice(0, j + 1 || 1);
    }


    // Compare the value of BigNumbers x and y.
    function compare(x, y) {
      var a, b,
        xc = x.c,
        yc = y.c,
        i = x.s,
        j = y.s,
        k = x.e,
        l = y.e;

      // Either NaN?
      if (!i || !j) return null;

      a = xc && !xc[0];
      b = yc && !yc[0];

      // Either zero?
      if (a || b) return a ? b ? 0 : -j : i;

      // Signs differ?
      if (i != j) return i;

      a = i < 0;
      b = k == l;

      // Either Infinity?
      if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

      // Compare exponents.
      if (!b) return k > l ^ a ? 1 : -1;

      j = (k = xc.length) < (l = yc.length) ? k : l;

      // Compare digit by digit.
      for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

      // Compare lengths.
      return k == l ? 0 : k > l ^ a ? 1 : -1;
    }


    /*
     * Check that n is a primitive number, an integer, and in range, otherwise throw.
     */
    function intCheck(n, min, max, name) {
      if (n < min || n > max || n !== mathfloor(n)) {
        throw Error
         (bignumberError + (name || 'Argument') + (typeof n == 'number'
           ? n < min || n > max ? ' out of range: ' : ' not an integer: '
           : ' not a primitive number: ') + String(n));
      }
    }


    // Assumes finite n.
    function isOdd(n) {
      var k = n.c.length - 1;
      return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
    }


    function toExponential(str, e) {
      return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
       (e < 0 ? 'e' : 'e+') + e;
    }


    function toFixedPoint(str, e, z) {
      var len, zs;

      // Negative exponent?
      if (e < 0) {

        // Prepend zeros.
        for (zs = z + '.'; ++e; zs += z);
        str = zs + str;

      // Positive exponent
      } else {
        len = str.length;

        // Append zeros.
        if (++e > len) {
          for (zs = z, e -= len; --e; zs += z);
          str += zs;
        } else if (e < len) {
          str = str.slice(0, e) + '.' + str.slice(e);
        }
      }

      return str;
    }


    // EXPORT


    var BigNumber = clone();

    const inputNumberWrapClass = getPrefixCls('input-number-wrap');
    const inputNumberClass = getPrefixCls('input-number');
    const iconClass = getPrefixCls('input-number-icon');
    const numberHandlerWrapClass = getPrefixCls('input-number-handler-wrap');
    const upSVG = getSDSVG(_upSVG, {
        width: '1em',
        height: '1em'
    });
    const downSVG$1 = getSDSVG(_downSVG, {
        width: '1em',
        height: '1em'
    });
    class InputNumber extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            step: { type: Number, optional: true },
            defaultValue: { type: Number, optional: true },
            value: { type: Number, optional: true },
            size: { type: String, optional: true },
            onFocus: { type: Function, optional: true },
            onBlur: { type: Function, optional: true },
            onChange: { type: Function, optional: true },
            max: { type: Number, optional: true },
            min: { type: Number, optional: true },
            placeholder: { type: String, optional: true },
            disabled: { type: Boolean, optional: true },
            bordered: { type: Boolean, optional: true },
            autoFocus: { type: Boolean, optional: true },
            changeOnBlur: { type: Boolean, optional: true },
            controls: { type: Boolean, optional: true },
            decimalSeparator: { type: String, optional: true },
            precision: { type: Number, optional: true },
            formatter: { type: Function, optional: true },
            parser: { type: Function, optional: true },
            keyboard: { type: Boolean, optional: true },
            readonly: { type: Boolean, optional: true },
            stringMode: { type: Boolean, optional: true },
            onPressEnter: { type: Function, optional: true },
            onStep: { type: Function, optional: true },
            ...baseProps
        };
        static defaultProps = {
            autoFocus: false,
            changeOnBlur: true,
            controls: true,
            keyboard: true,
            step: 1,
            max: Number.MAX_SAFE_INTEGER,
            min: Number.MIN_SAFE_INTEGER
        };
        static components = { Input };
        static inputTemplate = `
<span t-att-class="getClasses()">
    <Input className="" ref="inputRef" onFocus.bind="onFocus" onBlur.bind="onBlur" 
        onKeyDown.bind="onKeyDown"
        placeholder="props.placeholder"
        readonly="props.readonly"
        onPressEnter="props.onPressEnter"
        value="controllableState.state.value" onChange.bind="onchangeValue"
        disabled="props.disabled"
        size="props.size"
        bordered="false"
        slots="filterSlots('ix')"
    />
    <t t-if="showControls()">
        <t t-set="iconClass" t-value="renderIconClasses()"/>
        <span class="${numberHandlerWrapClass}" t-ref="handlerRef" t-on-click="onClickWrap">
            <span t-att-class="iconClass.increase" t-on-click="(event) => this.onStep('up', event)">
                <t t-slot="upIcon">
                    ${upSVG}
                </t>
            </span>
            <span t-att-class="iconClass.decrease" t-on-click="(event) => this.onStep('down', event)">
                <t t-slot="downIcon">
                    ${downSVG$1}
                </t>
            </span>
        </span>
    </t>    
</span>
`;
        static template = owl.xml `
<t t-if="hasAddon()">
    <span class="${inputNumberWrapClass}">
        <t t-if="props.slots.addonBefore">
            <span class="${inputNumberWrapClass}-addon ${inputNumberClass}-addon-before">
                <t t-slot="addonBefore"/>
            </span>
        </t>
        ${InputNumber.inputTemplate}
        <t t-if="props.slots.addonAfter">
            <span class="${inputNumberWrapClass}-addon ${inputNumberClass}-prefix">
                <t t-slot="addonAfter"/>
            </span>
        </t>
    </span>
</t>
<t t-else="">
    ${InputNumber.inputTemplate}
</t>
    `;
        state = owl.useState({
            focused: false
        });
        controllableState = useControllableState(this.props, {
            value: this.props.defaultValue ? this.precisionValue(BigNumber(this.props.defaultValue)) : ''
        }, (val) => `${val}`);
        inputRef = { current: undefined };
        /**
         * 判断是否有前置、后置部分
         */
        hasAddon() {
            const { slots } = this.props;
            return !!(slots?.addonBefore || slots?.addonAfter);
        }
        /**
         * 过滤掉slots
         * @param type 如果是addon，则过滤掉suffix、prefix，如果是ix，则过滤掉addonBefore、addonAfter
         * @protected
         */
        filterSlots(type) {
            if (this.props.slots) {
                return omit(this.props.slots, type === 'addon' ? ['suffix', 'prefix'] : ['addonBefore', 'addonAfter']);
            }
        }
        /**
         * 是否显示加减按钮
         * @protected
         */
        showControls() {
            return !!this.props.controls && !this.props.disabled;
        }
        focus() {
            this.state.focused = true;
        }
        /**
         * 获取焦点回调
         * @param event
         * @protected
         */
        onFocus(event) {
            this.focus();
            const { onFocus } = this.props;
            onFocus?.(event);
        }
        blur() {
            const { changeOnBlur } = this.props;
            this.state.focused = false;
            if (changeOnBlur) {
                this.onchangeValue(this.getValueNotOutOfRange(this.controllableState.state.value));
            }
        }
        /**
         * 失去焦点回调，如果changeOnBlur为true，则在失去焦点时触发onChange
         * @param event
         * @protected
         */
        onBlur(event) {
            this.blur();
            const { onBlur, changeOnBlur } = this.props;
            onBlur?.(event);
        }
        /**
         * 键盘按下回调，如果keyboard为true，则可以使用上下键控制数字增减
         * @param event
         * @protected
         */
        onKeyDown(event) {
            const { keyboard } = this.props;
            if (keyboard) {
                switch (event.key.toLowerCase()) {
                    case 'arrowup':
                        event.preventDefault();
                        this.increaseOrDecrease(true, event);
                        break;
                    case 'arrowdown':
                        event.preventDefault();
                        this.increaseOrDecrease(false, event);
                        break;
                }
            }
        }
        /**
         * 点击加减按钮回调
         * @param type up为加，down为减
         * @param event
         * @protected
         */
        onStep(type, event) {
            const { onStep } = this.props;
            const oldValue = this.controllableState.state.value;
            this.increaseOrDecrease(type === 'up', event);
            onStep?.(Number(oldValue), { offset: this.props.step, type });
        }
        /**
         * 点击外层wrap回调，聚焦input
         * @protected
         */
        onClickWrap() {
            this.inputRef.current?.focus();
        }
        /**
         * 精确数字小数点并返回对应的字符串
         * @param bn 值的BigNumber实例
         * @protected
         */
        precisionValue(bn) {
            const { precision } = this.props;
            return precision ? bn.toFixed(precision) : bn.toFixed();
        }
        /**
         * 输入框值改变回调
         * @param value
         * @protected
         */
        onchangeValue(value) {
            const { stringMode } = this.props;
            let stringValue = value;
            if (value !== '') {
                let bn = BigNumber(this.parse(value));
                bn = bn.isNaN() ? BigNumber('0') : bn;
                stringValue = this.precisionValue(bn);
            }
            this.controllableState.setState({
                value: this.formatValue(stringValue)
            });
            this.props.onChange?.(stringMode ? stringValue : Number(stringValue));
        }
        /**
         * 获取不超出范围的值，根据value值和max、min值判断
         * @param value
         * @protected
         */
        getValueNotOutOfRange(value) {
            if (value === '') {
                return '';
            }
            const { max, min } = this.props;
            let bn = BigNumber(value);
            const v = bn.isNaN() ? BigNumber('0') : bn;
            if (v.isNaN() || v.isGreaterThan(max)) {
                return max.toString();
            }
            if (v.isNaN() || v.isLessThan(min)) {
                return min.toString();
            }
            return v.toFixed();
        }
        /**
         * 是否允许增加或减少
         * @param isIncrease 加true，减false
         * @protected
         */
        enableIncreaseOrDecrease(isIncrease) {
            const { min, max } = this.props;
            const { value } = this.controllableState.state;
            const bn = BigNumber(value || '0');
            if (isIncrease && max !== undefined) {
                return bn.isLessThan(max);
            }
            if (!isIncrease && min !== undefined) {
                return bn.isGreaterThan(min);
            }
            return true;
        }
        /**
         * 增加或减少value值
         * @param isIncrease 加true，减false
         * @param event
         * @protected
         */
        increaseOrDecrease(isIncrease, event) {
            event?.stopPropagation();
            event?.preventDefault();
            if (!this.enableIncreaseOrDecrease(isIncrease)) {
                return;
            }
            const { step } = this.props;
            const { value } = this.controllableState.state;
            const bn = BigNumber(value || '0');
            const newValue = isIncrease ? bn.plus(step) : bn.minus(step);
            this.onchangeValue(this.getValueNotOutOfRange(newValue.toFixed()));
        }
        getClasses() {
            return classNames(inputNumberClass, this.props.className, {
                [`${inputNumberClass}-focused`]: this.state.focused,
                [`${inputNumberClass}-disabled`]: !!this.props.disabled,
                [`${inputNumberClass}-borderless`]: this.props.bordered === false
            });
        }
        renderIconClasses() {
            return {
                increase: classNames(iconClass, {
                    [`${iconClass}-disabled`]: !this.enableIncreaseOrDecrease(true)
                }),
                decrease: classNames(iconClass, {
                    [`${iconClass}-disabled`]: !this.enableIncreaseOrDecrease(false)
                })
            };
        }
        /**
         * 格式化value值，如果有formatter，则使用formatter格式化
         * @param value
         * @protected
         */
        formatValue(value) {
            const { decimalSeparator, formatter } = this.props;
            if (decimalSeparator) {
                // 替换.为decimalSeparator
                value = value.replace(/\./g, decimalSeparator);
            }
            if (formatter) {
                value = formatter(value);
            }
            return value;
        }
        /**
         * 解析value值，如果有parser，则使用parser解析
         * @param value
         * @protected
         */
        parse(value) {
            const { decimalSeparator, parser } = this.props;
            if (decimalSeparator) {
                // 替换decimalSeparator为. decimalSeparator可能为.或者其他
                value = value.replace(new RegExp(decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '.');
            }
            if (parser) {
                value = parser(value);
            }
            return value;
        }
        setup() {
            useImperativeHandle(() => ({
                focus: this.focus.bind(this),
                blur: this.blur.bind(this)
            }), () => []);
            owl.useEffect(() => {
                if (this.props.autoFocus) {
                    this.inputRef.current?.focus();
                }
            }, () => [this.inputRef.current]);
        }
    }

    /**
     * 返回指定元素实时的宽高
     * @param targetRefName
     */
    const useSize = (targetRefName) => {
        const targetRef = owl.useRef(targetRefName);
        const state = owl.useState({
            width: undefined,
            height: undefined,
        });
        owl.useEffect(() => {
            if (targetRef.el) {
                const resizeObserver = new ResizeObserver((entries) => {
                    entries.forEach((entry) => {
                        const { clientWidth, clientHeight } = entry.target;
                        state.width = clientWidth;
                        state.height = clientHeight;
                    });
                });
                resizeObserver.observe(targetRef.el);
                return () => {
                    resizeObserver.disconnect();
                };
            }
        }, () => [targetRef.el]);
        return state;
    };

    const isObject = (value) => value !== null && typeof value === 'object';
    const isNumber = (value) => typeof value === 'number';

    const useEventListener = (targetRef, eventName, handler, eventParams) => {
        const comp = owl.useComponent();
        owl.useEffect(() => {
            if (targetRef.el) {
                const listener = (event) => handler.call(comp, event);
                targetRef.el?.addEventListener(eventName, listener, eventParams);
                return () => targetRef.el?.removeEventListener(eventName, listener, eventParams);
            }
        }, () => [targetRef.el]);
    };

    const VirtualListClass = getPrefixCls('vir-list');
    const VirtualListWrapperClass = getPrefixCls('vir-list-wrapper');
    class VirtualList extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            list: { type: Array },
            height: { type: Number, optional: true },
            itemHeight: { type: [Number, Function] },
            overscan: { type: Number, optional: true },
            onScroll: { type: Function, optional: true },
            onRendered: { type: Function, optional: true },
            ...baseProps
        };
        static defaultProps = {
            overscan: 5
        };
        static template = owl.xml `
<div t-att-class="getClass()" t-ref="container" t-att-style="getStyle()">
    <div t-ref="wrapper" t-att-style="state.wrapperStyle" class="${VirtualListWrapperClass}">
        <t t-foreach="state.targetList" t-as="target" t-key="target.index">
            <t t-slot="item" data="target.data" index="target.index" style="target.style"/>
        </t>
    </div>
</div>   
    `;
        containerRef = owl.useRef('container');
        wrapperRef = owl.useRef('wrapper');
        size = useSize('container');
        state = owl.useState({
            renderTriggerByEffect: false,
            scrollTriggerByScrollToFunc: false,
            targetList: [],
            wrapperStyle: undefined,
            containerHeight: 0
        });
        getClass() {
            return classNames(VirtualListClass, this.props.className);
        }
        getStyle() {
            const { height } = this.props;
            const style = {
                overflow: 'auto',
                'overflow-anchor': 'none'
            };
            // 如果有指定高度，则设置max-height，否则height设为100%
            // max-height可以达到在不需要滚动时，高度自适应的效果
            if (isNumber(height)) {
                style['max-height'] = `${height}px`;
            }
            else {
                style['height'] = '100%';
            }
            return stylesToString(style);
        }
        getTotalHeight() {
            const { itemHeight } = this.props;
            if (isNumber(itemHeight)) {
                // 如果是固定高度，则直接计算
                return this.props.list.length * itemHeight;
            }
            let sum = 0;
            for (let i = 0; i < this.props.list.length; i++) {
                const item = this.props.list[i];
                const height = itemHeight(i, item);
                sum += height;
            }
            return sum;
        }
        /**
         * 获取当前的数据偏移量，注：指向的下一个数据索引
         * @param scrollTop 滚动条距离顶部的距离
         * @protected
         */
        getOffset(scrollTop) {
            const { itemHeight } = this.props;
            if (isNumber(itemHeight)) {
                // 如果是固定高度，则直接计算
                return Math.ceil(scrollTop / itemHeight);
            }
            let sum = 0;
            let offset = 0;
            for (let i = 0; i < this.props.list.length; i++) {
                const item = this.props.list[i];
                const height = itemHeight(i, item);
                sum += height;
                if (sum >= scrollTop) {
                    offset = i;
                    break;
                }
            }
            return offset + 1;
        }
        /**
         * 获取可视区域内的数据数量
         * @param clientHeight
         * @param fromIndex
         * @protected
         */
        getVisibleCount(clientHeight, fromIndex) {
            const { itemHeight } = this.props;
            if (isNumber(itemHeight)) {
                // 如果是固定高度，则直接计算
                return Math.ceil(clientHeight / itemHeight);
            }
            let sum = 0;
            let endIndex = 0;
            for (let i = fromIndex; i < this.props.list.length; i++) {
                const item = this.props.list[i];
                const height = itemHeight(i, item);
                sum += height;
                endIndex = i;
                if (sum >= clientHeight) {
                    break;
                }
            }
            return endIndex - fromIndex;
        }
        /**
         * 计算指定索引的数据距离顶部的距离
         * @param index
         * @protected
         */
        getDistanceTop(index) {
            const { itemHeight } = this.props;
            if (isNumber(itemHeight)) {
                // 如果是固定高度，则直接计算
                return index * itemHeight;
            }
            let sum = 0;
            for (let i = 0; i < index; i++) {
                const item = this.props.list[i];
                const height = itemHeight(i, item);
                sum += height;
            }
            return sum;
        }
        /**
         * 计算可视区域内的数据
         * @protected
         */
        calculateRange() {
            const { overscan, itemHeight } = this.props;
            const container = this.containerRef.el;
            if (container) {
                const { scrollTop, clientHeight } = container;
                const offset = this.getOffset(scrollTop);
                const visibleCount = this.getVisibleCount(clientHeight, offset);
                const start = Math.max(0, offset - overscan);
                const end = Math.min(this.props.list.length, offset + visibleCount + overscan);
                const offsetTop = this.getDistanceTop(start);
                const totalHeight = this.getTotalHeight();
                this.state.containerHeight = clientHeight;
                this.state.wrapperStyle = stylesToString({
                    height: `${totalHeight - offsetTop}px`,
                    'margin-top': `${offsetTop}px`
                });
                this.state.targetList = this.props.list.slice(start, end).map((data, index) => ({
                    index: start + index,
                    data,
                    style: stylesToString({
                        height: isNumber(itemHeight) ? `${itemHeight}px` : `${itemHeight(start + index, data)}px`
                    })
                }));
            }
        }
        scrollTo(index) {
            if (this.containerRef.el) {
                this.state.scrollTriggerByScrollToFunc = true;
                this.containerRef.el.scrollTop = this.getDistanceTop(index);
                this.calculateRange();
            }
        }
        ;
        setup() {
            useImperativeHandle(() => ({
                scrollTo: this.scrollTo.bind(this)
            }), () => [this.props]);
            useEventListener(this.containerRef, 'scroll', (event) => {
                if (this.state.scrollTriggerByScrollToFunc) {
                    // 如果是 scrollTo 方法触发的滚动，则不再触发计算
                    this.state.scrollTriggerByScrollToFunc = false;
                    return;
                }
                event.preventDefault();
                this.calculateRange();
                let position = 'mid';
                if (event.currentTarget.scrollTop === 0) {
                    position = 'start';
                }
                else if (event.currentTarget.scrollHeight - event.currentTarget.scrollTop === this.state.containerHeight) {
                    // 可滚动总高度 - 滚动条距离顶部的距离 和 容器高度相等表示滚动到底部
                    position = 'end';
                }
                this.props.onScroll?.(event, position);
            });
            owl.useEffect(() => {
                if (this.state.renderTriggerByEffect) {
                    // 仅在受effect触发时才触发onRendered
                    this.props.onRendered?.();
                }
                this.state.renderTriggerByEffect = false;
            }, () => [this.state.targetList]);
            owl.useEffect(() => {
                this.state.renderTriggerByEffect = true;
                this.calculateRange();
            }, () => [this.size.width, this.size.height, this.props.list]);
        }
    }

    var _emptySVG = "<svg viewBox=\"0 0 64 41\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(0 1)\" fill=\"none\" fill-rule=\"evenodd\"><ellipse fill=\"#f5f5f5\" cx=\"32\" cy=\"33\" rx=\"32\" ry=\"7\"/><g fill-rule=\"nonzero\" stroke=\"#d9d9d9\"><path d=\"M55 12.76 44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z\"/><path d=\"M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z\" fill=\"#fafafa\"/></g></g></svg>";

    getSDSVG(_emptySVG, {
        width: '64',
        height: '41'
    });
    const listClass = getPrefixCls('list');
    const listHeadClass = getPrefixCls('list-head');
    const listContainerClass = getPrefixCls('list-container');
    const listFooterClass = getPrefixCls('list-footer');
    const listItemClass = getPrefixCls('list-item');
    const vrListItemClass = getPrefixCls('vr-list-item');
    class List extends owl.Component {
        static components = { VirtualList };
        static props = {
            className: { type: String, optional: true },
            itemClassName: { type: Function, optional: true },
            bordered: { type: Boolean, optional: true },
            size: { type: String, optional: true },
            dataSource: { type: Array, optional: true },
            virtual: { type: Boolean, optional: true },
            height: { type: Number, optional: true },
            itemHeight: { type: [Number, Function], optional: true },
            onScroll: { type: Function, optional: true },
            onRendered: { type: Function, optional: true },
            ...baseProps
        };
        static defaultProps = {
            dataSource: [],
            bordered: false
        };
        static template = owl.xml `
<div t-att-class="getClasses()">
    <t t-if="hasHeader()">
        <div class="${listHeadClass}">
            <t t-slot="header"/>
        </div>
    </t>
    
    <div class="${listContainerClass}">
        <t t-if="showItems()">
            <t t-if="props.virtual">
                <VirtualList ref="virRef" onScroll="props.onScroll" onRendered="props.onRendered" list="props.dataSource" itemHeight="props.itemHeight" height="props.height">
                    <t t-set-slot="item" t-slot-scope="scope">
                        <div t-att-class="getItemClasses(scope.data, scope.index)" t-att-style="scope.style">
                            <t t-slot="item" t-props="scope"/>
                        </div>
                    </t>
                </VirtualList>
            </t>
            <div t-else="" t-att-class="getItemClasses(item, item_index)" t-foreach="props.dataSource" t-as="item" t-key="item_index">
                <t t-slot="item" data="item" index="item_index"/>
            </div>
        </t>
    </div>
    
    <t t-if="hasFooter()">
        <div class="${listFooterClass}">
            <t t-slot="footer"/>
        </div>
    </t>
</div>   
    `;
        state = owl.useState({});
        virRef = useCompRef();
        hasHeader() {
            return !!this.props.slots?.header;
        }
        hasFooter() {
            return !!this.props.slots?.footer;
        }
        showItems() {
            return !!this.props.slots?.item;
        }
        getClasses() {
            const { className, bordered, size, virtual } = this.props;
            const hasAnySlot = this.hasFooter() || this.hasHeader() || this.showItems();
            return classNames(className, listClass, {
                [`${listClass}-borderless`]: !bordered || !hasAnySlot,
                [`${listClass}-sm`]: size === 'small',
                [`${listClass}-lg`]: size === 'large',
                [`${listClass}-vt`]: !!virtual
            });
        }
        getItemClasses(item, index) {
            return classNames(listItemClass, this.props.itemClassName?.(item, index), {
                [vrListItemClass]: !!this.props.virtual
            });
        }
        setup() {
            useImperativeHandle(() => ({
                scrollTo: (index) => this.virRef.current?.scrollTo(index)
            }), () => []);
        }
    }

    var _searchSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M909.6 854.5 649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6c3.2 3.2 8.4 3.2 11.6 0l43.6-43.5c3.2-3.2 3.2-8.4 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z\"/></svg>";

    var _loadingSVG = "<svg viewBox=\"0 0 1024 1024\" data-icon=\"loading\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z\"/></svg>";

    var _checkSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z\"/></svg>";

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    var vendorPrefix;
    var jsCssMap = {
      Webkit: '-webkit-',
      Moz: '-moz-',
      // IE did it wrong again ...
      ms: '-ms-',
      O: '-o-'
    };
    function getVendorPrefix() {
      if (vendorPrefix !== undefined) {
        return vendorPrefix;
      }
      vendorPrefix = '';
      var style = document.createElement('p').style;
      var testProp = 'Transform';
      for (var key in jsCssMap) {
        if (key + testProp in style) {
          vendorPrefix = key;
        }
      }
      return vendorPrefix;
    }
    function getTransitionName() {
      return getVendorPrefix() ? "".concat(getVendorPrefix(), "TransitionProperty") : 'transitionProperty';
    }
    function getTransformName() {
      return getVendorPrefix() ? "".concat(getVendorPrefix(), "Transform") : 'transform';
    }
    function setTransitionProperty(node, value) {
      var name = getTransitionName();
      if (name) {
        node.style[name] = value;
        if (name !== 'transitionProperty') {
          node.style.transitionProperty = value;
        }
      }
    }
    function setTransform(node, value) {
      var name = getTransformName();
      if (name) {
        node.style[name] = value;
        if (name !== 'transform') {
          node.style.transform = value;
        }
      }
    }
    function getTransitionProperty(node) {
      return node.style.transitionProperty || node.style[getTransitionName()];
    }
    function getTransformXY(node) {
      var style = window.getComputedStyle(node, null);
      var transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName());
      if (transform && transform !== 'none') {
        var matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');
        return {
          x: parseFloat(matrix[12] || matrix[4], 0),
          y: parseFloat(matrix[13] || matrix[5], 0)
        };
      }
      return {
        x: 0,
        y: 0
      };
    }
    var matrix2d = /matrix\((.*)\)/;
    var matrix3d = /matrix3d\((.*)\)/;
    function setTransformXY(node, xy) {
      var style = window.getComputedStyle(node, null);
      var transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName());
      if (transform && transform !== 'none') {
        var arr;
        var match2d = transform.match(matrix2d);
        if (match2d) {
          match2d = match2d[1];
          arr = match2d.split(',').map(function (item) {
            return parseFloat(item, 10);
          });
          arr[4] = xy.x;
          arr[5] = xy.y;
          setTransform(node, "matrix(".concat(arr.join(','), ")"));
        } else {
          var match3d = transform.match(matrix3d)[1];
          arr = match3d.split(',').map(function (item) {
            return parseFloat(item, 10);
          });
          arr[12] = xy.x;
          arr[13] = xy.y;
          setTransform(node, "matrix3d(".concat(arr.join(','), ")"));
        }
      } else {
        setTransform(node, "translateX(".concat(xy.x, "px) translateY(").concat(xy.y, "px) translateZ(0)"));
      }
    }

    var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
    var getComputedStyleX;

    // https://stackoverflow.com/a/3485654/3040605
    function forceRelayout(elem) {
      var originalStyle = elem.style.display;
      elem.style.display = 'none';
      elem.offsetHeight; // eslint-disable-line
      elem.style.display = originalStyle;
    }
    function css(el, name, v) {
      var value = v;
      if (_typeof(name) === 'object') {
        for (var i in name) {
          if (name.hasOwnProperty(i)) {
            css(el, i, name[i]);
          }
        }
        return undefined;
      }
      if (typeof value !== 'undefined') {
        if (typeof value === 'number') {
          value = "".concat(value, "px");
        }
        el.style[name] = value;
        return undefined;
      }
      return getComputedStyleX(el, name);
    }
    function getClientPosition(elem) {
      var box;
      var x;
      var y;
      var doc = elem.ownerDocument;
      var body = doc.body;
      var docElem = doc && doc.documentElement;
      // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
      box = elem.getBoundingClientRect();

      // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
      // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
      // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

      x = Math.floor(box.left);
      y = Math.floor(box.top);

      // In IE, most of the time, 2 extra pixels are added to the top and left
      // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
      // IE6 standards mode, this border can be overridden by setting the
      // document element's border to zero -- thus, we cannot rely on the
      // offset always being 2 pixels.

      // In quirks mode, the offset can be determined by querying the body's
      // clientLeft/clientTop, but in standards mode, it is found by querying
      // the document element's clientLeft/clientTop.  Since we already called
      // getClientBoundingRect we have already forced a reflow, so it is not
      // too expensive just to query them all.

      // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
      // 窗口边框标准是设 documentElement ,quirks 时设置 body
      // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
      // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
      // 标准 ie 下 docElem.clientTop 就是 border-top
      // ie7 html 即窗口边框改变不了。永远为 2
      // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

      x -= docElem.clientLeft || body.clientLeft || 0;
      y -= docElem.clientTop || body.clientTop || 0;
      return {
        left: x,
        top: y
      };
    }
    function getScroll(w, top) {
      var ret = w["page".concat(top ? 'Y' : 'X', "Offset")];
      var method = "scroll".concat(top ? 'Top' : 'Left');
      if (typeof ret !== 'number') {
        var d = w.document;
        // ie6,7,8 standard mode
        ret = d.documentElement[method];
        if (typeof ret !== 'number') {
          // quirks mode
          ret = d.body[method];
        }
      }
      return ret;
    }
    function getScrollLeft(w) {
      return getScroll(w);
    }
    function getScrollTop(w) {
      return getScroll(w, true);
    }
    function getOffset(el) {
      var pos = getClientPosition(el);
      var doc = el.ownerDocument;
      var w = doc.defaultView || doc.parentWindow;
      pos.left += getScrollLeft(w);
      pos.top += getScrollTop(w);
      return pos;
    }

    /**
     * A crude way of determining if an object is a window
     * @member util
     */
    function isWindow(obj) {
      // must use == for ie8
      /* eslint eqeqeq:0 */
      return obj !== null && obj !== undefined && obj == obj.window;
    }
    function getDocument(node) {
      if (isWindow(node)) {
        return node.document;
      }
      if (node.nodeType === 9) {
        return node;
      }
      return node.ownerDocument;
    }
    function _getComputedStyle(elem, name, cs) {
      var computedStyle = cs;
      var val = '';
      var d = getDocument(elem);
      computedStyle = computedStyle || d.defaultView.getComputedStyle(elem, null);

      // https://github.com/kissyteam/kissy/issues/61
      if (computedStyle) {
        val = computedStyle.getPropertyValue(name) || computedStyle[name];
      }
      return val;
    }
    var _RE_NUM_NO_PX = new RegExp("^(".concat(RE_NUM, ")(?!px)[a-z%]+$"), 'i');
    var RE_POS = /^(top|right|bottom|left)$/;
    var CURRENT_STYLE = 'currentStyle';
    var RUNTIME_STYLE = 'runtimeStyle';
    var LEFT = 'left';
    var PX = 'px';
    function _getComputedStyleIE(elem, name) {
      // currentStyle maybe null
      // http://msdn.microsoft.com/en-us/library/ms535231.aspx
      var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];

      // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
      // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
      // 在 ie 下不对，需要直接用 offset 方式
      // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了

      // From the awesome hack by Dean Edwards
      // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
      // If we're not dealing with a regular pixel number
      // but a number that has a weird ending, we need to convert it to pixels
      // exclude left right for relativity
      if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
        // Remember the original values
        var style = elem.style;
        var left = style[LEFT];
        var rsLeft = elem[RUNTIME_STYLE][LEFT];

        // prevent flashing of content
        elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];

        // Put in the new values to get a computed value out
        style[LEFT] = name === 'fontSize' ? '1em' : ret || 0;
        ret = style.pixelLeft + PX;

        // Revert the changed values
        style[LEFT] = left;
        elem[RUNTIME_STYLE][LEFT] = rsLeft;
      }
      return ret === '' ? 'auto' : ret;
    }
    if (typeof window !== 'undefined') {
      getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
    }
    function getOffsetDirection(dir, option) {
      if (dir === 'left') {
        return option.useCssRight ? 'right' : dir;
      }
      return option.useCssBottom ? 'bottom' : dir;
    }
    function oppositeOffsetDirection(dir) {
      if (dir === 'left') {
        return 'right';
      } else if (dir === 'right') {
        return 'left';
      } else if (dir === 'top') {
        return 'bottom';
      } else if (dir === 'bottom') {
        return 'top';
      }
    }

    // 设置 elem 相对 elem.ownerDocument 的坐标
    function setLeftTop(elem, offset, option) {
      // set position first, in-case top/left are set even on static elem
      if (css(elem, 'position') === 'static') {
        elem.style.position = 'relative';
      }
      var presetH = -999;
      var presetV = -999;
      var horizontalProperty = getOffsetDirection('left', option);
      var verticalProperty = getOffsetDirection('top', option);
      var oppositeHorizontalProperty = oppositeOffsetDirection(horizontalProperty);
      var oppositeVerticalProperty = oppositeOffsetDirection(verticalProperty);
      if (horizontalProperty !== 'left') {
        presetH = 999;
      }
      if (verticalProperty !== 'top') {
        presetV = 999;
      }
      var originalTransition = '';
      var originalOffset = getOffset(elem);
      if ('left' in offset || 'top' in offset) {
        originalTransition = getTransitionProperty(elem) || '';
        setTransitionProperty(elem, 'none');
      }
      if ('left' in offset) {
        elem.style[oppositeHorizontalProperty] = '';
        elem.style[horizontalProperty] = "".concat(presetH, "px");
      }
      if ('top' in offset) {
        elem.style[oppositeVerticalProperty] = '';
        elem.style[verticalProperty] = "".concat(presetV, "px");
      }
      // force relayout
      forceRelayout(elem);
      var old = getOffset(elem);
      var originalStyle = {};
      for (var key in offset) {
        if (offset.hasOwnProperty(key)) {
          var dir = getOffsetDirection(key, option);
          var preset = key === 'left' ? presetH : presetV;
          var off = originalOffset[key] - old[key];
          if (dir === key) {
            originalStyle[dir] = preset + off;
          } else {
            originalStyle[dir] = preset - off;
          }
        }
      }
      css(elem, originalStyle);
      // force relayout
      forceRelayout(elem);
      if ('left' in offset || 'top' in offset) {
        setTransitionProperty(elem, originalTransition);
      }
      var ret = {};
      for (var _key in offset) {
        if (offset.hasOwnProperty(_key)) {
          var _dir = getOffsetDirection(_key, option);
          var _off = offset[_key] - originalOffset[_key];
          if (_key === _dir) {
            ret[_dir] = originalStyle[_dir] + _off;
          } else {
            ret[_dir] = originalStyle[_dir] - _off;
          }
        }
      }
      css(elem, ret);
    }
    function setTransform$1(elem, offset) {
      var originalOffset = getOffset(elem);
      var originalXY = getTransformXY(elem);
      var resultXY = {
        x: originalXY.x,
        y: originalXY.y
      };
      if ('left' in offset) {
        resultXY.x = originalXY.x + offset.left - originalOffset.left;
      }
      if ('top' in offset) {
        resultXY.y = originalXY.y + offset.top - originalOffset.top;
      }
      setTransformXY(elem, resultXY);
    }
    function setOffset(elem, offset, option) {
      if (option.ignoreShake) {
        var oriOffset = getOffset(elem);
        var oLeft = oriOffset.left.toFixed(0);
        var oTop = oriOffset.top.toFixed(0);
        var tLeft = offset.left.toFixed(0);
        var tTop = offset.top.toFixed(0);
        if (oLeft === tLeft && oTop === tTop) {
          return;
        }
      }
      if (option.useCssRight || option.useCssBottom) {
        setLeftTop(elem, offset, option);
      } else if (option.useCssTransform && getTransformName() in document.body.style) {
        setTransform$1(elem, offset);
      } else {
        setLeftTop(elem, offset, option);
      }
    }
    function each(arr, fn) {
      for (var i = 0; i < arr.length; i++) {
        fn(arr[i]);
      }
    }
    function isBorderBoxFn(elem) {
      return getComputedStyleX(elem, 'boxSizing') === 'border-box';
    }
    var BOX_MODELS = ['margin', 'border', 'padding'];
    var CONTENT_INDEX = -1;
    var PADDING_INDEX = 2;
    var BORDER_INDEX = 1;
    var MARGIN_INDEX = 0;
    function swap(elem, options, callback) {
      var old = {};
      var style = elem.style;
      var name;

      // Remember the old values, and insert the new ones
      for (name in options) {
        if (options.hasOwnProperty(name)) {
          old[name] = style[name];
          style[name] = options[name];
        }
      }
      callback.call(elem);

      // Revert the old values
      for (name in options) {
        if (options.hasOwnProperty(name)) {
          style[name] = old[name];
        }
      }
    }
    function getPBMWidth(elem, props, which) {
      var value = 0;
      var prop;
      var j;
      var i;
      for (j = 0; j < props.length; j++) {
        prop = props[j];
        if (prop) {
          for (i = 0; i < which.length; i++) {
            var cssProp = void 0;
            if (prop === 'border') {
              cssProp = "".concat(prop).concat(which[i], "Width");
            } else {
              cssProp = prop + which[i];
            }
            value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
          }
        }
      }
      return value;
    }
    var domUtils = {
      getParent: function getParent(element) {
        var parent = element;
        do {
          if (parent.nodeType === 11 && parent.host) {
            parent = parent.host;
          } else {
            parent = parent.parentNode;
          }
        } while (parent && parent.nodeType !== 1 && parent.nodeType !== 9);
        return parent;
      }
    };
    each(['Width', 'Height'], function (name) {
      domUtils["doc".concat(name)] = function (refWin) {
        var d = refWin.document;
        return Math.max(
        // firefox chrome documentElement.scrollHeight< body.scrollHeight
        // ie standard mode : documentElement.scrollHeight> body.scrollHeight
        d.documentElement["scroll".concat(name)],
        // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
        d.body["scroll".concat(name)], domUtils["viewport".concat(name)](d));
      };
      domUtils["viewport".concat(name)] = function (win) {
        // pc browser includes scrollbar in window.innerWidth
        var prop = "client".concat(name);
        var doc = win.document;
        var body = doc.body;
        var documentElement = doc.documentElement;
        var documentElementProp = documentElement[prop];
        // 标准模式取 documentElement
        // backcompat 取 body
        return doc.compatMode === 'CSS1Compat' && documentElementProp || body && body[prop] || documentElementProp;
      };
    });

    /*
     得到元素的大小信息
     @param elem
     @param name
     @param {String} [extra]  'padding' : (css width) + padding
     'border' : (css width) + padding + border
     'margin' : (css width) + padding + border + margin
     */
    function getWH(elem, name, ex) {
      var extra = ex;
      if (isWindow(elem)) {
        return name === 'width' ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
      } else if (elem.nodeType === 9) {
        return name === 'width' ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
      }
      var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
      var borderBoxValue = name === 'width' ? Math.floor(elem.getBoundingClientRect().width) : Math.floor(elem.getBoundingClientRect().height);
      var isBorderBox = isBorderBoxFn(elem);
      var cssBoxValue = 0;
      if (borderBoxValue === null || borderBoxValue === undefined || borderBoxValue <= 0) {
        borderBoxValue = undefined;
        // Fall back to computed then un computed css if necessary
        cssBoxValue = getComputedStyleX(elem, name);
        if (cssBoxValue === null || cssBoxValue === undefined || Number(cssBoxValue) < 0) {
          cssBoxValue = elem.style[name] || 0;
        }
        // Normalize '', auto, and prepare for extra
        cssBoxValue = Math.floor(parseFloat(cssBoxValue)) || 0;
      }
      if (extra === undefined) {
        extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
      }
      var borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox;
      var val = borderBoxValue || cssBoxValue;
      if (extra === CONTENT_INDEX) {
        if (borderBoxValueOrIsBorderBox) {
          return val - getPBMWidth(elem, ['border', 'padding'], which);
        }
        return cssBoxValue;
      } else if (borderBoxValueOrIsBorderBox) {
        if (extra === BORDER_INDEX) {
          return val;
        }
        return val + (extra === PADDING_INDEX ? -getPBMWidth(elem, ['border'], which) : getPBMWidth(elem, ['margin'], which));
      }
      return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra), which);
    }
    var cssShow = {
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    };

    // fix #119 : https://github.com/kissyteam/kissy/issues/119
    function getWHIgnoreDisplay() {
      for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        args[_key2] = arguments[_key2];
      }
      var val;
      var elem = args[0];
      // in case elem is window
      // elem.offsetWidth === undefined
      if (elem.offsetWidth !== 0) {
        val = getWH.apply(undefined, args);
      } else {
        swap(elem, cssShow, function () {
          val = getWH.apply(undefined, args);
        });
      }
      return val;
    }
    each(['width', 'height'], function (name) {
      var first = name.charAt(0).toUpperCase() + name.slice(1);
      domUtils["outer".concat(first)] = function (el, includeMargin) {
        return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
      };
      var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
      domUtils[name] = function (elem, v) {
        var val = v;
        if (val !== undefined) {
          if (elem) {
            var isBorderBox = isBorderBoxFn(elem);
            if (isBorderBox) {
              val += getPBMWidth(elem, ['padding', 'border'], which);
            }
            return css(elem, name, val);
          }
          return undefined;
        }
        return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
      };
    });
    function mix$1(to, from) {
      for (var i in from) {
        if (from.hasOwnProperty(i)) {
          to[i] = from[i];
        }
      }
      return to;
    }
    var utils = {
      getWindow: function getWindow(node) {
        if (node && node.document && node.setTimeout) {
          return node;
        }
        var doc = node.ownerDocument || node;
        return doc.defaultView || doc.parentWindow;
      },
      getDocument: getDocument,
      offset: function offset(el, value, option) {
        if (typeof value !== 'undefined') {
          setOffset(el, value, option || {});
        } else {
          return getOffset(el);
        }
      },
      isWindow: isWindow,
      each: each,
      css: css,
      clone: function clone(obj) {
        var i;
        var ret = {};
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            ret[i] = obj[i];
          }
        }
        var overflow = obj.overflow;
        if (overflow) {
          for (i in obj) {
            if (obj.hasOwnProperty(i)) {
              ret.overflow[i] = obj.overflow[i];
            }
          }
        }
        return ret;
      },
      mix: mix$1,
      getWindowScrollLeft: function getWindowScrollLeft(w) {
        return getScrollLeft(w);
      },
      getWindowScrollTop: function getWindowScrollTop(w) {
        return getScrollTop(w);
      },
      merge: function merge() {
        var ret = {};
        for (var i = 0; i < arguments.length; i++) {
          utils.mix(ret, i < 0 || arguments.length <= i ? undefined : arguments[i]);
        }
        return ret;
      },
      viewportWidth: 0,
      viewportHeight: 0
    };
    mix$1(utils, domUtils);

    /**
     * 得到会导致元素显示不全的祖先元素
     */
    var getParent = utils.getParent;
    function getOffsetParent(element) {
      if (utils.isWindow(element) || element.nodeType === 9) {
        return null;
      }
      // ie 这个也不是完全可行
      /*
       <div style="width: 50px;height: 100px;overflow: hidden">
       <div style="width: 50px;height: 100px;position: relative;" id="d6">
       元素 6 高 100px 宽 50px<br/>
       </div>
       </div>
       */
      // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
      //  In other browsers it only includes elements with position absolute, relative or
      // fixed, not elements with overflow set to auto or scroll.
      //        if (UA.ie && ieMode < 8) {
      //            return element.offsetParent;
      //        }
      // 统一的 offsetParent 方法
      var doc = utils.getDocument(element);
      var body = doc.body;
      var parent;
      var positionStyle = utils.css(element, 'position');
      var skipStatic = positionStyle === 'fixed' || positionStyle === 'absolute';
      if (!skipStatic) {
        return element.nodeName.toLowerCase() === 'html' ? null : getParent(element);
      }
      for (parent = getParent(element); parent && parent !== body && parent.nodeType !== 9; parent = getParent(parent)) {
        positionStyle = utils.css(parent, 'position');
        if (positionStyle !== 'static') {
          return parent;
        }
      }
      return null;
    }

    var getParent$1 = utils.getParent;
    function isAncestorFixed(element) {
      if (utils.isWindow(element) || element.nodeType === 9) {
        return false;
      }
      var doc = utils.getDocument(element);
      var body = doc.body;
      var parent = null;
      for (parent = getParent$1(element);
      // 修复元素位于 document.documentElement 下导致崩溃问题
      parent && parent !== body && parent !== doc; parent = getParent$1(parent)) {
        var positionStyle = utils.css(parent, 'position');
        if (positionStyle === 'fixed') {
          return true;
        }
      }
      return false;
    }

    /**
     * 获得元素的显示部分的区域
     */
    function getVisibleRectForElement(element, alwaysByViewport) {
      var visibleRect = {
        left: 0,
        right: Infinity,
        top: 0,
        bottom: Infinity
      };
      var el = getOffsetParent(element);
      var doc = utils.getDocument(element);
      var win = doc.defaultView || doc.parentWindow;
      var body = doc.body;
      var documentElement = doc.documentElement;

      // Determine the size of the visible rect by climbing the dom accounting for
      // all scrollable containers.
      while (el) {
        // clientWidth is zero for inline block elements in ie.
        if ((navigator.userAgent.indexOf('MSIE') === -1 || el.clientWidth !== 0) &&
        // body may have overflow set on it, yet we still get the entire
        // viewport. In some browsers, el.offsetParent may be
        // document.documentElement, so check for that too.
        el !== body && el !== documentElement && utils.css(el, 'overflow') !== 'visible') {
          var pos = utils.offset(el);
          // add border
          pos.left += el.clientLeft;
          pos.top += el.clientTop;
          visibleRect.top = Math.max(visibleRect.top, pos.top);
          visibleRect.right = Math.min(visibleRect.right,
          // consider area without scrollBar
          pos.left + el.clientWidth);
          visibleRect.bottom = Math.min(visibleRect.bottom, pos.top + el.clientHeight);
          visibleRect.left = Math.max(visibleRect.left, pos.left);
        } else if (el === body || el === documentElement) {
          break;
        }
        el = getOffsetParent(el);
      }

      // Set element position to fixed
      // make sure absolute element itself don't affect it's visible area
      // https://github.com/ant-design/ant-design/issues/7601
      var originalPosition = null;
      if (!utils.isWindow(element) && element.nodeType !== 9) {
        originalPosition = element.style.position;
        var position = utils.css(element, 'position');
        if (position === 'absolute') {
          element.style.position = 'fixed';
        }
      }
      var scrollX = utils.getWindowScrollLeft(win);
      var scrollY = utils.getWindowScrollTop(win);
      var viewportWidth = utils.viewportWidth(win);
      var viewportHeight = utils.viewportHeight(win);
      var documentWidth = documentElement.scrollWidth;
      var documentHeight = documentElement.scrollHeight;

      // scrollXXX on html is sync with body which means overflow: hidden on body gets wrong scrollXXX.
      // We should cut this ourself.
      var bodyStyle = window.getComputedStyle(body);
      if (bodyStyle.overflowX === 'hidden') {
        documentWidth = win.innerWidth;
      }
      if (bodyStyle.overflowY === 'hidden') {
        documentHeight = win.innerHeight;
      }

      // Reset element position after calculate the visible area
      if (element.style) {
        element.style.position = originalPosition;
      }
      if (alwaysByViewport || isAncestorFixed(element)) {
        // Clip by viewport's size.
        visibleRect.left = Math.max(visibleRect.left, scrollX);
        visibleRect.top = Math.max(visibleRect.top, scrollY);
        visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth);
        visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight);
      } else {
        // Clip by document's size.
        var maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth);
        visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);
        var maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight);
        visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);
      }
      return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
    }

    function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
      var pos = utils.clone(elFuturePos);
      var size = {
        width: elRegion.width,
        height: elRegion.height
      };
      if (overflow.adjustX && pos.left < visibleRect.left) {
        pos.left = visibleRect.left;
      }

      // Left edge inside and right edge outside viewport, try to resize it.
      if (overflow.resizeWidth && pos.left >= visibleRect.left && pos.left + size.width > visibleRect.right) {
        size.width -= pos.left + size.width - visibleRect.right;
      }

      // Right edge outside viewport, try to move it.
      if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
        // 保证左边界和可视区域左边界对齐
        pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
      }

      // Top edge outside viewport, try to move it.
      if (overflow.adjustY && pos.top < visibleRect.top) {
        pos.top = visibleRect.top;
      }

      // Top edge inside and bottom edge outside viewport, try to resize it.
      if (overflow.resizeHeight && pos.top >= visibleRect.top && pos.top + size.height > visibleRect.bottom) {
        size.height -= pos.top + size.height - visibleRect.bottom;
      }

      // Bottom edge outside viewport, try to move it.
      if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
        // 保证上边界和可视区域上边界对齐
        pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
      }
      return utils.mix(pos, size);
    }

    function getRegion(node) {
      var offset;
      var w;
      var h;
      if (!utils.isWindow(node) && node.nodeType !== 9) {
        offset = utils.offset(node);
        w = utils.outerWidth(node);
        h = utils.outerHeight(node);
      } else {
        var win = utils.getWindow(node);
        offset = {
          left: utils.getWindowScrollLeft(win),
          top: utils.getWindowScrollTop(win)
        };
        w = utils.viewportWidth(win);
        h = utils.viewportHeight(win);
      }
      offset.width = w;
      offset.height = h;
      return offset;
    }

    /**
     * 获取 node 上的 align 对齐点 相对于页面的坐标
     */

    function getAlignOffset(region, align) {
      var V = align.charAt(0);
      var H = align.charAt(1);
      var w = region.width;
      var h = region.height;
      var x = region.left;
      var y = region.top;
      if (V === 'c') {
        y += h / 2;
      } else if (V === 'b') {
        y += h;
      }
      if (H === 'c') {
        x += w / 2;
      } else if (H === 'r') {
        x += w;
      }
      return {
        left: x,
        top: y
      };
    }

    function getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset) {
      var p1 = getAlignOffset(refNodeRegion, points[1]);
      var p2 = getAlignOffset(elRegion, points[0]);
      var diff = [p2.left - p1.left, p2.top - p1.top];
      return {
        left: Math.round(elRegion.left - diff[0] + offset[0] - targetOffset[0]),
        top: Math.round(elRegion.top - diff[1] + offset[1] - targetOffset[1])
      };
    }

    /**
     * align dom node flexibly
     * @author yiminghe@gmail.com
     */

    // http://yiminghe.iteye.com/blog/1124720

    function isFailX(elFuturePos, elRegion, visibleRect) {
      return elFuturePos.left < visibleRect.left || elFuturePos.left + elRegion.width > visibleRect.right;
    }
    function isFailY(elFuturePos, elRegion, visibleRect) {
      return elFuturePos.top < visibleRect.top || elFuturePos.top + elRegion.height > visibleRect.bottom;
    }
    function isCompleteFailX(elFuturePos, elRegion, visibleRect) {
      return elFuturePos.left > visibleRect.right || elFuturePos.left + elRegion.width < visibleRect.left;
    }
    function isCompleteFailY(elFuturePos, elRegion, visibleRect) {
      return elFuturePos.top > visibleRect.bottom || elFuturePos.top + elRegion.height < visibleRect.top;
    }
    function flip(points, reg, map) {
      var ret = [];
      utils.each(points, function (p) {
        ret.push(p.replace(reg, function (m) {
          return map[m];
        }));
      });
      return ret;
    }
    function flipOffset(offset, index) {
      offset[index] = -offset[index];
      return offset;
    }
    function convertOffset(str, offsetLen) {
      var n;
      if (/%$/.test(str)) {
        n = parseInt(str.substring(0, str.length - 1), 10) / 100 * offsetLen;
      } else {
        n = parseInt(str, 10);
      }
      return n || 0;
    }
    function normalizeOffset(offset, el) {
      offset[0] = convertOffset(offset[0], el.width);
      offset[1] = convertOffset(offset[1], el.height);
    }

    /**
     * @param el
     * @param tgtRegion 参照节点所占的区域: { left, top, width, height }
     * @param align
     */
    function doAlign(el, tgtRegion, align, isTgtRegionVisible) {
      var points = align.points;
      var offset = align.offset || [0, 0];
      var targetOffset = align.targetOffset || [0, 0];
      var overflow = align.overflow;
      var source = align.source || el;
      offset = [].concat(offset);
      targetOffset = [].concat(targetOffset);
      overflow = overflow || {};
      var newOverflowCfg = {};
      var fail = 0;
      var alwaysByViewport = !!(overflow && overflow.alwaysByViewport);
      // 当前节点可以被放置的显示区域
      var visibleRect = getVisibleRectForElement(source, alwaysByViewport);
      // 当前节点所占的区域, left/top/width/height
      var elRegion = getRegion(source);
      // 将 offset 转换成数值，支持百分比
      normalizeOffset(offset, elRegion);
      normalizeOffset(targetOffset, tgtRegion);
      // 当前节点将要被放置的位置
      var elFuturePos = getElFuturePos(elRegion, tgtRegion, points, offset, targetOffset);
      // 当前节点将要所处的区域
      var newElRegion = utils.merge(elRegion, elFuturePos);

      // 如果可视区域不能完全放置当前节点时允许调整
      if (visibleRect && (overflow.adjustX || overflow.adjustY) && isTgtRegionVisible) {
        if (overflow.adjustX) {
          // 如果横向不能放下
          if (isFailX(elFuturePos, elRegion, visibleRect)) {
            // 对齐位置反下
            var newPoints = flip(points, /[lr]/gi, {
              l: 'r',
              r: 'l'
            });
            // 偏移量也反下
            var newOffset = flipOffset(offset, 0);
            var newTargetOffset = flipOffset(targetOffset, 0);
            var newElFuturePos = getElFuturePos(elRegion, tgtRegion, newPoints, newOffset, newTargetOffset);
            if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
              fail = 1;
              points = newPoints;
              offset = newOffset;
              targetOffset = newTargetOffset;
            }
          }
        }
        if (overflow.adjustY) {
          // 如果纵向不能放下
          if (isFailY(elFuturePos, elRegion, visibleRect)) {
            // 对齐位置反下
            var _newPoints = flip(points, /[tb]/gi, {
              t: 'b',
              b: 't'
            });
            // 偏移量也反下
            var _newOffset = flipOffset(offset, 1);
            var _newTargetOffset = flipOffset(targetOffset, 1);
            var _newElFuturePos = getElFuturePos(elRegion, tgtRegion, _newPoints, _newOffset, _newTargetOffset);
            if (!isCompleteFailY(_newElFuturePos, elRegion, visibleRect)) {
              fail = 1;
              points = _newPoints;
              offset = _newOffset;
              targetOffset = _newTargetOffset;
            }
          }
        }

        // 如果失败，重新计算当前节点将要被放置的位置
        if (fail) {
          elFuturePos = getElFuturePos(elRegion, tgtRegion, points, offset, targetOffset);
          utils.mix(newElRegion, elFuturePos);
        }
        var isStillFailX = isFailX(elFuturePos, elRegion, visibleRect);
        var isStillFailY = isFailY(elFuturePos, elRegion, visibleRect);
        // 检查反下后的位置是否可以放下了，如果仍然放不下：
        // 1. 复原修改过的定位参数
        if (isStillFailX || isStillFailY) {
          var _newPoints2 = points;

          // 重置对应部分的翻转逻辑
          if (isStillFailX) {
            _newPoints2 = flip(points, /[lr]/gi, {
              l: 'r',
              r: 'l'
            });
          }
          if (isStillFailY) {
            _newPoints2 = flip(points, /[tb]/gi, {
              t: 'b',
              b: 't'
            });
          }
          points = _newPoints2;
          offset = align.offset || [0, 0];
          targetOffset = align.targetOffset || [0, 0];
        }
        // 2. 只有指定了可以调整当前方向才调整
        newOverflowCfg.adjustX = overflow.adjustX && isStillFailX;
        newOverflowCfg.adjustY = overflow.adjustY && isStillFailY;

        // 确实要调整，甚至可能会调整高度宽度
        if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
          newElRegion = adjustForViewport(elFuturePos, elRegion, visibleRect, newOverflowCfg);
        }
      }

      // need judge to in case set fixed with in css on height auto element
      if (newElRegion.width !== elRegion.width) {
        utils.css(source, 'width', utils.width(source) + newElRegion.width - elRegion.width);
      }
      if (newElRegion.height !== elRegion.height) {
        utils.css(source, 'height', utils.height(source) + newElRegion.height - elRegion.height);
      }

      // https://github.com/kissyteam/kissy/issues/190
      // 相对于屏幕位置没变，而 left/top 变了
      // 例如 <div 'relative'><el absolute></div>
      utils.offset(source, {
        left: newElRegion.left,
        top: newElRegion.top
      }, {
        useCssRight: align.useCssRight,
        useCssBottom: align.useCssBottom,
        useCssTransform: align.useCssTransform,
        ignoreShake: align.ignoreShake
      });
      return {
        points: points,
        offset: offset,
        targetOffset: targetOffset,
        overflow: newOverflowCfg
      };
    }
    /**
     *  2012-04-26 yiminghe@gmail.com
     *   - 优化智能对齐算法
     *   - 慎用 resizeXX
     *
     *  2011-07-13 yiminghe@gmail.com note:
     *   - 增加智能对齐，以及大小调整选项
     **/

    function isOutOfVisibleRect(target, alwaysByViewport) {
      var visibleRect = getVisibleRectForElement(target, alwaysByViewport);
      var targetRegion = getRegion(target);
      return !visibleRect || targetRegion.left + targetRegion.width <= visibleRect.left || targetRegion.top + targetRegion.height <= visibleRect.top || targetRegion.left >= visibleRect.right || targetRegion.top >= visibleRect.bottom;
    }
    function alignElement(el, refNode, align) {
      var target = align.target || refNode;
      var refNodeRegion = getRegion(target);
      var isTargetNotOutOfVisible = !isOutOfVisibleRect(target, align.overflow && align.overflow.alwaysByViewport);
      return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
    }
    alignElement.__getOffsetParent = getOffsetParent;
    alignElement.__getVisibleRectForElement = getVisibleRectForElement;

    const triggerClass = getPrefixCls('trigger');
    const triggerHiddenClass = getPrefixCls('trigger-hidden');
    // 用第二个参数的位置去对齐第一个参数的位置
    const placementMap = {
        topLeft: ['bl', 'tl'],
        topRight: ['br', 'tr'],
        bottomLeft: ['tl', 'bl'],
        bottomRight: ['tr', 'br']
    };
    // 第一个参数是sourceNode的x轴偏移量，第二个参数是sourceNode的y轴偏移量
    const placementOffsetMap = {
        topLeft: [0, -4],
        topRight: [0, -4],
        bottomLeft: [0, 4],
        bottomRight: [0, 4]
    };
    class Trigger extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            placement: { type: String },
            isOpen: { type: Boolean },
            destroyOnHide: { type: Boolean, optional: true },
            triggerNode: { type: Object, optional: true },
            getPopupContainer: { type: Function, optional: true },
            getStyle: { type: Function, optional: true },
            onScroll: { type: Function, optional: true },
            ...baseProps
        };
        static defaultProps = {
            destroyOnHide: true
        };
        static contentTemplate = `
<div t-ref="wrapperRef" t-att-class="getClass()" t-portal="getPopupContainer()" t-att-style="getStyle()">
    <t t-slot="default"/>
</div>  
    `;
        static template = owl.xml `
<t>
    <t t-if="!props.destroyOnHide">
        ${Trigger.contentTemplate}
    </t>
    <t t-else="">
        <t t-if="state.isShow">
            ${Trigger.contentTemplate}
        </t>
    </t>
</t>
    `;
        wrapperRef = owl.useRef('wrapperRef');
        state = owl.useState({
            isShow: false // 用于控制隐藏时销毁
        });
        lastIsOpen = false; // 最后一次是打开还是关闭，用来控制是否需要展示fade动画，因为第一次打开始终需要展示动画
        getClass() {
            const { className, isOpen } = this.props;
            const notShowFade = isOpen && this.lastIsOpen;
            return classNames(triggerClass, className, {
                [`${triggerClass}-${isOpen ? 'fadein' : 'fadeout'}`]: !notShowFade
            });
        }
        getPopupContainer() {
            return this.props.getPopupContainer?.(this.props.triggerNode) || 'body';
        }
        getStyle() {
            // 初始状态强制设置为隐藏
            if (!this.props.triggerNode) {
                return stylesToString({
                    'display': 'none'
                });
            }
            return this.props.getStyle?.(this.props.triggerNode) || undefined;
        }
        /**
         * 对齐
         * @protected
         */
        align() {
            const { triggerNode, placement } = this.props;
            if (this.wrapperRef.el && triggerNode) {
                const alignConfig = {
                    points: placementMap[placement],
                    offset: placementOffsetMap[placement],
                    targetOffset: ['0', '0'] // 同offset，不过是针对targetNode的
                };
                alignElement(this.wrapperRef.el, triggerNode, alignConfig);
            }
        }
        setup() {
            useImperativeHandle(() => ({
                wrapperRef: this.wrapperRef,
                align: this.align.bind(this)
            }), () => []);
            useEventListener(this.wrapperRef, 'animationend', (event) => {
                // 动画完成后添加hiddenclass，使不占据dom空间
                if (event.animationName === 'fadeout') {
                    this.wrapperRef.el?.classList.add(triggerHiddenClass);
                    // 如果设置了隐藏时销毁，在动画完成后移除dom
                    if (this.props.destroyOnHide) {
                        this.state.isShow = false;
                    }
                }
            });
            useEventListener(this.wrapperRef, 'scroll', (event) => {
                this.props.onScroll?.(event);
            });
            owl.useEffect(() => {
                const { isOpen } = this.props;
                if (isOpen) {
                    this.state.isShow = true;
                }
            }, () => [this.props.isOpen]);
            owl.useEffect(() => {
                const { isOpen } = this.props;
                this.lastIsOpen = isOpen;
                if (isOpen) {
                    // 打开时先移除hidden的class，否则display: none不能触发动画
                    this.wrapperRef.el?.classList.remove(triggerHiddenClass);
                }
                this.align();
            }, () => [this.wrapperRef.el, this.props.isOpen, this.props.triggerNode]);
        }
    }

    /**
     * 带搜索的指定列表项使用的state，根据搜索项过滤返回过滤后的列表项，提供全选和反选功能
     * @param columns 初始列表项
     * @param filter  筛选函数
     * @param filterSort 排序对比函数
     */
    const useColsSearch = (columns, filter, filterSort) => {
        /**
         * 根据搜索值过滤列，匹配label，模糊匹配
         * @param columns
         * @param searchValue
         */
        const filterColumns = (columns, searchValue) => {
            return columns.filter((c) => {
                if (filter) {
                    return filter(searchValue, c);
                }
                return c.label.indexOf(searchValue) !== -1;
            });
        };
        const state = owl.useState({
            columns: columns ?? [],
            displayCols: [],
            selectedValue: [],
            searchValue: '',
            allSelected: false
        });
        /**
         * 根据当前已选中值进行全选或取消全选，都是针对当前搜索结果进行的操作
         * @param isAll 全选或取消全选
         */
        const selectAll = (isAll) => {
            const allValues = state.displayCols.map((v) => (v.value.toString()));
            if (!state.searchValue) {
                state.selectedValue = isAll ? allValues : [];
            }
            else {
                // 已经被选中的值
                const sourceSelectedValues = [...state.selectedValue];
                // 全选求并集，取消全选求差集
                const allIdsSet = new Set(allValues);
                state.selectedValue = isAll
                    ? Array.from(new Set(sourceSelectedValues.concat(allValues)))
                    : sourceSelectedValues.filter(cid => !allIdsSet.has(cid));
            }
        };
        owl.useEffect(() => {
            let filterCols = filterColumns(state.columns, state.searchValue);
            if (filterSort) {
                filterCols = filterCols.sort(filterSort);
            }
            state.displayCols = filterCols;
        }, () => [state.columns, state.searchValue]);
        // 根据选中值和待选项判断是否全选
        owl.useEffect(() => {
            // displayCols和selectedValue的交集数量等于displayCols则为全选
            const selectedSet = new Set(state.selectedValue);
            const intersection = state.displayCols.filter((col) => selectedSet.has(String(col.value)));
            state.allSelected = intersection.length >= state.displayCols.length;
        }, () => [state.selectedValue, state.displayCols]);
        return {
            state,
            selectAll
        };
    };

    /**
     * 提供可取消的timer
     */
    const useCancellableTimer = () => {
        const timerState = owl.useState({
            timer: undefined
        });
        const cancel = () => {
            const { timer } = timerState;
            if (timer) {
                clearTimeout(timer);
            }
        };
        const run = (handle, timeout) => {
            cancel();
            timerState.timer = setTimeout(() => {
                handle();
                timerState.timer = undefined;
            }, timeout);
        };
        return {
            run,
            cancel
        };
    };

    /**
     * 使用ResizeObserver对元素尺寸进行观察，当元素尺寸发生变化时，执行回调函数，性能开销较小
     * @param targetRef
     * @param handle
     */
    const useResizeObserver = (targetRef, handle) => {
        owl.useEffect(() => {
            if (targetRef.el) {
                const resizeObserver = new ResizeObserver((entries) => {
                    entries.forEach((entry) => {
                        handle(entry);
                    });
                });
                // 开始观察目标元素
                resizeObserver.observe(targetRef.el);
                return () => {
                    resizeObserver.disconnect();
                };
            }
        }, () => [targetRef.el]);
    };

    var _closeSVG = "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m563.8 512 262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z\"/></svg>";

    const closeSVG$1 = getSDSVG(_closeSVG, {
        width: '1em',
        height: '1em'
    });
    const overflowClass = getPrefixCls('overflow');
    const displayTagClass = `${overflowClass}-display-span-tag`;
    class Overflow extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            values: { type: Array },
            options: { type: Array },
            maxTagCount: { type: [Number, String], optional: true },
            handleDelete: { type: Function, optional: true },
            ...baseProps
        };
        static tagTemplate = (inner) => `
<span t-att-class="classes.rest">
    <span class="${displayTagClass}-container">
        <span class="${displayTagClass}-label">
            ${inner}
        </span>
    </span>
</span>
`;
        static displayTemplate = (hasEvent) => `
<t t-slot="tag" data="option">
    <span class="${displayTagClass}">
        <span class="${displayTagClass}-container">
            <span class="${displayTagClass}-label">
                <t t-esc="option.label"/>
            </span>
            <span class="${displayTagClass}-icon" ${hasEvent ?
        't-on-click.stop="(event) => this.handleDelete(option)"' : ''} >${closeSVG$1}</span>
        </span>
    </span>
</t>
`;
        static template = owl.xml `
<t>
    <t t-set="classes" t-value="getClass()"/>
    <span t-ref="container" t-att-class="classes.container">
        <t t-foreach="state.displayOptions" t-as="option" t-key="option.value">
            ${Overflow.displayTemplate(true)}
        </t> 
        <t t-if="state.rest" >
            ${Overflow.tagTemplate(`<t t-esc="'+' + state.rest + '...'"/>`)}
        </t>
        <span t-att-class="classes.suffix" t-ref="suffix">
            <t t-slot="suffix"/>
        </span>
        
        <t t-if="props.maxTagCount !== undefined">
            <span t-ref="temp" t-att-class="classes.temp">
                <t t-foreach="getWholeOptions()" t-as="option" t-key="option.value">
                    ${Overflow.displayTemplate(false)}
                </t> 
            </span>
            <span t-ref="overFlowTemp" t-att-class="classes.temp">
                <t t-foreach="props.values" t-as="value" t-key="value_index">
                    ${Overflow.tagTemplate(`<t t-esc="'+' + (value_index + 1) + '...'"/>`)}
                </t> 
            </span>
        </t>
    </span>
</t>
`;
        containerRef = owl.useRef('container');
        tempRef = owl.useRef('temp');
        overFlowTempRef = owl.useRef('overFlowTemp');
        containerSize = useSize('container');
        suffixSize = useSize('suffix');
        state = owl.useState({
            displayMaxIndex: 0, // 超出显示时用于显示的索引
            displayOptions: [], // 超出显示时用于显示的值
            rest: undefined
        });
        getClass() {
            return {
                container: classNames(this.props.className, overflowClass, {
                    [`${overflowClass}-responsive`]: this.props.maxTagCount === 'responsive'
                }),
                temp: classNames(this.props.className, `${overflowClass}-temp`),
                rest: classNames(displayTagClass, `${overflowClass}-rest`),
                suffix: `${overflowClass}-suffix`
            };
        }
        isOverflow(index, targetWidth, searchWidth) {
            const restIndex = Math.max(0, this.props.values.length - 1 - index);
            const overFlowSpamWidth = this.overFlowTempRef.el?.children[restIndex].getBoundingClientRect().width || 0;
            return targetWidth + overFlowSpamWidth + searchWidth >= this.containerSize.width;
        }
        handleDelete(option) {
            this.props.handleDelete?.(option);
        }
        /**
         * 所有应该显示的option，包含overflow部分
         * @protected
         */
        getWholeOptions() {
            const { values, options } = this.props;
            return options.filter((c) => values.indexOf(c.value) !== -1);
        }
        setup() {
            owl.useEffect(() => {
                const { maxTagCount, values, options } = this.props;
                if (isNumber(maxTagCount)) {
                    this.state.displayMaxIndex = maxTagCount;
                }
                else if (maxTagCount === undefined) {
                    this.state.displayMaxIndex = Math.max(0, this.props.values.length);
                }
                else if (this.tempRef.el && this.containerSize.width) {
                    // 获取所有子元素
                    const children = this.tempRef.el.children;
                    // 初始化总宽度
                    let totalWidth = 0;
                    this.state.displayMaxIndex = values.length;
                    for (let i = 0; i < values.length; i++) {
                        // 获取子元素的宽度，不包括间隔和margin
                        const childWidth = children[i].getBoundingClientRect().width;
                        totalWidth += childWidth;
                        let searchWidth = this.suffixSize.width || 0;
                        // 如果超出或等于maxTagCount，跳出循环
                        if (this.isOverflow(i, totalWidth, searchWidth)) {
                            this.state.displayMaxIndex = i;
                            break;
                        }
                    }
                }
                const displayValues = values.slice(0, this.state.displayMaxIndex);
                this.state.displayOptions = options.filter((c) => displayValues.indexOf(c.value) !== -1);
                // 计算剩余显示部分
                const restIndex = Math.max(0, this.props.values.length - this.state.displayMaxIndex);
                this.state.rest = restIndex > 0 ? restIndex : undefined;
            }, () => [
                this.tempRef.el, this.containerSize.width, this.suffixSize.width, this.props.values, this.props.options
            ]);
        }
    }

    const downSVG = getSDSVG(_downSVG, {
        width: '1em',
        height: '1em'
    });
    const searchSVG = getSDSVG(_searchSVG, {
        width: '1em',
        height: '1em'
    });
    const emptySVG = getSDSVG(_emptySVG, {
        width: '64',
        height: '41'
    });
    const loadingSVG$1 = getSDSVG(_loadingSVG, {
        width: '1em',
        height: '1em'
    });
    const checkSVG = getSDSVG(_checkSVG, {
        width: '1em',
        height: '1em'
    });
    const closeSVG = getSDSVG(_closeSVG$1, {
        width: '1em',
        height: '1em'
    });
    const selectClass = getPrefixCls('select');
    const selectIconClass = getPrefixCls('select-icon');
    const selectRotateIconClass = getPrefixCls('select-rotate-icon');
    const selectSelectorClass = getPrefixCls('select-selector');
    const selectDropdownClass = getPrefixCls('select-dropdown');
    const dropdownEmptyClass = getPrefixCls('select-dropdown-empty');
    const selectDropdownItemWrapperClass = getPrefixCls('select-dropdown-item-wrapper');
    // 需要额外包裹一层，因为item最外层有padding，点击事件到达不了，影响体验
    const selectDropdownItemClass = getPrefixCls('select-dropdown-item');
    const searchSpanClass = getPrefixCls('select-search-span');
    const displaySpanClass = getPrefixCls('select-display-span');
    class Select extends owl.Component {
        static components = { List, Trigger, Overflow };
        static props = {
            className: { type: String, optional: true },
            allowClear: { type: Boolean, optional: true },
            autoClearSearchValue: { type: Boolean, optional: true },
            getPopupContainer: { type: Function, optional: true },
            placement: { type: String, optional: true },
            listHeight: { type: Number, optional: true },
            disabled: { type: Boolean, optional: true },
            value: { type: [String, Array, Number], optional: true },
            defaultValue: { type: [String, Array, Number], optional: true },
            multiple: { type: Boolean, optional: true },
            size: { type: String, optional: true },
            placeholder: { type: String, optional: true },
            bordered: { type: Boolean, optional: true },
            defaultOpen: { type: Boolean, optional: true },
            autoFocus: { type: Boolean, optional: true },
            popupClassName: { type: String, optional: true },
            popupMatchSelectWidth: { type: Boolean, optional: true },
            destroyOnHide: { type: Boolean, optional: true },
            showSearch: { type: Boolean, optional: true },
            filterOption: { type: Function, optional: true },
            filterSort: { type: Function, optional: true },
            options: { type: Array },
            loading: { type: Boolean, optional: true },
            open: { type: Boolean, optional: true },
            maxTagCount: { type: [Number, String], optional: true },
            virtual: { type: Boolean, optional: true },
            itemHeight: { type: [Number, Function], optional: true },
            onSearch: { type: Function, optional: true },
            onSelect: { type: Function, optional: true },
            onDeselect: { type: Function, optional: true },
            onClear: { type: Function, optional: true },
            onDropdownVisibleChange: { type: Function, optional: true },
            onFocus: { type: Function, optional: true },
            onPopupScroll: { type: Function, optional: true },
            ...baseProps
        };
        static defaultProps = {
            autoClearSearchValue: true,
            listHeight: 256,
            virtual: false,
            popupMatchSelectWidth: true,
            destroyOnHide: true,
            multiple: false,
            bordered: true,
            placement: 'bottomLeft'
        };
        state = owl.useState({
            searchValue: '',
            focus: this.props.autoFocus || false,
            triggerNode: undefined,
            multipleInputStyle: undefined
        });
        controllableState = useControllableState(this.props, {
            value: this.props.defaultValue ?? this.props.multiple ? [] : undefined,
            open: false
        });
        colsState = useColsSearch(this.props.options, this.props.filterOption, this.props.filterSort);
        cancelableTimer = useCancellableTimer();
        containerRef = owl.useRef('container');
        searchTempRef = owl.useRef('searchTemp');
        searchSpanRef = owl.useRef('searchSpan');
        searchRef = owl.useRef('search');
        triggerRef = useCompRef();
        static template = owl.xml `
<span t-ref="container" t-att-class="getClass()" t-on-click="onClickContainer">
    <span class="${selectSelectorClass}">
        <span t-if="showPlaceholder()" class="${selectSelectorClass}-placeholder"><t t-esc="props.placeholder"/></span>
        <div class="${selectSelectorClass}-temp" t-ref="searchTemp"><t t-esc="state.searchValue"/></div>
        <t t-set="searchClass" t-value="getSearchClass()"/>
        <t t-if="props.multiple">
            <Overflow slots="props.slots" className="'${selectSelectorClass}-tags'" values="controllableState.state.value" maxTagCount="props.maxTagCount" options="props.options" handleDelete.bind="handleDeleteChoice">
                <t t-set-slot="suffix">
                    <t t-if="props.showSearch">
                        <span t-att-class="searchClass.search">
                            <span t-ref="searchSpan">
                                <input t-ref="search" t-on-input="onInput" t-att-value="state.searchValue" type="text"/>
                            </span>
                        </span>
                    </t>
                </t>
            </Overflow>
        </t>
        <t t-else="">
            <t t-if="props.showSearch">
                <span t-att-class="searchClass.search"><input t-on-input="onInput" t-att-value="state.searchValue" type="text"/></span>
            </t>
            <t t-set="displayOption" t-value="getOption(controllableState.state.value)"/>
            <span t-if="displayOption" t-att-class="searchClass.display">
                <t t-slot="label" data="displayOption">
                    <t t-esc="displayOption.label"/>
                </t>
            </span>
        </t>
    </span>
    <Trigger ref="triggerRef" onScroll.bind="onScroll" className="getPopupClass()" isOpen="controllableState.state.open" triggerNode="state.triggerNode" 
        getPopupContainer="props.getPopupContainer" destroyOnHide="props.destroyOnHide" getStyle.bind="getDropdownStyle" placement="props.placement">
        <t t-if="colsState.state.displayCols.length === 0">
            <t t-slot="empty">
                <div class="${dropdownEmptyClass}">
                    <div>${emptySVG}</div>
                    <div>暂无数据</div>
                </div>
            </t>
        </t>
        <t t-else="">
            <List dataSource="colsState.state.displayCols" itemClassName.bind="getItemClass" virtual="props.virtual" itemHeight="props.itemHeight" height="props.listHeight" onScroll.bind="onScroll">
                <t t-set-slot="item" t-slot-scope="scope">
                    <div class="${selectDropdownItemClass}" t-on-click.synthetic="() => this.handleChoice(scope.data)">
                        <span>
                            <t t-slot="label" data="scope.data">
                                <t t-esc="scope.data.label"/>
                            </t>
                        </span>
                        <span class="${selectDropdownItemClass}-icon" t-if="this.showSelectedSuffix(scope.data)">${checkSVG}</span>
                    </div>
                </t>
            </List>        
        </t>
    </Trigger>
    <span class="${selectIconClass}">
        <t t-if="props.loading"><span class="${selectRotateIconClass}">${loadingSVG$1}</span></t>
        <t t-elif="state.searchValue">${searchSVG}</t>
        <t t-else="">${downSVG}</t>
        
        <span t-if="!props.disabled &amp;&amp; props.allowClear" class="${selectIconClass}-clear" t-on-click="handleClear">
            ${closeSVG}
        </span>
    </span>
 </span>   
    `;
        /**
         * 判断是否显示placeholder的逻辑
         * @protected
         */
        showPlaceholder() {
            const { multiple } = this.props;
            if (!!this.state.searchValue) {
                return false;
            }
            if (!multiple) {
                return !this.controllableState.state.value;
            }
            return this.controllableState.state.value.length === 0;
        }
        /**
         * 搜索值变化时触发回调
         * @param event
         * @protected
         */
        onInput(event) {
            const value = event.currentTarget.value;
            this.state.searchValue = value;
            this.colsState.state.searchValue = value;
            this.props.onSearch?.(value);
        }
        /**
         * 清空搜索值
         * @protected
         */
        clear() {
            this.state.searchValue = '';
            this.colsState.state.searchValue = '';
        }
        /**
         * 延时清空搜索值，但是会马上清空显示的值
         * @protected
         */
        timerClear() {
            // 先清空searchValue使展示正常
            this.state.searchValue = '';
            this.cancelableTimer.run(this.clear.bind(this), 1000);
        }
        /**
         * 点击最外层容器时触发的回调
         * @param event
         * @protected
         */
        onClickContainer(event) {
            if (!this.props.disabled) {
                // 打开时如果有searchRef，则进行聚焦，仅multiple有用
                this.searchRef.el?.focus();
                // 如果已经open并且允许search，则不进行关闭
                if (this.controllableState.state.open && this.props.showSearch) {
                    return;
                }
                this.toggleOpen();
                this.state.focus = true;
                this.props.onFocus?.();
            }
        }
        /**
         * 下拉框的显示状态改变时触发
         * @param open 是否显示
         * @protected
         */
        onDropdownVisibleChange(open) {
            this.controllableState.setState({
                open
            });
            this.props.onDropdownVisibleChange?.(open);
        }
        /**
         * 切换下拉框的显示状态
         * @param force 切换状态
         * @protected
         */
        toggleOpen(force) {
            if (!this.props.disabled) {
                this.onDropdownVisibleChange(force ?? !this.controllableState.state.open);
                if (this.controllableState.state.open) {
                    this.clear();
                    this.cancelableTimer.cancel();
                    this.state.triggerNode = this.containerRef.el;
                }
            }
        }
        /**
         * select组件的样式类
         * @protected
         */
        getClass() {
            const { size, className, disabled, bordered } = this.props;
            return classNames(className, selectClass, {
                [`${selectClass}-borderless`]: !bordered,
                [`${selectClass}-focus`]: this.state.focus,
                [`${selectClass}-multiple`]: !!this.props.multiple,
                [`${selectClass}-isOpen`]: this.controllableState.state.open,
                [`${selectClass}-searchable`]: this.props.showSearch,
                [`${selectClass}-disabled`]: !!disabled,
                [`${selectClass}-sm`]: size === 'small',
                [`${selectClass}-lg`]: size === 'large',
                [`${selectClass}-vir`]: false
            });
        }
        /**
         * 搜索相关部分的样式
         * @protected
         */
        getSearchClass() {
            return {
                search: classNames(searchSpanClass, {
                    [`${searchSpanClass}-multiple`]: !!this.props.multiple
                }),
                display: classNames(displaySpanClass, {
                    [`${selectClass}-v-hidden`]: !this.props.multiple && !!this.state.searchValue // 多选模式下不隐藏
                })
            };
        }
        /**
         * 下拉框的class
         * @protected
         */
        getPopupClass() {
            return classNames(selectDropdownClass, this.props.popupClassName, {
                [`${selectDropdownClass}-virtual`]: !!this.props.virtual
            });
        }
        /**
         * 选项的样式类
         * @param item
         * @param index
         * @protected
         */
        getItemClass(item, index) {
            if (!this.props.multiple) {
                return classNames(selectDropdownItemWrapperClass, {
                    [`${selectDropdownItemClass}-selected`]: item.value === this.controllableState.state.value
                });
            }
            return classNames(selectDropdownItemWrapperClass, {
                [`${selectDropdownItemClass}-selected`]: this.controllableState.state.value.indexOf(item.value) !== -1
            });
        }
        /**
         * 下拉框的样式style
         * @param triggerNode
         * @protected
         */
        getDropdownStyle(triggerNode) {
            if (!triggerNode) {
                return;
            }
            const { clientWidth } = triggerNode;
            const style = {
                'max-height': `${this.props.listHeight}px`
            };
            if (this.props.popupMatchSelectWidth) {
                style['width'] = `${clientWidth}px`;
            }
            return stylesToString(style);
        }
        /**
         * 判断下拉框中是否显示已选的后缀标识
         * @param option 选项
         * @protected
         */
        showSelectedSuffix(option) {
            return this.props.multiple && this.controllableState.state.value.indexOf(option.value) !== -1;
        }
        /**
         * 点击外部区域时，关闭下拉框
         * @param event
         * @protected
         */
        onClickOutsideHandler(event) {
            const target = event.target;
            // 在点击非选择框区域和非选项区域时，关闭下拉框
            if (!this.containerRef.el?.contains(target) && !this.triggerRef.current?.wrapperRef.el?.contains(target)) {
                if (this.controllableState.state.open) {
                    this.toggleOpen(false);
                }
                this.state.focus = false;
                this.timerClear();
            }
        }
        onScroll(event, position) {
            this.props.onPopupScroll?.(event, position);
        }
        /**
         * 清空选项的回调
         * @param event
         * @protected
         */
        handleClear(event) {
            event.preventDefault();
            event.stopPropagation();
            this.controllableState.setState({
                value: this.props.multiple ? [] : undefined
            });
            this.props.onClear?.();
        }
        /**
         * 选中下拉选项的回调
         * @param option
         * @protected
         */
        handleChoice(option) {
            if (this.props.multiple) {
                const { value } = option;
                const stateValue = [...this.controllableState.state.value];
                const index = stateValue.indexOf(value);
                if (index === -1) {
                    // 新选中
                    stateValue.push(value);
                    this.controllableState.setState({
                        value: stateValue
                    });
                    this.props.onSelect?.(option);
                }
                else {
                    // 取消选中
                    this.handleDeleteChoice(option);
                }
            }
            else {
                this.controllableState.setState({
                    value: option.value
                });
                this.props.onSelect?.(option);
            }
            if (!this.props.multiple) {
                this.timerClear();
                this.onDropdownVisibleChange(false);
            }
            else if (this.props.autoClearSearchValue) {
                this.clear();
            }
        }
        /**
         * 取消选中值的回调
         * @param option
         * @protected
         */
        handleDeleteChoice(option) {
            const filterValues = this.controllableState.state.value.filter((v) => v !== option.value);
            this.controllableState.setState({
                value: filterValues
            });
            this.props.onDeselect?.(option);
        }
        /**
         * 根据value值获取对应的option
         * @param value
         * @protected
         */
        getOption(value) {
            return this.props.options.find((c) => c.value === value);
        }
        setup() {
            const target = { el: window };
            useImperativeHandle(() => ({
                focus: () => {
                    this.state.focus = true;
                    this.props.onFocus?.();
                },
                blur: () => {
                    this.state.focus = false;
                }
            }), () => []);
            useEventListener(target, 'mousedown', this.onClickOutsideHandler);
            // 监听尺寸变化，如果是打开状态并且尺寸发生了变化，则进行对齐，使用ResizeObserver节约性能开销
            useResizeObserver(this.containerRef, (entry) => {
                if (this.controllableState.state.open) {
                    this.triggerRef.current?.align();
                }
            });
            owl.useEffect(() => {
                this.colsState.state.columns = this.props.options;
            }, () => [this.props.options]);
            // 是否默认展开逻辑
            owl.useEffect(() => {
                if (this.props.defaultOpen && !this.props.disabled) {
                    this.state.triggerNode = this.containerRef.el;
                    this.onDropdownVisibleChange(true);
                }
                // 初始有焦点时触发一次onFocus事件
                if (this.props.autoFocus) {
                    this.props.onFocus?.();
                }
            }, () => []);
            // 在输入框宽度不足时进行适配换行处理
            owl.useEffect(() => {
                if (!this.searchSpanRef.el) {
                    return;
                }
                let width = '4px';
                if (this.state.searchValue) {
                    width = getComputedStyle(this.searchTempRef.el).width;
                }
                this.searchSpanRef.el.style.width = width;
            }, () => [this.state.searchValue, this.searchSpanRef.el]);
        }
    }

    /**
     * Take input from [0, n] and return it as [0, 1]
     * @hidden
     */
    function bound01(n, max) {
        if (isOnePointZero(n)) {
            n = '100%';
        }
        var isPercent = isPercentage(n);
        n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
        // Automatically convert percentage into number
        if (isPercent) {
            n = parseInt(String(n * max), 10) / 100;
        }
        // Handle floating point rounding errors
        if (Math.abs(n - max) < 0.000001) {
            return 1;
        }
        // Convert into [0, 1] range if it isn't already
        if (max === 360) {
            // If n is a hue given in degrees,
            // wrap around out-of-range values into [0, 360] range
            // then convert into [0, 1].
            n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
        }
        else {
            // If n not a hue given in degrees
            // Convert into [0, 1] range if it isn't already.
            n = (n % max) / parseFloat(String(max));
        }
        return n;
    }
    /**
     * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
     * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
     * @hidden
     */
    function isOnePointZero(n) {
        return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
    }
    /**
     * Check to see if string passed in is a percentage
     * @hidden
     */
    function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') !== -1;
    }
    /**
     * Return a valid alpha value [0,1] with all invalid values being set to 1
     * @hidden
     */
    function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }
        return a;
    }
    /**
     * Replace a decimal with it's percentage value
     * @hidden
     */
    function convertToPercentage(n) {
        if (n <= 1) {
            return "".concat(Number(n) * 100, "%");
        }
        return n;
    }
    /**
     * Force a hex value to have 2 characters
     * @hidden
     */
    function pad2(c) {
        return c.length === 1 ? '0' + c : String(c);
    }

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
    /**
     * Handle bounds / percentage checking to conform to CSS color spec
     * <http://www.w3.org/TR/css3-color/>
     * *Assumes:* r, g, b in [0, 255] or [0, 1]
     * *Returns:* { r, g, b } in [0, 255]
     */
    function rgbToRgb(r, g, b) {
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255,
        };
    }
    function hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * (6 * t);
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }
    /**
     * Converts an HSL color value to RGB.
     *
     * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
     * *Returns:* { r, g, b } in the set [0, 255]
     */
    function hslToRgb(h, s, l) {
        var r;
        var g;
        var b;
        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        if (s === 0) {
            // achromatic
            g = l;
            b = l;
            r = l;
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
    }
    /**
     * Converts an RGB color value to HSV
     *
     * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
     * *Returns:* { h, s, v } in [0,1]
     */
    function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var v = max;
        var d = max - min;
        var s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0; // achromatic
        }
        else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }
    /**
     * Converts an HSV color value to RGB.
     *
     * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
     * *Returns:* { r, g, b } in the set [0, 255]
     */
    function hsvToRgb(h, s, v) {
        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var mod = i % 6;
        var r = [v, q, p, p, t, v][mod];
        var g = [t, v, v, q, p, p][mod];
        var b = [p, p, t, v, v, q][mod];
        return { r: r * 255, g: g * 255, b: b * 255 };
    }
    /**
     * Converts an RGB color to hex
     *
     * Assumes r, g, and b are contained in the set [0, 255]
     * Returns a 3 or 6 character hex
     */
    function rgbToHex(r, g, b, allow3Char) {
        var hex = [
            pad2(Math.round(r).toString(16)),
            pad2(Math.round(g).toString(16)),
            pad2(Math.round(b).toString(16)),
        ];
        // Return a 3 character hex if possible
        if (allow3Char &&
            hex[0].startsWith(hex[0].charAt(1)) &&
            hex[1].startsWith(hex[1].charAt(1)) &&
            hex[2].startsWith(hex[2].charAt(1))) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }
        return hex.join('');
    }
    /** Converts a hex value to a decimal */
    function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
    }
    /** Parse a base-16 hex value into a base-10 integer */
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
    /**
     * @hidden
     */
    var names = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        goldenrod: '#daa520',
        gold: '#ffd700',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavenderblush: '#fff0f5',
        lavender: '#e6e6fa',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
    };

    /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
    /**
     * Given a string or object, convert that input to RGB
     *
     * Possible string inputs:
     * ```
     * "red"
     * "#f00" or "f00"
     * "#ff0000" or "ff0000"
     * "#ff000000" or "ff000000"
     * "rgb 255 0 0" or "rgb (255, 0, 0)"
     * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
     * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
     * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
     * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
     * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
     * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
     * ```
     */
    function inputToRGB(color) {
        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;
        if (typeof color === 'string') {
            color = stringInputToObject(color);
        }
        if (typeof color === 'object') {
            if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
            }
            else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                s = convertToPercentage(color.s);
                v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, s, v);
                ok = true;
                format = 'hsv';
            }
            else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                s = convertToPercentage(color.s);
                l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, s, l);
                ok = true;
                format = 'hsl';
            }
            if (Object.prototype.hasOwnProperty.call(color, 'a')) {
                a = color.a;
            }
        }
        a = boundAlpha(a);
        return {
            ok: ok,
            format: color.format || format,
            r: Math.min(255, Math.max(rgb.r, 0)),
            g: Math.min(255, Math.max(rgb.g, 0)),
            b: Math.min(255, Math.max(rgb.b, 0)),
            a: a,
        };
    }
    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = '[-\\+]?\\d+%?';
    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
    var matchers = {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
        rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
        hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
        hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
        hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
        hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    };
    /**
     * Permissive string parsing.  Take in a number of formats, and output an object
     * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
     */
    function stringInputToObject(color) {
        color = color.trim().toLowerCase();
        if (color.length === 0) {
            return false;
        }
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color === 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
        }
        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match = matchers.rgb.exec(color);
        if (match) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        match = matchers.rgba.exec(color);
        if (match) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        match = matchers.hsl.exec(color);
        if (match) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        match = matchers.hsla.exec(color);
        if (match) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        match = matchers.hsv.exec(color);
        if (match) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        match = matchers.hsva.exec(color);
        if (match) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        match = matchers.hex8.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                a: convertHexToDecimal(match[4]),
                format: named ? 'name' : 'hex8',
            };
        }
        match = matchers.hex6.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? 'name' : 'hex',
            };
        }
        match = matchers.hex4.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1] + match[1]),
                g: parseIntFromHex(match[2] + match[2]),
                b: parseIntFromHex(match[3] + match[3]),
                a: convertHexToDecimal(match[4] + match[4]),
                format: named ? 'name' : 'hex8',
            };
        }
        match = matchers.hex3.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1] + match[1]),
                g: parseIntFromHex(match[2] + match[2]),
                b: parseIntFromHex(match[3] + match[3]),
                format: named ? 'name' : 'hex',
            };
        }
        return false;
    }
    /**
     * Check to see if it looks like a CSS unit
     * (see `matchers` above for definition).
     */
    function isValidCSSUnit(color) {
        return Boolean(matchers.CSS_UNIT.exec(String(color)));
    }

    var hueStep = 2; // 色相阶梯

    var saturationStep = 0.16; // 饱和度阶梯，浅色部分

    var saturationStep2 = 0.05; // 饱和度阶梯，深色部分

    var brightnessStep1 = 0.05; // 亮度阶梯，浅色部分

    var brightnessStep2 = 0.15; // 亮度阶梯，深色部分

    var lightColorCount = 5; // 浅色数量，主色上

    var darkColorCount = 4; // 深色数量，主色下
    // 暗色主题颜色映射关系表

    var darkColorMap = [{
      index: 7,
      opacity: 0.15
    }, {
      index: 6,
      opacity: 0.25
    }, {
      index: 5,
      opacity: 0.3
    }, {
      index: 5,
      opacity: 0.45
    }, {
      index: 5,
      opacity: 0.65
    }, {
      index: 5,
      opacity: 0.85
    }, {
      index: 4,
      opacity: 0.9
    }, {
      index: 3,
      opacity: 0.95
    }, {
      index: 2,
      opacity: 0.97
    }, {
      index: 1,
      opacity: 0.98
    }];

    // Wrapper function ported from TinyColor.prototype.toHsv
    // Keep it here because of `hsv.h * 360`
    function toHsv(_ref) {
      var r = _ref.r,
          g = _ref.g,
          b = _ref.b;
      var hsv = rgbToHsv(r, g, b);
      return {
        h: hsv.h * 360,
        s: hsv.s,
        v: hsv.v
      };
    } // Wrapper function ported from TinyColor.prototype.toHexString
    // Keep it here because of the prefix `#`


    function toHex(_ref2) {
      var r = _ref2.r,
          g = _ref2.g,
          b = _ref2.b;
      return "#".concat(rgbToHex(r, g, b, false));
    } // Wrapper function ported from TinyColor.prototype.mix, not treeshakable.
    // Amount in range [0, 1]
    // Assume color1 & color2 has no alpha, since the following src code did so.


    function mix(rgb1, rgb2, amount) {
      var p = amount / 100;
      var rgb = {
        r: (rgb2.r - rgb1.r) * p + rgb1.r,
        g: (rgb2.g - rgb1.g) * p + rgb1.g,
        b: (rgb2.b - rgb1.b) * p + rgb1.b
      };
      return rgb;
    }

    function getHue(hsv, i, light) {
      var hue; // 根据色相不同，色相转向不同

      if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
        hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
      } else {
        hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
      }

      if (hue < 0) {
        hue += 360;
      } else if (hue >= 360) {
        hue -= 360;
      }

      return hue;
    }

    function getSaturation(hsv, i, light) {
      // grey color don't change saturation
      if (hsv.h === 0 && hsv.s === 0) {
        return hsv.s;
      }

      var saturation;

      if (light) {
        saturation = hsv.s - saturationStep * i;
      } else if (i === darkColorCount) {
        saturation = hsv.s + saturationStep;
      } else {
        saturation = hsv.s + saturationStep2 * i;
      } // 边界值修正


      if (saturation > 1) {
        saturation = 1;
      } // 第一格的 s 限制在 0.06-0.1 之间


      if (light && i === lightColorCount && saturation > 0.1) {
        saturation = 0.1;
      }

      if (saturation < 0.06) {
        saturation = 0.06;
      }

      return Number(saturation.toFixed(2));
    }

    function getValue(hsv, i, light) {
      var value;

      if (light) {
        value = hsv.v + brightnessStep1 * i;
      } else {
        value = hsv.v - brightnessStep2 * i;
      }

      if (value > 1) {
        value = 1;
      }

      return Number(value.toFixed(2));
    }

    function generate(color) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var patterns = [];
      var pColor = inputToRGB(color);

      for (var i = lightColorCount; i > 0; i -= 1) {
        var hsv = toHsv(pColor);
        var colorString = toHex(inputToRGB({
          h: getHue(hsv, i, true),
          s: getSaturation(hsv, i, true),
          v: getValue(hsv, i, true)
        }));
        patterns.push(colorString);
      }

      patterns.push(toHex(pColor));

      for (var _i = 1; _i <= darkColorCount; _i += 1) {
        var _hsv = toHsv(pColor);

        var _colorString = toHex(inputToRGB({
          h: getHue(_hsv, _i),
          s: getSaturation(_hsv, _i),
          v: getValue(_hsv, _i)
        }));

        patterns.push(_colorString);
      } // dark theme patterns


      if (opts.theme === 'dark') {
        return darkColorMap.map(function (_ref3) {
          var index = _ref3.index,
              opacity = _ref3.opacity;
          var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || '#141414'), inputToRGB(patterns[index]), opacity * 100));
          return darkColorString;
        });
      }

      return patterns;
    }

    var presetPrimaryColors = {
      red: '#F5222D',
      volcano: '#FA541C',
      orange: '#FA8C16',
      gold: '#FAAD14',
      yellow: '#FADB14',
      lime: '#A0D911',
      green: '#52C41A',
      cyan: '#13C2C2',
      blue: '#1677FF',
      geekblue: '#2F54EB',
      purple: '#722ED1',
      magenta: '#EB2F96',
      grey: '#666666'
    };
    var presetPalettes = {};
    var presetDarkPalettes = {};
    Object.keys(presetPrimaryColors).forEach(function (key) {
      presetPalettes[key] = generate(presetPrimaryColors[key]);
      presetPalettes[key].primary = presetPalettes[key][5]; // dark presetPalettes

      presetDarkPalettes[key] = generate(presetPrimaryColors[key], {
        theme: 'dark',
        backgroundColor: '#141414'
      });
      presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
    });

    let styleElement;
    const createStyleElement = () => {
        if (!styleElement) {
            styleElement = document.createElement('style');
            // 添加到head中
            document.head.appendChild(styleElement);
        }
    };
    /**
     * 将十六进制颜色值转换为 RGB 颜色值
     * @param hex
     */
    const hexToRgb = (hex) => {
        // 移除十六进制颜色值的 '#' 符号（如果存在）
        hex = hex.replace("#", "");
        // 如果是三位数的十六进制数，则转换为六位数
        if (hex.length === 3) {
            hex = hex.split("").map(function (hexPart) {
                return hexPart + hexPart;
            }).join("");
        }
        // 将十六进制数转换为 RGB 值
        return [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16)
        ];
    };
    const setThemes = (primaryColor) => {
        createStyleElement();
        const colors = generate(primaryColor);
        // 向style中写入css3变量
        let cssVariables = ':root {';
        cssVariables += `\n--primary-color-base: ${hexToRgb(primaryColor)};`;
        for (let i = 1; i <= colors.length; i++) {
            cssVariables += `\n--primary-color-${i}: ${colors[i - 1]};`;
        }
        cssVariables += '}';
        styleElement.innerHTML = cssVariables;
    };

    const checkboxClass = getPrefixCls('checkbox');
    const checkboxWrapperClass = `${checkboxClass}-wrapper`;
    const checkboxInputClass = `${checkboxClass}-input`;
    const checkboxInnerClass = `${checkboxClass}-inner`;
    class Checkbox extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            disabled: { type: Boolean, optional: true },
            defaultValue: { type: Boolean, optional: true },
            value: { type: Boolean, optional: true },
            indeterminate: { type: Boolean, optional: true },
            onChange: { type: Function, optional: true },
            name: { type: String, optional: true },
            ...baseProps
        };
        get checkboxGroup() {
            return this.env.checkboxGroup;
        }
        get checkboxGroupValue() {
            return this.checkboxGroup?.controllableState.state.value;
        }
        get mergedValue() {
            // 如果有checkboxGroup，则从checkboxGroup中获取value
            if (this.checkboxGroupValue && this.props.name) {
                return this.checkboxGroupValue.indexOf(this.props.name) > -1;
            }
            return this.controllableState.state.value;
        }
        get disabled() {
            return this.env.checkboxGroup?.props.disabled ?? this.props.disabled;
        }
        controllableState = useControllableState(this.props, {
            value: this.props.defaultValue ?? false
        });
        static template = owl.xml `
<t t-set="classes" t-value="getClasses()"></t>
<label t-att-class="classes.wrapper">
    <span class="${checkboxClass}" t-on-click="onClick">
        <t t-if="mergedValue">
            <input type="checkbox" t-att-class="classes.input" checked="checked" t-att-disabled="props.disabled"/>
        </t>
        <t t-else="">
            <input type="checkbox" t-att-class="classes.input" t-att-disabled="props.disabled"/>
        </t>
        <span t-att-class="classes.inner"/>
    </span>
    
    <span>
        <t t-slot="default"/>
    </span>
</label>    
`;
        getClasses() {
            return {
                wrapper: classNames(this.props.className, checkboxWrapperClass, {
                    [`${checkboxWrapperClass}-disabled`]: this.disabled,
                    [`${checkboxWrapperClass}-checked`]: this.mergedValue,
                    [`${checkboxWrapperClass}-indeterminate`]: this.props.indeterminate
                }),
                input: checkboxInputClass,
                inner: classNames(checkboxInnerClass, {
                    [`${checkboxInnerClass}-checked`]: this.mergedValue,
                    [`${checkboxInnerClass}-indeterminate`]: this.props.indeterminate
                })
            };
        }
        onClick() {
            const { indeterminate } = this.props;
            if (this.disabled || indeterminate) {
                return;
            }
            this.toggleChecked();
        }
        /**
         * 在checkboxGroup中切换选中状态
         * @param force
         * @protected
         */
        toggleCheckedInGroup(force) {
            const currentChecked = this.checkboxGroupValue.indexOf(this.props.name) !== -1;
            const toCheck = force ?? !currentChecked;
            this.env.checkboxGroup?.onChange(toCheck, this.props.name);
            this.props.onChange?.(toCheck);
        }
        /**
         * 在独立使用时切换选中状态
         * @param force
         * @protected
         */
        toggleCheckedWithoutGroup(force) {
            const toCheck = force ?? !this.controllableState.state.value;
            this.controllableState.setState({
                value: toCheck
            });
            this.props.onChange?.(toCheck);
        }
        /**
         * 切换选中状态
         * @param force
         * @protected
         */
        toggleChecked(force) {
            if (this.checkboxGroup && this.props.name) {
                this.toggleCheckedInGroup(force);
            }
            else {
                this.toggleCheckedWithoutGroup(force);
            }
        }
    }

    class Group extends owl.Component {
        static props = {
            disabled: { type: Boolean, optional: true },
            options: { type: Array, optional: true },
            onChange: { type: Function, optional: true },
            defaultValue: { type: Array, optional: true },
            value: { type: Array, optional: true },
            ...baseProps
        };
        static components = { Checkbox };
        static template = owl.xml `
<t t-if="props.options">
    <t t-foreach="props.options" t-as="option" t-key="option_index">
        <t t-set="checkboxName" t-value="option.name || option"/>
        <Checkbox name="checkboxName" value="controllableState.state.value.indexOf(checkboxName) > -1" disabled="option.disabled">
            <t t-esc="showOption(option)"/>
        </Checkbox>
    </t>  
</t>  
<t t-else="">
    <t t-slot="default"/>
</t>
`;
        controllableState = useControllableState(this.props, {
            value: this.props.defaultValue ?? []
        });
        showOption(option) {
            if (isObject(option)) {
                return option.label;
            }
            else if (!!option) {
                return option;
            }
        }
        onChange(checkedValue, name) {
            const value = [...this.controllableState.state.value];
            if (checkedValue) {
                value.push(name);
            }
            else {
                const index = value.indexOf(name);
                value.splice(index, 1);
            }
            this.controllableState.setState({ value });
            this.props.onChange?.(value);
        }
        setup() {
            owl.useChildSubEnv({ checkboxGroup: this });
        }
    }

    const CheckComponent = Checkbox;
    CheckComponent.Group = Group;

    const switchClass = getPrefixCls('switch');
    const switchInnerClass = `${switchClass}-inner`;
    const switchLoadingClass = `${switchClass}-loading`;
    const loadingSVG = getSDSVG(_loadingSVG, {
        width: '100%',
        height: '100%'
    }, switchLoadingClass);
    class Switch extends owl.Component {
        static props = {
            className: { type: String, optional: true },
            value: { type: Boolean, optional: true },
            defaultValue: { type: Boolean, optional: true },
            disabled: { type: Boolean, optional: true },
            loading: { type: Boolean, optional: true },
            size: { type: String, optional: true },
            onChange: { type: Function, optional: true },
            ...baseProps
        };
        static template = owl.xml `
<t t-set="classes" t-value="getClasses()"></t>
<span t-att-class="classes.switch" t-on-click="onClick">
    <span t-att-class="classes.handle">
        <t t-if="props.loading">${loadingSVG}</t>
    </span>
    <span t-att-class="classes.inner">
        <span class="${switchInnerClass}-checked">
            <t t-slot="checked"/>
        </span>
        <span class="${switchInnerClass}-unchecked">
            <t t-slot="unchecked"/>
        </span>
    </span>
</span>    
`;
        controllableState = useControllableState(this.props, {
            value: this.props.defaultValue ?? false
        });
        get disabled() {
            return this.props.disabled || this.props.loading;
        }
        getClasses() {
            return {
                'switch': classNames(switchClass, this.props.className, {
                    [`${switchClass}-checked`]: this.controllableState.state.value,
                    [`${switchClass}-disabled`]: this.disabled,
                    [`${switchClass}-sm`]: this.props.size === 'small'
                }),
                handle: `${switchClass}-handle`,
                inner: switchInnerClass
            };
        }
        onClick() {
            if (this.disabled) {
                return;
            }
            this.handleToggle();
        }
        handleToggle(force) {
            const toValue = force ?? !this.controllableState.state.value;
            this.controllableState.setState({
                value: toValue
            });
            this.props.onChange?.(toValue);
        }
    }

    setThemes('#71639e');
    /**
     * 被rollup打包后，会将__info__打包到js中
     */
    const __info__ = {
        version: 'beta-1.2.0',
        date: '2024-01-09T01:37:59.853Z'
    };

    exports.Checkbox = CheckComponent;
    exports.Col = Col;
    exports.Input = InputComponent;
    exports.InputNumber = InputNumber;
    exports.List = List;
    exports.Row = Row;
    exports.Select = Select;
    exports.Switch = Switch;
    exports.VirtualList = VirtualList;
    exports.__info__ = __info__;

    return exports;

})(this.sdDesign = this.sdDesign || {}, this.owl);
