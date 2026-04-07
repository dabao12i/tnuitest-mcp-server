#!/usr/bin/env node

const { execFileSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

const SERVER_NAME = 'tnuitest-mcp'

function getHomeDir() {
  return os.homedir()
}

function getServerScriptPath() {
  return path.resolve(__dirname, '../dist/index.js')
}

function getCodexConfigPath() {
  const home = getHomeDir()
  return path.join(home, '.codex', 'config.toml')
}

function getClaudeCliConfigPath(homeDir = getHomeDir()) {
  return path.join(homeDir, '.claude', 'mcp.json')
}

function getClaudeDesktopConfigPath(
  platform = process.platform,
  env = process.env,
  homeDir = getHomeDir()
) {
  if (platform === 'win32') {
    const appData = env.APPDATA || path.join(homeDir, 'AppData', 'Roaming')
    return path.join(appData, 'Claude', 'claude_desktop_config.json')
  }

  if (platform === 'darwin') {
    return path.join(
      homeDir,
      'Library',
      'Application Support',
      'Claude',
      'claude_desktop_config.json'
    )
  }

  return null
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readTomlConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      return fs.readFileSync(configPath, 'utf-8')
    }
  } catch (e) {
    console.error(`读取配置文件失败: ${e.message}`)
  }
  return ''
}

function writeTomlConfig(configPath, content) {
  try {
    const dir = path.dirname(configPath)
    ensureDir(dir)
    fs.appendFileSync(configPath, content, 'utf-8')
    return true
  } catch (e) {
    console.error(`写入配置文件失败: ${e.message}`)
    return false
  }
}

function createMcpServerEntry() {
  return {
    command: 'npx',
    args: ['tnuitest-mcp-server', 'start'],
  }
}

function readJsonConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return {}
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch (error) {
    throw new Error(`读取 JSON 配置文件失败: ${error.message}`)
  }
}

