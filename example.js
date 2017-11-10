const bip39codec = require('./index.js')


// const result = bip39codec.decode('mention bubble cage unlock zone color invite wet high time')
// console.log(result)

const encoded = bip39codec.encode(new Buffer('cafebabe', 'hex'))
console.log('encoded', encoded)

const decoded = bip39codec.decode(encoded)
console.log('decoded', decoded)