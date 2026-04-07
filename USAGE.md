# TNUI MCP Server 使用指南

说明如何在常见 AI 编辑器中配置和使用 TNUI MCP Server。

## 什么是 MCP？

Model Context Protocol (MCP) 是用于连接 AI 客户端与外部工具、资源的协议。这个项目通过 MCP 提供 TNUI 组件文档、页面模板和相关工具。

## 快速开始

### 1. 安装依赖

```bash
cd mcp
pnpm install
```

### 2. 构建服务器

```bash
pnpm build
```

构建后可通过以下命令写入用户级编辑器配置：

```bash
pnpm exec node bin/cli.js setup
```

这会尝试配置：

- Codex
- Claude Code CLI
- Claude Desktop

### 3. 启动服务器

```bash
pnpm start
```

服务器通过 stdio 运行，供支持 MCP 的 AI 客户端按配置自动拉起，不监听 `ws://localhost:3000` 这类 WebSocket 地址。

## AI 编辑器配置

### Claude Code CLI

当前版本会优先通过 `claude mcp` 写入用户级 MCP 配置。
旧环境仍保留 `~/.claude/mcp.json` 回退。

`tnuitest-mcp setup` 和 `tnuitest-mcp init` 会优先尝试执行：

```bash
claude mcp add -s user tnuitest-mcp npx tnuitest-mcp-server start
```

如果当前环境中的 `claude` 命令不可用，则会继续尝试写入：

- `~/.claude/mcp.json`

回退配置结构示例：

```json
{
  "mcpServers": {
    "tnuitest-mcp": {
      "command": "npx",
      "args": ["tnuitest-mcp-server", "start"]
    }
  }
}
```

### Claude Desktop

自动配置路径：

- Windows: `%APPDATA%\\Claude\\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

自动写入的 server 名称为 `tnuitest-mcp`，默认配置为：

```json
{
  "mcpServers": {
    "tnuitest-mcp": {
      "command": "npx",
      "args": ["tnuitest-mcp-server", "start"]
    }
  }
}
```

如果 Claude 已经打开，执行 `setup` 或 `init` 后请重启客户端使配置生效。

### 其他支持 MCP 的编辑器

对于其他支持 MCP 的编辑器，可以优先使用这种通用 `npx` 配置：

```json
{
  "mcpServers": {
    "tnuitest-mcp": {
      "command": "npx",
      "args": ["tnuitest-mcp-server", "start"]
    }
  }
}
```

这种方式适合手动配置场景：

- 不需要写死本地 `node_modules` 或全局安装路径
- 换机器时配置更容易复用
- 多数支持 MCP JSON 的编辑器都可以直接使用


## 如何使用

配置完成后，可以在 AI 助手中使用以下方式访问 TNUI 文档和工具：

### 快速开始：自动生成页面

直接描述你要的页面：

```
帮我做一个登录页面
```

AI 助手通常会：

1. 识别页面类型为 "login"
2. 从模板库获取推荐组件
3. 生成对应的 uniapp 页面代码
4. 给出基本使用说明

**支持的页面类型**：
| 中文描述 | 英文描述 | 典型组件 |
|---------|---------|---------|
| 登录页面 | login | tn-form, tn-input, tn-button |
| 注册页面 | register | tn-form, tn-input, tn-checkbox, tn-button |
| 首页 | home | tn-swiper, tn-tabs, tn-list |
| 列表页面 | list | tn-search-box, tn-tabs, tn-list |
| 详情页面 | detail | tn-swiper, tn-title, tn-list, tn-button |
| 表单页面 | form | tn-form, tn-form-item, tn-input, tn-picker |
| 个人中心 | user-profile | tn-avatar, tn-list, tn-list-item |
| 聊天页面 | chat | tn-list, tn-input, tn-button |
| 设置页面 | settings | tn-list, tn-switch, tn-button |
| 购物车页面 | cart | tn-checkbox, tn-number-box, tn-button |

### 查询组件

```
请帮我找一个按钮组件
```

AI 助手会调用 `search_components` 工具来搜索相关的 TNUI 组件。

### 获取组件文档

```
请提供 button 组件的详细文档
```

AI 助手会读取 `tuniao://tnui/components/button` 资源来获取详细信息。

### 获取组件索引

```
列出所有可用的 TNUI 组件
```

AI 助手会读取 `tuniao://tnui/components` 资源来获取组件索引。

## 可用的资源

MCP 服务器提供以下资源：

