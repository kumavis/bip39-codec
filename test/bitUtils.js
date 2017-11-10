const test = require('tape')
const bitUtils = require('../bitUtils')

test('bitUtils - bufferToBitArray 255', (t) => {

  const bitArray = bitUtils.bufferToBitArray(Buffer.from([255]))
  t.equals(bitArray.length, 8)
  t.equals(bitArray[0], true)
  t.equals(bitArray[1], true)
  t.equals(bitArray[2], true)
  t.equals(bitArray[3], true)
  t.equals(bitArray[4], true)
  t.equals(bitArray[5], true)
  t.equals(bitArray[6], true)
  t.equals(bitArray[7], true)
  t.end()

})

test('bitUtils - bufferToBitArray 85', (t) => {

  const bitArray = bitUtils.bufferToBitArray(Buffer.from([85]))
  t.equals(bitArray.length, 8)
  t.equals(bitArray[0], false)
  t.equals(bitArray[1], true)
  t.equals(bitArray[2], false)
  t.equals(bitArray[3], true)
  t.equals(bitArray[4], false)
  t.equals(bitArray[5], true)
  t.equals(bitArray[6], false)
  t.equals(bitArray[7], true)
  t.end()

})

test('bitUtils - bufferToBitArray multibyte', (t) => {

  const bitArray = bitUtils.bufferToBitArray(Buffer.from([85, 255]))
  t.equals(bitArray.length, 16)
  t.equals(bitArray[0], false)
  t.equals(bitArray[1], true)
  t.equals(bitArray[2], false)
  t.equals(bitArray[3], true)
  t.equals(bitArray[4], false)
  t.equals(bitArray[5], true)
  t.equals(bitArray[6], false)
  t.equals(bitArray[7], true)
  t.equals(bitArray[8], true)
  t.equals(bitArray[9], true)
  t.equals(bitArray[10], true)
  t.equals(bitArray[11], true)
  t.equals(bitArray[12], true)
  t.equals(bitArray[13], true)
  t.equals(bitArray[14], true)
  t.equals(bitArray[15], true)
  t.end()

})

test('bitUtils - bitArrayToBuffer 85', (t) => {

  const bitArray = [false, true, false, true, false, true, false, true]
  const buffer = bitUtils.bitArrayToBuffer(bitArray)
  t.equals(buffer.length, 1)
  t.equals(buffer[0], 85)
  t.end()

})

test('bitUtils - bitArrayToBuffer multibyte', (t) => {

  const bitArray = [false, true, false, true, false, true, false, true, true, true, true, true, true, true, true, true]
  const buffer = bitUtils.bitArrayToBuffer(bitArray)
  t.equals(buffer.length, 2)
  t.equals(buffer[0], 85)
  t.equals(buffer[1], 255)
  t.end()

})

test('bitUtils - bitArrayToBuffer partial byte', (t) => {

  const bitArray = [true]
  const buffer = bitUtils.bitArrayToBuffer(bitArray)
  t.equals(buffer.length, 1)
  t.equals(buffer[0], 1)
  t.end()

})

test('bitUtils - partial byte round trip', (t) => {

  const inputBitArray =                  [false, true, false, true, false, true, true, true, true, true, true, true, true, true]
  const expectedBitArray = [false, false, false, true, false, true, false, true, true, true, true, true, true, true, true, true]
  const inputBuffer = bitUtils.bitArrayToBuffer(inputBitArray)
  const expectedBuffer = bitUtils.bitArrayToBuffer(expectedBitArray)
  t.equals(inputBuffer.length, 2)
  t.ok(inputBuffer.equals(expectedBuffer), 'buffers match')

  const recoveredBitArray = bitUtils.bufferToBitArray(inputBuffer)
  t.equals(recoveredBitArray.length, 16, 'recovered bitArray length')
  t.deepEquals(recoveredBitArray, expectedBitArray, 'recovered bit array matches left-padded')

  t.end()

})

test('bitUtils - bitArrayToBinary', (t) => {

  const inputBitArray = [false, true, false, true, false, true, true, true, true, true, true, true, true, true]
  const expectedBinary = '01010111111111'
  const result = bitUtils.bitArrayToBinary(inputBitArray)
  t.equals(result, expectedBinary)
  t.end()

})

test('bitUtils - integer to binary flow', (t) => {

  const value = 123456
  const valueBuffer = bitUtils.integerToBuffer(value)
  const hex = valueBuffer.toString('hex')
  let expectedHex = value.toString(16)
  if (expectedHex.length % 2) expectedHex = '0' + expectedHex
  t.equals(hex, expectedHex, 'matching hex')
  const valueBitArray = bitUtils.bufferToBitArray(valueBuffer)
  const binary = bitUtils.bitArrayToBinary(valueBitArray)
  const firstOne = binary.indexOf('1')
  const shortenedBinary = binary.slice(firstOne)
  const expectedBinary = value.toString(2)
  t.equals(shortenedBinary, expectedBinary, 'matching bin')
  t.end()

})