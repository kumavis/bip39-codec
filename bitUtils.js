const chunk = require('./chunk')

module.exports = {
  integerToBuffer,
  bufferToInteger,
  bitArrayToBuffer,
  bufferToBitArray,
  bitArrayToBinary,
  leftPadBitArray,
}

function integerToBuffer(int) {
  let hex = int.toString(16)
  if (hex.length % 2) hex = '0' + hex
  return Buffer.from(hex, 'hex')
}

function bufferToInteger(buffer) {
  return Number.parseInt(buffer.toString('hex'), 16)
}

function bitArrayToBuffer(_bitArray) {
  const expectedLength = Math.ceil(_bitArray.length / 8) * 8
  const bitArray = leftPadBitArray(_bitArray, expectedLength)
  return Buffer.from(chunk(bitArray, 8).map(bitsToByte))
}

function bufferToBitArray(buffer) {
  const bufferLength = buffer.length
  const bitArray = new Array(bufferLength * 8)
  for (let byteIndex = 0; byteIndex < bufferLength; byteIndex++) {
    const byte = buffer[byteIndex]
    const bitBaseIndex = byteIndex * 8
    bitArray[bitBaseIndex] = !!(byte & 128)
    bitArray[bitBaseIndex + 1] = !!(byte & 64)
    bitArray[bitBaseIndex + 2] = !!(byte & 32)
    bitArray[bitBaseIndex + 3] = !!(byte & 16)
    bitArray[bitBaseIndex + 4] = !!(byte & 8)
    bitArray[bitBaseIndex + 5] = !!(byte & 4)
    bitArray[bitBaseIndex + 6] = !!(byte & 2)
    bitArray[bitBaseIndex + 7] = !!(byte & 1)
  }
  return bitArray
}

function bitArrayToBinary(bitArray){
  return bitArray.map(e => e?1:0).join('')
}

function bitsToByte(_bitArray) {
  const bitArray = leftPadBitArray(_bitArray, 8)
  const result = (
    (bitArray[0] << 7) +
    (bitArray[1] << 6) +
    (bitArray[2] << 5) +
    (bitArray[3] << 4) +
    (bitArray[4] << 3) +
    (bitArray[5] << 2) +
    (bitArray[6] << 1) +
    (bitArray[7] << 0)
  )
  // console.log('bitsToByte', bitArray, result)
  return result
}

function leftPadBitArray(_arr, length) {
  let arr = _arr.slice()
  while (arr.length < length) {
    arr.unshift(false)
  }
  return arr
}
