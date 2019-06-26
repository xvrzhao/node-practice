const { fork } = require('child_process')
const cpus = require('os').cpus()
const net = require('net')

// 根据 cpu 核数来创建子进程
const childProcesses = []
for (let i = 0; i < cpus.length; i++) {
    childProcesses.push(fork('./worker.js'))
}

// 创建 tcp 服务器，在监听端口之后把服务器句柄传递给每个子进程，并关闭服务。
// 通过传递服务器句柄的方式来达到多个子进程可以同时监听一个端口的效果。
const tcpServer = net.createServer()
tcpServer.listen(5800, () => {
    for (const childProcess of childProcesses) {
        childProcess.send('tcpServer', tcpServer)
    }
    tcpServer.close()
})