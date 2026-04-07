# TNUI MCP Server

用于查询 TNUI（图鸟 UI）组件文档、生成页面示例和提供组件风格建议的 MCP Server。

## 特性

- 提供标准 MCP 工具接口
- 内置 TNUI 组件文档，无需额外拉取文档资源
- 支持根据页面描述生成 uniapp 页面代码
- 支持根据描述给出组件风格建议
- 支持按组件名、别名、描述和文档内容搜索组件
- 提供 CLI，用于启动服务和写入常见编辑器配置

---

## 快速开始

```bash
# 安装
npm install -g tnuitest-mcp-server

# 写入编辑器配置（安装后可执行）
tnuitest-mcp init

# 启动 MCP 服务器
tnuitest-mcp start
```

`setup` / `init` 默认会尝试写入以下用户级配置：

- `~/.codex/config.toml`
- `~/.claude/mcp.json`
- Claude Desktop 配置文件

### Windows 用户

如果全局命令不可用，使用 `npx`：

```bash
npx tnuitest-mcp-server setup
npx tnuitest-mcp-server start
```

---

## CLI 命令

| 命令                 | 说明            |
| -------------------- | --------------- |
| `tnuitest-mcp start` | 启动 MCP 服务器 |
| `tnuitest-mcp setup` | 配置 AI 编辑器  |
| `tnuitest-mcp init`  | 一键安装+配置   |

---

## 支持的 AI 编辑器

- Codex
- Claude Code CLI
- Claude Desktop

安装后会尝试为以上编辑器写入用户级 MCP 配置；对当前版本 Claude Code CLI 会优先使用 `claude mcp`，旧环境仍保留 JSON 回退。

---

## 手动配置其他编辑器

如果编辑器支持 MCP JSON 配置，但没有自动写入能力，可以使用下面这种通用 `npx` 方式：

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

这种方式适合：

- 不想依赖全局安装路径
- 希望不同机器配置更统一
- 编辑器只支持手动填写 `command` / `args`

### Trae 配置

在 `C:\Users\用户名\.trae\mcp.json` 中添加：

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

如果您已经全局安装，也可以改用固定路径方式：

```json
{
  "mcpServers": {
    "tnuitest-mcp": {
      "command": "node",
      "args": [
        "C:\\Users\\用户名\\AppData\\Roaming\\npm\\node_modules\\tnuitest-mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

---

## 验证 MCP 服务器

### 1. 安装验证

```bash
npm list -g tnuitest-mcp-server
```

### 2. CLI 命令验证

```bash
tnuitest-mcp help
```

### 3. 服务器启动验证

```bash
tnuitest-mcp start
```

预期输出：`启动 TNUI MCP Server...`

### 4. AI 编辑器验证

1. 运行 `tnuitest-mcp setup` 配置编辑器
2. 重启 AI 编辑器
3. 发送测试消息验证功能

### 测试用例

```markdown
帮我找一个按钮组件
帮我做一个登录页面
button 组件怎么使用
按钮有哪些风格
列出所有组件
```

---

## MCP 工具说明

### 更自然的查询方式

现在 `search_components` 支持更口语化的问法，不必严格写标准组件名。

```markdown
帮我找一个按钮组件
有没有适合登录页的组件
我想要一个弹窗
给我一个搜索框
轮播图组件用哪个
```

这些问法会结合组件别名、页面场景和常见关键词返回结果。

### 1. search_components

搜索 TNUI 组件

**参数**:

- `query` (必需): 搜索关键词
- `category` (可选): 组件分类

### 2. generate_page

自动生成 uniapp 页面

**参数**:

- `pageType` (可选): 页面类型
- `pageDescription` (必需): 页面描述
- `stylePreferences` (可选): 风格偏好

### 3. get_style_recommendation

获取组件风格推荐

**参数**:

- `component` (必需): 组件名称
- `description` (可选): 风格描述

### 4. get_component_docs

获取组件详细文档

**参数**:

- `component` (必需): 组件名称
- `section` (可选): 文档章节

### 5. list_components

列出所有组件

**参数**:

- `category` (可选): 分类过滤
- `format` (可选): 输出格式

---

## 支持的页面类型

- login (登录)
- register (注册)
- home (首页)
- list (列表)
- detail (详情)
- form (表单)
- user-profile (个人中心)
- chat (聊天)
- settings (设置)
- cart (购物车)

---

## 常见问题

### Q: 提示找不到 tnuitest-mcp 命令？

**解决**:

```bash
# 确认已全局安装
npm list -g tnuitest-mcp-server

# Windows 添加环境变量
setx PATH "%PATH%;%APPDATA%\npm"
```

### Q: AI 编辑器无法连接 MCP 服务器？

**解决**:

1. 确认 MCP 服务器正在运行
2. 重启 AI 编辑器
3. 检查配置文件

### Q: 配置成功但工具不工作？

**解决**:

1. 确认服务器正在运行
2. 重启 AI 编辑器
3. 检查 MCP 工具是否加载

---

## 开发者文档

### 本地开发

```bash
# 进入 mcp 目录
cd mcp

# 安装依赖
pnpm install

# 构建
pnpm build

# 启动服务器
pnpm start

# 开发模式（热重载）
pnpm dev
```

### 发布到 npm

```bash
cd mcp
pnpm test
pnpm build
npm pack --dry-run
npm version patch
npm publish
```

### 版本更新

```bash
# 补丁版本
npm version patch

# 次版本
npm version minor

# 主版本
npm version major
```

如果版本号已手动修改，发布前仍建议执行 `pnpm test`、`pnpm build` 和 `npm pack --dry-run`。

---

## 项目结构

```
mcp/
├── bin/
│   └── cli.js              # CLI 入口
├── dist/                   # 编译输出
├── src/                    # 源代码
│   ├── index.ts            # 主入口
│   ├── embedded-docs.ts    # 嵌入的文档数据
│   ├── page-templates.ts   # 页面模板
│   └── style-system.ts     # 风格系统
├── package.json
└── README.md
```

---

## 许可证

MIT

---

## 相关链接

- npm: https://www.npmjs.com/package/tnuitest-mcp-server