function writeJsonConfig(configPath, data) {
  ensureDir(path.dirname(configPath))
  fs.writeFileSync(configPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')
}

function mergeMcpServer(config, serverName, serverConfig) {
  const nextConfig = {
    ...config,
    mcpServers: {
      ...(config.mcpServers || {}),
    },
  }

  if (nextConfig.mcpServers[serverName]) {
    return {
      status: 'exists',
      config,
    }
  }

  nextConfig.mcpServers[serverName] = serverConfig

  return {
    status: 'updated',
    config: nextConfig,
  }
}

function isMissingClaudeMcp(error) {
  const parts = [error && error.message, error && error.stderr, error && error.stdout]
    .filter(Boolean)
    .join('\n')

  return parts.includes('No MCP server found with name: tnuitest-mcp')
}

function configureClaudeCliViaCommand(logger = console, runner = execFileSync) {
  try {
    runner('claude', ['mcp', 'get', SERVER_NAME], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    logger.log(`  ℹ Claude Code CLI 已存在: ${SERVER_NAME}`)
    return true
  } catch (error) {
    if (!isMissingClaudeMcp(error)) {
      throw error
    }
  }

  runner(
    'claude',
    ['mcp', 'add', '-s', 'user', SERVER_NAME, 'npx', 'tnuitest-mcp-server', 'start'],
    {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )

  logger.log(`  ✓ Claude Code CLI: 已通过 claude mcp add 写入 ${SERVER_NAME}`)
  return true
}

function setupJsonMcpConfig(targetLabel, configPath, logger = console) {
  try {
    const currentConfig = readJsonConfig(configPath)
    const merged = mergeMcpServer(currentConfig, SERVER_NAME, createMcpServerEntry())

    if (merged.status === 'exists') {
      logger.log(`  ℹ ${SERVER_NAME} 已存在: ${configPath}`)
      return true
    }

    writeJsonConfig(configPath, merged.config)
    logger.log(`  ✓ ${targetLabel}: ${configPath}`)
    return true
  } catch (error) {
    logger.error(`  ✗ ${targetLabel} 写入失败: ${error.message}`)
    return false
  }
}

function setupCodex(logger = console) {
  const configPath = getCodexConfigPath()
  const existingContent = readTomlConfig(configPath)

  const mcpConfig = `[mcp_servers.${SERVER_NAME}]
command = "node"
args = ["__PATH__"]
`
  const tomlPath = getServerScriptPath().replace(/\\/g, '\\\\')
  const finalConfig = mcpConfig.replace('__PATH__', tomlPath)

  if (existingContent.includes(`[mcp_servers.${SERVER_NAME}]`)) {
    logger.log(`  ℹ ${SERVER_NAME} 已存在: ${configPath}`)
    return true
  }

  if (writeTomlConfig(configPath, '\n' + finalConfig)) {
    logger.log(`  ✓ Codex: ${configPath}`)
    return true
  }
  return false
}

function setupClaudeCli(logger = console, deps = {}) {
  const runner = deps.execFileSync || execFileSync
  const setupJsonFallback =
    deps.setupJsonFallback ||
    (() => setupJsonMcpConfig('Claude Code CLI (fallback)', getClaudeCliConfigPath(), logger))

  let commandConfigured = false

  try {
    commandConfigured = configureClaudeCliViaCommand(logger, runner)
  } catch (error) {
    logger.log(`  ℹ Claude Code CLI 命令方式不可用，回退到 ~/.claude/mcp.json: ${error.message}`)
  }

  const fallbackConfigured = setupJsonFallback()
  return Boolean(commandConfigured || fallbackConfigured)
}

function setupClaudeDesktop(logger = console) {
  const configPath = getClaudeDesktopConfigPath()

  if (!configPath) {
    logger.log('  ℹ Claude Desktop: 当前平台无默认配置路径，已跳过')
    return true
  }

  return setupJsonMcpConfig('Claude Desktop', configPath, logger)
}

function startServer() {
  console.log('启动 TNUI MCP Server...')

  const child = spawn('node', [getServerScriptPath()], {
    stdio: 'inherit',
    shell: true,
  })

  child.on('error', (err) => {
    console.error('启动失败:', err.message)
    process.exit(1)
  })

  process.on('SIGINT', () => {
    child.kill('SIGINT')
    process.exit(0)
  })
}

function showHelp() {
  console.log(`
TNUI MCP Server CLI

用法:
  npx tnuitest-mcp-server <命令>

命令:
  start     启动 MCP 服务器
  setup     配置 Codex / Claude
  init      一键安装+配置
  help      显示帮助信息

示例:
  npx tnuitest-mcp-server start    启动服务器
  npx tnuitest-mcp-server setup    配置编辑器
  npx tnuitest-mcp-server help     查看帮助

支持的编辑器:
  - Codex
  - Claude Code CLI
  - Claude Desktop
`)
}

function runSetup(deps = {}) {
  const logger = deps.logger || console
  const runCodex = deps.setupCodex || setupCodex
  const runClaudeCli = deps.setupClaudeCli || setupClaudeCli
  const runClaudeDesktop = deps.setupClaudeDesktop || setupClaudeDesktop

  logger.log('\n正在配置编辑器...\n')
  const results = [runCodex(logger), runClaudeCli(logger), runClaudeDesktop(logger)]

  if (results.every(Boolean)) {
    logger.log('\n配置完成!')
  } else {
    logger.log('\n配置完成，但部分目标写入失败，请检查上面的错误信息。')
  }

  logger.log('请重启 Codex / Claude 使配置生效。')
}

function runInit(deps = {}) {
  const logger = deps.logger || console
  const runCodex = deps.setupCodex || setupCodex
  const runClaudeCli = deps.setupClaudeCli || setupClaudeCli
  const runClaudeDesktop = deps.setupClaudeDesktop || setupClaudeDesktop

  logger.log('执行一键初始化...\n')
  const results = [runCodex(logger), runClaudeCli(logger), runClaudeDesktop(logger)]

  if (results.every(Boolean)) {
    logger.log('\n初始化完成! 服务器已准备好使用。')
  } else {
    logger.log('\n初始化完成，但部分目标写入失败，请检查上面的错误信息。')
  }

  logger.log('如 Claude 已在运行，请重启客户端加载 MCP 配置。')
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'help'

  switch (command) {
    case 'start':
      startServer()
      break
    case 'setup':
      runSetup()
      break
    case 'init':
      runInit()
      break
    case 'help':
    default:
      showHelp()
      break
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  createMcpServerEntry,
  getClaudeCliConfigPath,
  getClaudeDesktopConfigPath,
  mergeMcpServer,
  runInit,
  runSetup,
  setupClaudeCli,
  setupClaudeDesktop,
  setupJsonMcpConfig,
}
