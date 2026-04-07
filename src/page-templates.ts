// Page templates and component combinations for uniapp automation

export interface PageTemplate {
  id: string
  name: string
  nameZh: string
  description: string
  category: string
  components: ComponentUsage[]
  typicalUseCase: string
}

export interface ComponentUsage {
  component: string
  role: string
  roleZh: string
  required: boolean
  notes?: string
}

export interface PageTypeRecommendation {
  pageType: string
  pageTypeZh: string
  confidence: number
  matchedComponents: string[]
  suggestedCode: string
}

// Predefined page templates for uniapp
export const pageTemplates: PageTemplate[] = [
  {
    id: 'login',
    name: 'Login Page',
    nameZh: '登录页面',
    description:
      'User login page with username/password or phone/verification code',
    category: 'auth',
    typicalUseCase: '用户登录、注册、找回密码',
    components: [
      {
        component: 'tn-form',
        role: 'form-container',
        roleZh: '表单容器',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'username',
        roleZh: '用户名输入',
        required: true,
        notes: '用户名或手机号',
      },
      {
        component: 'tn-input',
        role: 'password',
        roleZh: '密码输入',
        required: true,
        notes: '密码输入，建议使用password类型',
      },
      {
        component: 'tn-button',
        role: 'login-button',
        roleZh: '登录按钮',
        required: true,
        notes: '主要操作按钮',
      },
      {
        component: 'tn-button',
        role: 'register-link',
        roleZh: '注册链接',
        required: false,
        notes: '跳转到注册页面',
      },
      {
        component: 'tn-button',
        role: 'forgot-password',
        roleZh: '忘记密码',
        required: false,
        notes: '找回密码入口',
      },
    ],
  },
  {
    id: 'register',
    name: 'Register Page',
    nameZh: '注册页面',
    description: 'User registration page with multiple input fields',
    category: 'auth',
    typicalUseCase: '用户注册',
    components: [
      {
        component: 'tn-form',
        role: 'form-container',
        roleZh: '表单容器',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'username',
        roleZh: '用户名',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'phone',
        roleZh: '手机号',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'verify-code',
        roleZh: '验证码',
        required: true,
        notes: '配合验证码输入组件',
      },
      {
        component: 'tn-input',
        role: 'password',
        roleZh: '密码',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'confirm-password',
        roleZh: '确认密码',
        required: true,
      },
      {
        component: 'tn-checkbox',
        role: 'agreement',
        roleZh: '用户协议',
        required: true,
      },
      {
        component: 'tn-button',
        role: 'register-button',
        roleZh: '注册按钮',
        required: true,
      },
    ],
  },
  {
    id: 'user-profile',
    name: 'User Profile Page',
    nameZh: '个人中心',
    description:
      'User profile and settings page with avatar, info list, and menu',
    category: 'profile',
    typicalUseCase: '个人中心、用户资料、设置',
    components: [
      {
        component: 'tn-list',
        role: 'header-section',
        roleZh: '头部区域',
        required: true,
        notes: '包含头像和用户名',
      },
      {
        component: 'tn-avatar',
        role: 'avatar',
        roleZh: '头像',
        required: true,
      },
      {
        component: 'tn-list',
        role: 'info-list',
        roleZh: '信息列表',
        required: true,
        notes: '用户基本信息',
      },
      {
        component: 'tn-list',
        role: 'menu-list',
        roleZh: '菜单列表',
        required: true,
        notes: '功能菜单',
      },
      {
        component: 'tn-list-item',
        role: 'menu-item',
        roleZh: '菜单项',
        required: true,
      },
    ],
  },
  {
    id: 'home',
    name: 'Home Page',
    nameZh: '首页',
    description: 'Home page with banner, navigation, and content list',
    category: 'main',
    typicalUseCase: '应用首页、入口页面',
    components: [
      {
        component: 'tn-swiper',
        role: 'banner',
        roleZh: '轮播图',
        required: true,
        notes: '顶部轮播图',
      },
      {
        component: 'tn-tabs',
        role: 'category-tabs',
        roleZh: '分类标签',
        required: false,
        notes: '内容分类',
      },
      {
        component: 'tn-list',
        role: 'content-list',
        roleZh: '内容列表',
        required: true,
        notes: '主要内容展示',
      },
      {
        component: 'tn-list-item',
        role: 'list-item',
        roleZh: '列表项',
        required: true,
      },
    ],
  },
  {
    id: 'list',
    name: 'List Page',
    nameZh: '列表页面',
    description: 'Generic list page with search, filter, and infinite scroll',
    category: 'content',
    typicalUseCase: '商品列表、文章列表、搜索结果',
    components: [
      {
        component: 'tn-search-box',
        role: 'search',
        roleZh: '搜索框',
        required: true,
      },
      {
        component: 'tn-tabs',
        role: 'filter-tabs',
        roleZh: '筛选标签',
        required: false,
        notes: '排序和筛选',
      },
      {
        component: 'tn-list',
        role: 'item-list',
        roleZh: '列表',
        required: true,
      },
      {
        component: 'tn-list-item',
        role: 'list-item',
        roleZh: '列表项',
        required: true,
      },
      {
        component: 'tn-empty',
        role: 'empty-state',
        roleZh: '空状态',
        required: false,
      },
    ],
  },
  {
    id: 'detail',
    name: 'Detail Page',
    nameZh: '详情页面',
    description: 'Detail page with image, info, and action buttons',
    category: 'content',
    typicalUseCase: '商品详情、文章详情',
    components: [
      {
        component: 'tn-swiper',
        role: 'image-gallery',
        roleZh: '图片画廊',
        required: true,
      },
      { component: 'tn-title', role: 'title', roleZh: '标题', required: true },
      {
        component: 'tn-flex',
        role: 'price-section',
        roleZh: '价格区域',
        required: true,
      },
      {
        component: 'tn-line',
        role: 'divider',
        roleZh: '分割线',
        required: true,
      },
      {
        component: 'tn-list',
        role: 'info-list',
        roleZh: '信息列表',
        required: true,
      },
      {
        component: 'tn-button',
        role: 'action-button',
        roleZh: '操作按钮',
        required: true,
        notes: '购买、收藏等',
      },
    ],
  },
  {
    id: 'form',
    name: 'Form Page',
    nameZh: '表单页面',
    description: 'Generic form page with various input types',
    category: 'form',
    typicalUseCase: '信息填写、资料完善、订单填写',
    components: [
      {
        component: 'tn-form',
        role: 'form-container',
        roleZh: '表单容器',
        required: true,
      },
      {
        component: 'tn-form-item',
        role: 'form-item',
        roleZh: '表单项',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'text-input',
        roleZh: '文本输入',
        required: true,
      },
      {
        component: 'tn-radio-group',
        role: 'radio-group',
        roleZh: '单选组',
        required: false,
      },
      {
        component: 'tn-checkbox-group',
        role: 'checkbox-group',
        roleZh: '多选组',
        required: false,
      },
      {
        component: 'tn-switch',
        role: 'switch',
        roleZh: '开关',
        required: false,
      },
      {
        component: 'tn-picker',
        role: 'picker',
        roleZh: '选择器',
        required: false,
      },
      {
        component: 'tn-button',
        role: 'submit-button',
        roleZh: '提交按钮',
        required: true,
      },
    ],
  },
  {
    id: 'chat',
    name: 'Chat Page',
    nameZh: '聊天页面',
    description: 'Chat/IM page with message list and input',
    category: 'communication',
    typicalUseCase: '客服聊天、私信、评论',
    components: [
      {
        component: 'tn-list',
        role: 'message-list',
        roleZh: '消息列表',
        required: true,
      },
      {
        component: 'tn-list-item',
        role: 'message-item',
        roleZh: '消息项',
        required: true,
      },
      {
        component: 'tn-input',
        role: 'message-input',
        roleZh: '消息输入',
        required: true,
      },
      {
        component: 'tn-button',
        role: 'send-button',
        roleZh: '发送按钮',
        required: true,
      },
    ],
  },
  {
    id: 'settings',
    name: 'Settings Page',
    nameZh: '设置页面',
    description: 'App settings page with toggle switches and menu items',
    category: 'profile',
    typicalUseCase: '应用设置、偏好设置',
    components: [
      {
        component: 'tn-list',
        role: 'settings-list',
        roleZh: '设置列表',
        required: true,
      },
      {
        component: 'tn-list-item',
        role: 'setting-item',
        roleZh: '设置项',
        required: true,
      },
      {
        component: 'tn-switch',
        role: 'toggle-setting',
        roleZh: '开关设置',
        required: true,
      },
      {
        component: 'tn-button',
        role: 'logout-button',
        roleZh: '退出登录',
        required: false,
      },
    ],
  },
  {
    id: 'cart',
    name: 'Shopping Cart Page',
    nameZh: '购物车页面',
    description: 'Shopping cart with product list, quantity, and checkout',
    category: 'ecommerce',
    typicalUseCase: '购物车、订单确认',
    components: [
      {
        component: 'tn-list',
        role: 'cart-list',
        roleZh: '购物车列表',
        required: true,
      },
      {
        component: 'tn-checkbox',
        role: 'select-all',
        roleZh: '全选',
        required: true,
      },
      {
        component: 'tn-number-box',
        role: 'quantity',
        roleZh: '数量调整',
        required: true,
      },
      {
        component: 'tn-flex',
        role: 'footer',
        roleZh: '底部区域',
        required: true,
        notes: '合计和结算',
      },
      {
        component: 'tn-button',
        role: 'checkout-button',
        roleZh: '结算按钮',
        required: true,
      },
    ],
  },
]