| 资源 URI                          | 名称                   | 描述                 |
| --------------------------------- | ---------------------- | -------------------- |
| `tuniao://tnui/components`        | TNUI Component Index   | 所有 TNUI 组件的索引 |
| `tuniao://tnui/components/{name}` | {name} Component       | 特定组件的详细文档   |
| `tuniao://tnui/overview`          | TNUI Overview          | TNUI 库概览          |
| `tuniao://tnui/maintenance`       | TNUI Maintenance Guide | 维护指南             |
| `tuniao://tnui/page-templates`    | TNUI Page Templates    | 页面模板库           |
| `tuniao://tnui/styles`            | TNUI Style System      | 风格系统和主题       |

## 可用的工具

### 更自然的搜索表达

除了标准组件名，还可以直接使用中文别名、英文关键词或页面场景词。

示例：

```markdown
帮我找一个按钮组件
有没有适合登录页的组件
我想要一个弹窗
给我一个搜索框
轮播图组件用哪个
```

搜索结果会优先结合组件别名、页面场景和文档内容进行排序。

### search_components

搜索 TNUI 组件。

**参数**:

- `query` (string, 必需): 搜索关键词
- `category` (string, 可选): 按组件分类过滤

**示例**:

```
搜索表单相关的组件
```

### get_style_recommendation

获取 TNUI 组件的风格推荐和变体。

**参数**:

- `component` (string, 必需): 组件名称 (tn-button, tn-input, tn-list, tn-modal, tn-popup, tn-tabs, tn-switch, tn-checkbox, tn-radio, tn-swiper)
- `description` (string, 可选): 风格描述，会自动检测关键词

**示例**:

```
红色的大按钮
胶囊标签样式
毛玻璃效果的列表
带动画的开关
```

**自动检测的风格关键词**：

| 关键词                   | 对应属性       |
| ------------------------ | -------------- |
| 主要/primary/蓝色/blue   | type="primary" |
| 成功/success/绿色/green  | type="success" |
| 警告/warning/黄色/yellow | type="warning" |
| 危险/danger/红色/red     | type="danger"  |
| 透明/ghost/无背景        | type="ghost"   |
| 文本/text/文字按钮       | type="text"    |
| 填充/filled/实心         | filled         |
| 描边/outlined/边框       | border         |
| 块级/block/通栏          | block          |
| 圆形/circle              | shape="circle" |
| 小/sm/small/迷你         | size="sm"      |
| 大/lg/large              | size="lg"      |
| 禁用/disabled            | disabled       |
| 毛玻璃/alpha/模糊        | alpha          |
| 卡片/card                | card           |
| 边框/border              | border         |
| 动画/animation/动效      | animation      |
| 胶囊/pills               | pills          |
| 滚动/scroll              | scroll         |
| 等分/flex                | flex           |

**支持的组件风格**：

| 组件        | 支持的风格变体数量                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| tn-button   | 14 种 (primary, default, warning, danger, ghost, text, filled, outlined, block, circle, small, large 等) |
| tn-input    | 9 种 (text, password, number, textarea, search, verify-code, disabled, readonly 等)                      |
| tn-list     | 5 种 (default, alpha, card, border, no-border)                                                           |
| tn-modal    | 6 种 (alert, confirm, dialog, bottom, center, image)                                                     |
| tn-popup    | 5 种 (top, bottom, center, left, right)                                                                  |
| tn-tabs     | 5 种 (scroll, animation, pills, flex, custom)                                                            |
| tn-switch   | 3 种 (default, animation, disabled)                                                                      |
| tn-checkbox | 4 种 (default, circle, button, text)                                                                     |
| tn-radio    | 3 种 (default, button, text)                                                                             |
| tn-swiper   | 4 种 (default, card, flat, custom)                                                                       |

### 服务器无法启动

1. 确保已安装依赖：`pnpm install`
2. 确保已构建项目：`pnpm build`
3. 直接运行 `pnpm start` 或 `tnuitest-mcp start` 查看 stderr 输出

### AI 助手无法连接

1. 确保服务器正在运行
2. 检查配置文件中的路径是否正确
3. 确保使用了正确的命令格式

### 找不到组件

1. 确保文档已嵌入：运行 `pnpm embed`
2. 检查组件名称是否正确
3. 使用 `search_components` 工具进行搜索

## 开发模式

在开发模式下，您可以实时修改代码并重新加载服务器：

```bash
pnpm dev
```

## 自定义配置

当前 CLI 自动配置逻辑不依赖 `MCP_PORT` 之类的运行时端口参数。

可调整的核心内容是客户端配置文件中的 `command`、`args` 和文档根目录相关实现。

## 更多信息

- [Model Context Protocol 官方文档](https://modelcontextprotocol.io)
- [TNUI 官方文档](https://vue3.tuniaokj.com)
- [项目 README](../README.md)
