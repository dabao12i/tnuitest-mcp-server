const { spawn } = require('child_process')
const path = require('path')

const serverPath = path.join(__dirname, 'dist', 'index.js')

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
})

let requestId = 1

function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: requestId++,
    method,
    params,
  }
  server.stdin.write(JSON.stringify(request) + '\n')
}

server.stdout.on('data', (data) => {
  try {
    const lines = data
      .toString()
      .split('\n')
      .filter((l) => l.trim())
    for (const line of lines) {
      try {
        const response = JSON.parse(line)
        console.log('Response:', JSON.stringify(response, null, 2))
      } catch (e) {
        // Skip non-JSON
      }
    }
  } catch (e) {
    console.log('stdout:', data.toString())
  }
})

server.stderr.on('data', (data) => {
  console.log('stderr:', data.toString())
})

server.on('close', (code) => {
  console.log('Server closed with code:', code)
})

setTimeout(() => {
  console.log('\n--- Test 1: Initialize ---')
  sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-cli', version: '1.0.0' },
  })
}, 500)

setTimeout(() => {
  console.log('\n--- Test 2: List Tools ---')
  sendRequest('tools/list')
}, 1000)

setTimeout(() => {
  console.log('\n--- Test 3: Call search_components ---')
  sendRequest('tools/call', {
    name: 'search_components',
    arguments: { query: '按钮' },
  })
}, 1500)

setTimeout(() => {
  console.log('\n--- Test 4: Call list_components ---')
  sendRequest('tools/call', {
    name: 'list_components',
    arguments: {},
  })
}, 2000)

setTimeout(() => {
  console.log('\n--- Test done, exiting ---')
  server.kill()
  process.exit(0)
}, 3000)