// Keywords mapping for page type detection
export const pageTypeKeywords: Record<string, string[]> = {
  login: ['登录', 'login', '登陆', 'sign in', '登录页', '登录页面'],
  register: ['注册', 'register', 'sign up', '注册页', '注册页面', 'signin'],
  'user-profile': [
    '个人中心',
    'profile',
    '我的',
    '个人资料',
    '用户中心',
    'my profile',
  ],
  home: ['首页', 'home', '主页', 'homepage', '首页面'],
  list: ['列表', 'list', '列表页', '列表页面', '商品列表', '文章列表'],
  detail: [
    '详情',
    'detail',
    '详情页',
    '详情页面',
    '商品详情',
    'article detail',
  ],
  form: ['表单', 'form', '填写', '信息', '填写页面', 'form page'],
  chat: ['聊天', 'chat', 'IM', '私信', '客服', 'message', '对话'],
  settings: ['设置', 'settings', '偏好', '偏好设置', 'settings page'],
  cart: ['购物车', 'cart', '购物', 'shopping cart', '结算'],
}

// Component role descriptions
export const componentRoles: Record<
  string,
  { role: string; roleZh: string; common: string[] }
> = {
  'tn-button': {
    role: 'action-trigger',
    roleZh: '操作触发',
    common: ['primary', 'default', 'warning', 'danger'],
  },
  'tn-input': {
    role: 'text-input',
    roleZh: '文本输入',
    common: ['text', 'password', 'number', 'textarea'],
  },
  'tn-form': {
    role: 'form-container',
    roleZh: '表单容器',
    common: [],
  },
  'tn-form-item': {
    role: 'form-field',
    roleZh: '表单字段',
    common: [],
  },
  'tn-list': {
    role: 'list-container',
    roleZh: '列表容器',
    common: [],
  },
  'tn-list-item': {
    role: 'list-item',
    roleZh: '列表项',
    common: [],
  },
  'tn-modal': {
    role: 'dialog',
    roleZh: '对话框',
    common: ['alert', 'confirm', 'action'],
  },
  'tn-popup': {
    role: 'overlay-container',
    roleZh: '浮层容器',
    common: ['bottom', 'center', 'dialog'],
  },
  'tn-tabs': {
    role: 'tab-navigation',
    roleZh: '标签导航',
    common: ['scroll', 'animation'],
  },
  'tn-tabbar': {
    role: 'bottom-navigation',
    roleZh: '底部导航',
    common: [],
  },
  'tn-swiper': {
    role: 'carousel',
    roleZh: '轮播',
    common: ['banner', 'image'],
  },
  'tn-checkbox': {
    role: 'boolean-input',
    roleZh: '布尔选择',
    common: ['single', 'group'],
  },
  'tn-radio': {
    role: 'single-selection',
    roleZh: '单选',
    common: ['single', 'group'],
  },
  'tn-switch': {
    role: 'toggle',
    roleZh: '开关',
    common: [],
  },
  'tn-picker': {
    role: 'picker',
    roleZh: '选择器',
    common: ['single', 'multi', 'linkage'],
  },
  'tn-search-box': {
    role: 'search-input',
    roleZh: '搜索输入',
    common: [],
  },
}

