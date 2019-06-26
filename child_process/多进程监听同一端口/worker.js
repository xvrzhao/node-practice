const http = require('http')
const fs = require('fs')

// 创建 http 服务器，当有 tcp 连接时来手动触发 http 服务器的事件
const httpServer = http.createServer()
httpServer.on('request', (req, res) => {
    fs.writeFileSync('./log', `http handled by child process (${process.pid}), ${new Date}\n`, {flag: 'a'})
    res.end(`Hello from child process (${process.pid})`)
})

// 子进程接收到主进程发来的 tcp 服务器句柄
process.on('message', (message, tcpServer) => {
    if (message === 'tcpServer') {
        tcpServer.on('connection', socket => {
            // 记录日志，用以证明当有 tcp 连接时，是只有一个子进程触发了事件，还是所有子进程同时触发了事件
            fs.writeFileSync('./log', `tcp  handled by child process (${process.pid}), ${new Date}\n`, {flag: 'a'})
            // 手动触发 http 服务器的 connection 事件，并将 socket（双工流）传入，http 服务器内部会
            // 根据协议将消息解析成 request（只读流）和 response（只写流）并触发自己的 request 事件
            httpServer.emit('connection', socket)
        })
    }
})