// 创建 6 字节的一段内存区域，被初始化为 <00, 00, 00, 00, 00, 00>
const buffer = new ArrayBuffer(6)
// 为这段内存创建视图，视图数组每个元素都为 8 位 (1 字节)
const uint8View = new Uint8Array(buffer)
uint8View[1] = 0x2a
uint8View[3] = 0xaf
// 这时这段内存为 <00 2a 00 af 00 00>，即单字节的读写不存在小端字节序的问题
console.log(buffer)

// 为这段内存创建视图，视图数组每个元素都为 16 位 (2 字节)
const uint16View = new Uint16Array(buffer)
// 这时对视图的读写操作都是多字节操作（因为数组内每个元素都代表 2 个字节）所以需要注意小端字节序的问题
// 现在视图应该是这样的 <00 2a | 00 af | 00 00>
// 读取视图第二个元素，由于是小端字节序，所以取到的应该是 af00 (这也是实际表示的数)
console.log(uint16View[1].toString(16))
// 接着对视图第三个元素进行写入操作
uint16View[2] = 0x1234
// 由于是小端字节序，所以存入的字节是倒序方式排列存储的 <00 2a 00 af 34 12>
console.log(buffer)