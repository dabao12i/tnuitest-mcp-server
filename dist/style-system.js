"use strict";
// Style system and theme configurations for TNUI
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleKeywords = exports.sizePresets = exports.borderRadius = exports.componentStyles = exports.colorThemes = void 0;
exports.detectStyles = detectStyles;
exports.getStyleRecommendation = getStyleRecommendation;
exports.generateStyleProps = generateStyleProps;
// TNUI color themes
exports.colorThemes = {
    default: {
        primary: '#01BEFF',
        success: '#07C160',
        warning: '#FFB700',
        danger: '#FA5151',
        info: '#10AEFF',
        default: '#C8C9CC',
        text: '#303133',
        textDisabled: '#C8C9CC',
        bgColor: '#FFFFFF',
        bgColorSecondary: '#F7F8FA',
        borderColor: '#E5E5E5',
    },
    pink: {
        primary: '#FF6B9D',
        success: '#07C160',
        warning: '#FFB700',
        danger: '#FA5151',
        info: '#10AEFF',
        default: '#C8C9CC',
        text: '#303133',
        textDisabled: '#C8C9CC',
        bgColor: '#FFFFFF',
        bgColorSecondary: '#FFF0F5',
        borderColor: '#FFD1E0',
    },
    purple: {
        primary: '#8B5CF6',
        success: '#07C160',
        warning: '#FFB700',
        danger: '#FA5151',
        info: '#10AEFF',
        default: '#C8C9CC',
        text: '#303133',
        textDisabled: '#C8C9CC',
        bgColor: '#FFFFFF',
        bgColorSecondary: '#F5F3FF',
        borderColor: '#DDD6FE',
    },
    green: {
        primary: '#10B981',
        success: '#07C160',
        warning: '#FFB700',
        danger: '#FA5151',
        info: '#10AEFF',
        default: '#C8C9CC',
        text: '#303133',
        textDisabled: '#C8C9CC',
        bgColor: '#FFFFFF',
        bgColorSecondary: '#ECFDF5',
        borderColor: '#A7F3D0',
    },
    orange: {
        primary: '#F97316',
        success: '#07C160',
        warning: '#FFB700',
        danger: '#FA5151',
        info: '#10AEFF',
        default: '#C8C9CC',
        text: '#303133',
        textDisabled: '#C8C9CC',
        bgColor: '#FFFFFF',
        bgColorSecondary: '#FFF7ED',
        borderColor: '#FED7AA',
    },
};
// Component style variants
exports.componentStyles = [
    {
        component: 'tn-button',
        variants: [
            {
                variant: 'primary',
                variantZh: '主要按钮',
                description: '用于主要操作，如提交、确认',
                props: { type: 'primary' },
            },
            {
                variant: 'default',
                variantZh: '次要按钮',
                description: '用于次要操作，如取消、返回',
                props: { type: 'default' },
            },
            {
                variant: 'warning',
                variantZh: '警告按钮',
                description: '用于警告操作，如删除、清空',
                props: { type: 'warning' },
            },
            {
                variant: 'danger',
                variantZh: '危险按钮',
                description: '用于危险操作，如退出、解绑',
                props: { type: 'danger' },
            },
            {
                variant: 'success',
                variantZh: '成功按钮',
                description: '用于成功操作，如通过、同意',
                props: { type: 'success' },
            },
            {
                variant: 'info',
                variantZh: '信息按钮',
                description: '用于信息展示，如详情、更多',
                props: { type: 'info' },
            },
            {
                variant: 'ghost',
                variantZh: '幽灵按钮',
                description: '透明背景，适合穿插在列表中',
                props: { type: 'ghost' },
            },
            {
                variant: 'text',
                variantZh: '文本按钮',
                description: '无背景边框，适合次要操作',
                props: { type: 'text' },
            },
            {
                variant: 'filled',
                variantZh: '填充按钮',
                description: '实心背景，视觉强烈',
                props: { filled: true },
            },
            {
                variant: 'outlined',
                variantZh: '描边按钮',
                description: '仅边框背景，视觉轻盈',
                props: { border: true },
            },
            {
                variant: 'block',
                variantZh: '块级按钮',
                description: '100%宽度，适合移动端',
                props: { block: true },
            },
            {
                variant: 'circle',
                variantZh: '圆形按钮',
                description: '圆形图标按钮',
                props: { shape: 'circle' },
            },
            {
                variant: 'small',
                variantZh: '小按钮',
                description: '适合紧凑布局',
                props: { size: 'sm' },
            },
            {
                variant: 'large',
                variantZh: '大按钮',
                description: '适合重要操作',
                props: { size: 'lg' },
            },
        ],
    },
    {
        component: 'tn-input',
        variants: [
            {
                variant: 'text',
                variantZh: '文本输入',
                description: '普通文本输入',
                props: { type: 'text' },
            },
            {
                variant: 'password',
                variantZh: '密码输入',
                description: '密码输入，自动隐藏内容',
                props: { type: 'password' },
            },
            {
                variant: 'number',
                variantZh: '数字输入',
                description: '纯数字输入',
                props: { type: 'number' },
            },
            {
                variant: 'digit',
                variantZh: '整数输入',
                description: '个位数数字输入',
                props: { type: 'digit' },
            },
            {
                variant: 'textarea',
                variantZh: '多行文本',
                description: '可调整大小的多行输入',
                props: { type: 'textarea' },
            },
            {
                variant: 'search',
                variantZh: '搜索输入',
                description: '带搜索图标的输入框',
                props: { type: 'search' },
            },
            {
                variant: 'verify-code',
                variantZh: '验证码输入',
                description: '带倒计时按钮的验证码输入',
                props: { type: 'verifyCode' },
            },
            {
                variant: 'disabled',
                variantZh: '禁用状态',
                description: '禁用状态，不可编辑',
                props: { disabled: true },
            },
            {
                variant: 'readonly',
                variantZh: '只读状态',
                description: '只读状态，显示但不可编辑',
                props: { readonly: true },
            },
        ],
    },
    {
        component: 'tn-list',
        variants: [
            {
                variant: 'default',
                variantZh: '默认列表',
                description: '白色背景，简洁风格',
                props: { alpha: false },
            },
            {
                variant: 'alpha',
                variantZh: 'Alpha列表',
                description: '毛玻璃效果，现代风格',
                props: { alpha: true },
            },
            {
                variant: 'card',
                variantZh: '卡片列表',
                description: '卡片样式，有间距和阴影',
                props: { card: true },
            },
            {
                variant: 'border',
                variantZh: '边框列表',
                description: '带边框的列表项',
                props: { border: true },
            },
            {
                variant: 'no-border',
                variantZh: '无线条列表',
                description: '无分割线，简洁风格',
                props: { border: false },
            },
        ],
    },
    {
        component: 'tn-modal',
        variants: [
            {
                variant: 'alert',
                variantZh: '警告弹窗',
                description: '单按钮，用于提示',
                props: { mode: 'alert' },
            },
            {
                variant: 'confirm',
                variantZh: '确认弹窗',
                description: '双按钮，用于确认',
                props: { mode: 'confirm' },
            },
            {
                variant: 'dialog',
                variantZh: '对话框',
                description: '自定义内容对话框',
                props: { mode: 'dialog' },
            },
            {
                variant: 'bottom',
                variantZh: '底部弹窗',
                description: '从底部弹出',
                props: { mode: 'bottom' },
            },
            {
                variant: 'center',
                variantZh: '居中弹窗',
                description: '居中显示',
                props: { mode: 'center' },
            },
            {
                variant: 'image',
                variantZh: '图片弹窗',
                description: '图片预览弹窗',
                props: { mode: 'image' },
            },
        ],
    },
    {
        component: 'tn-popup',
        variants: [
            {
                variant: 'top',
                variantZh: '顶部弹出',
                description: '从屏幕顶部弹出',
                props: { mode: 'top' },
            },
            {
                variant: 'bottom',
                variantZh: '底部弹出',
                description: '从屏幕底部弹出，常用于操作菜单',
                props: { mode: 'bottom' },
            },
            {
                variant: 'center',
                variantZh: '居中弹出',
                description: '屏幕居中弹出',
                props: { mode: 'center' },
            },
            {
                variant: 'left',
                variantZh: '左侧弹出',
                description: '从左侧滑入',
                props: { mode: 'left' },
            },
            {
                variant: 'right',
                variantZh: '右侧弹出',
                description: '从右侧滑入',
                props: { mode: 'right' },
            },
        ],
    },
    {
        component: 'tn-tabs',
        variants: [
            {
                variant: 'scroll',
                variantZh: '滚动标签',
                description: '可滚动的标签页',
                props: { scroll: true },
            },
            {
                variant: 'animation',
                variantZh: '动画标签',
                description: '带滑动动画',
                props: { animation: true },
            },
            {
                variant: 'pills',
                variantZh: '药丸标签',
                description: '圆角胶囊样式',
                props: { pills: true },
            },
            {
                variant: 'flex',
                variantZh: '等分标签',
                description: '平均分配宽度',
                props: { flex: true },
            },
            {
                variant: 'custom',
                variantZh: '自定义标签',
                description: '支持自定义内容和图标',
                props: { custom: true },
            },
        ],
    },
    {
        component: 'tn-switch',
        variants: [
            {
                variant: 'default',
                variantZh: '默认开关',
                description: '标准开关样式',
                props: {},
            },
            {
                variant: 'animation',
                variantZh: '动画开关',
                description: '带过渡动画',
                props: { animation: true },
            },
            {
                variant: 'disabled',
                variantZh: '禁用开关',
                description: '禁用状态',
                props: { disabled: true },
            },
        ],
    },
    {
        component: 'tn-checkbox',
        variants: [
            {
                variant: 'default',
                variantZh: '默认复选框',
                description: '标准方形复选框',
                props: { shape: 'square' },
            },
            {
                variant: 'circle',
                variantZh: '圆形复选框',
                description: '圆形复选框',
                props: { shape: 'circle' },
            },
            {
                variant: 'button',
                variantZh: '按钮复选框',
                description: '按钮样式复选框',
                props: { shape: 'button' },
            },
            {
                variant: 'text',
                variantZh: '文本复选框',
                description: '仅文字复选框',
                props: { text: true },
            },
        ],
    },
    {
        component: 'tn-radio',
        variants: [
            {
                variant: 'default',
                variantZh: '默认单选',
                description: '标准圆形单选',
                props: { shape: 'circle' },
            },
            {
                variant: 'button',
                variantZh: '按钮单选',
                description: '按钮样式单选',
                props: { shape: 'button' },
            },
            {
                variant: 'text',
                variantZh: '文本单选',
                description: '仅文字单选',
                props: { text: true },
            },
        ],
    },
    {
        component: 'tn-swiper',
        variants: [
            {
                variant: 'default',
                variantZh: '默认轮播',
                description: '标准横向轮播',
                props: {},
            },
            {
                variant: 'card',
                variantZh: '卡片轮播',
                description: '卡片样式，立体感',
                props: { card: true },
            },
            {
                variant: 'flat',
                variantZh: '平坦轮播',
                description: '无3D效果，平滑过渡',
                props: { flat: true },
            },
            {
                variant: 'custom',
                variantZh: '自定义轮播',
                description: '支持自定义内容和指示器',
                props: { custom: true },
            },
        ],
    },
];
// Border radius presets
exports.borderRadius = {
    none: { name: '无圆角', value: '0rpx' },
    sm: { name: '小圆角', value: '8rpx' },
    md: { name: '中等圆角', value: '16rpx' },
    lg: { name: '大圆角', value: '24rpx' },
    xl: { name: '超大圆角', value: '32rpx' },
    full: { name: '完全圆角', value: '9999rpx' },
};
// Size presets for components
exports.sizePresets = {
    sm: { name: '小', height: '60rpx', fontSize: '24rpx' },
    md: { name: '中', height: '80rpx', fontSize: '28rpx' },
    lg: { name: '大', height: '100rpx', fontSize: '32rpx' },
};
// Style keywords for auto-detection
exports.styleKeywords = {
    primary: ['主要', 'primary', '主色', '蓝色', 'blue'],
    success: ['成功', 'success', '绿色', 'green', '通过'],
    warning: ['警告', 'warning', '黄色', 'yellow', '注意'],
    danger: ['危险', 'danger', '红色', 'red', '删除', '删除'],
    ghost: ['透明', 'ghost', '无背景', 'plain'],
    text: ['文本', 'text', '文字按钮'],
    filled: ['填充', 'filled', '实心', 'solid'],
    outlined: ['描边', 'outlined', '边框', 'outline'],
    block: ['块级', 'block', '通栏', 'full'],
    circle: ['圆形', 'circle', '圆角', 'round'],
    small: ['小', 'sm', 'small', '迷你'],
    large: ['大', 'lg', 'large', '主要'],
    disabled: ['禁用', 'disabled', '不可点击'],
    alpha: ['毛玻璃', 'alpha', '模糊', 'frosted'],
    card: ['卡片', 'card', '有阴影'],
    border: ['边框', 'border', '有线'],
    animation: ['动画', 'animation', '动效'],
    pills: ['胶囊', 'pills', '圆角标签'],
    scroll: ['滚动', 'scroll', '可滚动'],
    flex: ['等分', 'flex', '平均'],
};
// Detect style from description
function detectStyles(description) {
    const lowerDesc = description.toLowerCase();
    const detected = [];
    for (const [style, keywords] of Object.entries(exports.styleKeywords)) {
        for (const keyword of keywords) {
            if (lowerDesc.includes(keyword.toLowerCase())) {
                detected.push(style);
                break;
            }
        }
    }
    return detected;
}
// Get component style recommendation
function getStyleRecommendation(component, description) {
    const styles = exports.componentStyles.find((s) => s.component === component);
    if (!styles)
        return [];
    const detected = detectStyles(description);
    if (detected.length === 0)
        return styles.variants.slice(0, 3);
    return styles.variants.filter((v) => detected.includes(v.variant));
}
// Generate style props code
function generateStyleProps(component, description) {
    const recommendations = getStyleRecommendation(component, description);
    if (recommendations.length === 0) {
        return '';
    }
    const props = recommendations[0].props;
    const propsStr = Object.entries(props)
        .map(([key, value]) => {
        if (typeof value === 'boolean') {
            return value ? `:${key}` : '';
        }
        if (typeof value === 'string') {
            return `${key}="${value}"`;
        }
        return `${key}="${value}"`;
    })
        .filter(Boolean)
        .join(' ');
    return propsStr;
}
//# sourceMappingURL=style-system.js.map