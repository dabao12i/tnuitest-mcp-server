# TNUI MCP Server 更新说明（v1.0.16 / v1.0.17）

## v1.0.16 更新说明

### 本次更新概览

`v1.0.16` 主要围绕三个方向进行了整理：

- 优化 TNUI MCP 的组件搜索体验
- 统一手动配置方式，补齐 `npx` 标准配置说明
- 收敛对外文案和 npm 发布流程，完成版本发布

发布版本：`tnuitest-mcp-server@1.0.16`

### 1. 优化组件搜索体验

本次将组件搜索能力从原有实现中拆分整理，补充了更完整的自然语言搜索支持。

主要改动包括：

- 抽离独立搜索模块 `mcp/src/search-components.ts`
- 支持按组件名、别名、描述、文档内容进行搜索
- 增强对自然语言问法的识别能力
- 改进搜索结果排序和命中原因展示
- 提升 AI 场景下查询 TNUI 组件时的可用性

相关文件：

- `mcp/src/index.ts`
- `mcp/src/search-components.ts`
- `mcp/test/search-components.test.js`

### 2. 补齐常规 AI 编辑器的 MCP 配置说明

本次明确统一推荐使用下面这种手动 MCP 配置方式：

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

这部分主要是为了让常见 AI 编辑器在没有自动写入能力时，也能直接按统一方式完成配置。

带来的好处：

- 不依赖固定本地路径
- 换机器后更容易复用配置
- 对支持 MCP JSON 的编辑器更通用
- 与后续 Claude、Claude Desktop 的配置方式保持一致

相关文件：

- `mcp/README.md`
- `mcp/USAGE.md`

### 3. 收敛对外展示文案

本次对 MCP 包的对外文案做了整理，减少生硬描述，让 README、USAGE 和 npm 展示页更聚焦实际用途。

主要调整包括：

- 优化 `mcp/package.json` 中的 `description` 和 `keywords`
- 重写 `README.md` 首页和快速开始区域
- 收敛 `USAGE.md` 中配置、使用、说明类文案
- 保留核心能力说明，但整体表达更偏产品说明和使用说明

### 4. 整理 npm 发布流程文档

补充并整理了 npm 发布相关说明，方便后续按固定流程验证和发布。

相关文件：

- `NPM-PUBLISH-GUIDE.md`
- `mcp/README.md`

涉及内容包括：

- 发布前执行测试和构建
- `npm pack --dry-run` 预检
- 版本更新和正式发布流程
- CLI 命令可用性说明

### 5. 修复构建阻塞问题并完成发布

在发布 `v1.0.16` 过程中，还修复了一个 TypeScript 构建问题，确保包可以正常构建和发布。

最终完成：

- 测试通过
- 构建通过
- npm 发布成功
- 版本发布到 `tnuitest-mcp-server@1.0.16`

### v1.0.16 一句话说明

`v1.0.16` 重点优化了 TNUI MCP 的组件搜索体验，统一了常规 AI 编辑器的 `npx` 配置方式，整理了对外文案和 npm 发布流程。

---

## v1.0.17 更新说明

## 本次更新概览

本次版本主要修复了 Claude Code CLI 在当前版本下的 MCP 自动配置兼容问题，并同步更新了相关文档说明。

发布版本：`tnuitest-mcp-server@1.0.17`

## 重点更新

### 1. 修复 Claude Code CLI 自动配置

`tnuitest-mcp setup` 和 `tnuitest-mcp init` 现在会优先使用当前版本 Claude Code CLI 的命令式配置方式：

```bash
claude mcp add -s user tnuitest-mcp npx tnuitest-mcp-server start
```

这意味着在当前版本 Claude Code CLI 中，执行初始化后可以直接识别并连接 `tnuitest-mcp`，不再只依赖旧的 JSON 配置文件。

### 2. 保留旧环境兼容回退

为了兼容旧环境，本次仍然保留了 `~/.claude/mcp.json` 的写入逻辑作为回退方案。

当 `claude` 命令不可用，或命令式配置无法执行时，CLI 会继续尝试写入：

- `~/.claude/mcp.json`

这样既支持当前版本 Claude Code CLI，也不会破坏老环境的使用方式。

### 3. 默认 MCP server 配置统一改为 `npx`

本次将自动写入的 MCP server 配置统一为：

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

这样做的好处：

- 不再依赖固定本地路径或全局安装目录
- 配置在不同机器之间更容易复用
- 与手动配置文档保持一致
- 也适用于 Claude Desktop 和其他支持 MCP JSON 的编辑器

### 4. 修复 Claude 缺失 MCP 时的错误识别

针对 `claude mcp get` 查询不到 `tnuitest-mcp` 的场景，补充了对 CLI 错误输出的识别处理。

现在会同时检查错误对象中的：

- `message`
- `stderr`
- `stdout`

避免因为只识别部分错误信息，导致当前环境本应自动执行 `claude mcp add`，却误回退到旧 JSON 配置。

## 文档同步更新

本次同步更新了以下文档：

- `mcp/README.md`
- `mcp/USAGE.md`

更新内容包括：

- 明确说明 Claude Code CLI 当前优先使用 `claude mcp`
- 保留 `~/.claude/mcp.json` 作为兼容回退
- 将 Claude Desktop 示例统一为 `npx tnuitest-mcp-server start`
- 将其他 MCP 编辑器示例统一为 `npx` 方式
- 删除旧的固定 `node + dist/index.js` 示例，避免误导

## 测试与验证

本次改动已完成以下验证：

### 自动化测试

已通过：

```bash
pnpm --dir "D:/tn-tem/tuniaoui-uniapp-v3-demo/mcp" exec vitest run test/cli-config.test.js
pnpm --dir "D:/tn-tem/tuniaoui-uniapp-v3-demo/mcp" test
```

结果：

- `cli-config` 定向测试通过
- MCP 全量测试通过（27 个测试全部通过）

### 实际环境验证

已验证以下流程：

1. 移除旧的 Claude 用户级 MCP 条目
2. 执行本地 CLI `setup`
3. 通过 `claude mcp get tnuitest-mcp` 确认写入成功
4. 确认最终配置为：

- `Command: npx`
- `Args: tnuitest-mcp-server start`
- `Status: ✓ Connected`

## 本次涉及的主要文件

- `mcp/bin/cli.js`
- `mcp/test/cli-config.test.js`
- `mcp/README.md`
- `mcp/USAGE.md`
- `mcp/package.json`

## 版本结果

当前已发布版本：

- `tnuitest-mcp-server@1.0.17`

## 适合对外说明的一句话

`v1.0.17` 修复了 Claude Code CLI 的 MCP 自动配置兼容问题，当前版本会优先使用 `claude mcp` 自动注册，同时保留旧 JSON 配置回退，并统一改为更便携的 `npx tnuitest-mcp-server start` 配置方式。
