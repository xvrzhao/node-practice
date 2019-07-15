function next() {
    // 不断为 `nextTick 微任务队列` 添加任务，导致该队列任务一直执行不完
    // 从而阻塞了事件循环
    process.nextTick(next)
}
next()

// timer callback 队列在微任务队列之后执行，导致该任务无法执行
setTimeout(() => {
    console.log('timeout')
}, 0)