// Detect page type from user description
export function detectPageType(description: string): {
  type: string
  confidence: number
} {
  const lowerDesc = description.toLowerCase()
  let bestMatch = { type: 'unknown', confidence: 0 }

  for (const [pageType, keywords] of Object.entries(pageTypeKeywords)) {
    let matchCount = 0
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        matchCount++
      }
    }
    const confidence = matchCount / keywords.length
    if (confidence > bestMatch.confidence) {
      bestMatch = { type: pageType, confidence }
    }
  }

  return bestMatch
}

// Get page template by type
export function getPageTemplate(pageType: string): PageTemplate | undefined {
  return pageTemplates.find((t) => t.id === pageType)
}

// Generate suggested code for page type
export function generatePageCode(template: PageTemplate): string {
  const componentLines: string[] = []

  // Add template comment
  componentLines.push(`<!-- ${template.nameZh} (${template.name}) -->`)
  componentLines.push(`<!-- 典型场景: ${template.typicalUseCase} -->`)
  componentLines.push('')

  // Add template section
  componentLines.push(`<template>`)
  componentLines.push(`  <view class="${template.id}-page">`)

  // Generate component usage based on roles
  for (const usage of template.components) {
    if (!usage.required) continue

    const attrs = generateComponentAttrs(usage)
    componentLines.push(`    <${usage.component} ${attrs} />`)
  }

  componentLines.push(`  </view>`)
  componentLines.push(`</template>`)
  componentLines.push('')

  // Add script section
  componentLines.push(`<script setup lang="ts">`)
  componentLines.push(`  // ${template.nameZh} page logic`)
  componentLines.push(`</script>`)
  componentLines.push('')

  // Add style section
  componentLines.push(`<style lang="scss" scoped>`)
  componentLines.push(`  .${template.id}-page {`)
  componentLines.push(`    min-height: 100vh;`)
  componentLines.push(`    background-color: #f5f5f5;`)
  componentLines.push(`  }`)
  componentLines.push(`</style>`)

  return componentLines.join('\n')
}

function generateComponentAttrs(usage: ComponentUsage): string {
  const attrs: string[] = []

  switch (usage.component) {
    case 'tn-button':
      attrs.push(`type="primary"`)
      if (
        usage.role.includes('login') ||
        usage.role.includes('register') ||
        usage.role.includes('submit')
      ) {
        attrs.push(`block`)
      }
      break
    case 'tn-input':
      if (usage.role.includes('password')) {
        attrs.push(`type="password"`)
      } else if (usage.role.includes('phone')) {
        attrs.push(`type="number"`)
      }
      break
    case 'tn-list':
      attrs.push(`alpha`)
      break
    case 'tn-swiper':
      attrs.push(`height="350rpx"`)
      break
    case 'tn-tabs':
      attrs.push(`scroll`)
      break
    case 'tn-search-box':
      attrs.push(`search`)
      break
  }

  if (usage.notes) {
    attrs.push(`:placeholder="'${usage.roleZh}'"`)
  }

  return attrs.join(' ')
}
