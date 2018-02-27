// use unorm until String.prototype.normalize gets better browser support
const unorm = require('unorm')
const bitUtils = require('./bitUtils')
const chunk = require('./chunk')
const flatten = require('./flatten')

const ENGLISH_LANGUAGE = require('./language/english.json')
const DEFAULT_LANGUAGE = ENGLISH_LANGUAGE

const INVALID_ENCODING = 'Invalid encoding'
const INVALID_LANGUAGE = 'Invalid language'
const INVALID_CHECKSUM = 'Invalid encoded checksum'

module.exports = { encode, decode, rawEncode, rawDecode }

 // buffer -> bitArray -> word chunks -> word buffers -> word ints -> words
 // words -> word ints -> word buffers

function encode(decoded, language = DEFAULT_LANGUAGE) {
  if (!Buffer.isBuffer(decoded)) throw new Error(INVALID_ENCODING)
  const length = decoded.length
  // console.log('in buffer', decoded)
  // console.log('in length', length)
  const lengthBuffer = bitUtils.integerToBuffer(length)
  const lengthPrefixedDecoded = Buffer.concat([lengthBuffer, decoded])
  // console.log('in raw', lengthPrefixedDecoded)
  return rawEncode(lengthPrefixedDecoded, language)
}

function decode(encoded, language = DEFAULT_LANGUAGE) {
  const lengthPrefixedDecoded = rawDecode(encoded, language)
  const lengthBuffer = lengthPrefixedDecoded.slice(0, 1)
  const length = bitUtils.bufferToInteger(lengthBuffer)
  // console.log('out raw', lengthPrefixedDecoded)
  // console.log('out length', length)
  const decoded = lengthPrefixedDecoded.slice(-length)
  // console.log('out buffer', decoded)

  return decoded
}

function rawEncode (decoded, language = DEFAULT_LANGUAGE) {
  if (!Buffer.isBuffer(decoded)) throw new Error(INVALID_ENCODING)
  // validate language and get per-word bitCount
  const wordBitLength = Math.log(language.wordlist.length) / Math.log(2)
  if (!Number.isInteger(wordBitLength)) throw new Error(INVALID_LANGUAGE)
  if (typeof language.separator !== 'string') throw new Error(INVALID_LANGUAGE)
  const wordlist = language.wordlist

  const decodedBitLength = decoded.length * 8
  const wordCount = Math.ceil(decodedBitLength / wordBitLength)
  const encodedBitLength = wordCount * wordBitLength
  const encodedByteLength = encodedBitLength / 8
  const decodedBitPadding = encodedBitLength - decodedBitLength

  const bitArray = bitUtils.bufferToBitArray(decoded)
  const lengthAdjustedBitArray = bitUtils.leftPadBitArray(bitArray, encodedBitLength)
  // console.log('input buffer', decoded)
  // console.log('input bitArray', bitUtils.bitArrayToBinary(lengthAdjustedBitArray), lengthAdjustedBitArray.length)

  const wordChunks = chunk(lengthAdjustedBitArray, wordBitLength)
  // console.log('input word chunk\n', wordChunks.map(bitUtils.bitArrayToBinary))

  const words = wordChunks.map((wordBitArray) => {
    const wordBuffer = bitUtils.bitArrayToBuffer(wordBitArray)
    const index = bitUtils.bufferToInteger(wordBuffer)
    return wordlist[index]
  })
  const encoded = words.join(language.separator)

  return encoded
}


function rawDecode (encoded, language = DEFAULT_LANGUAGE) {
  // validate language and get per-word bitCount
  const wordBitLength = Math.log(language.wordlist.length) / Math.log(2)
  if (!Number.isInteger(wordBitLength)) throw new Error(INVALID_LANGUAGE)
  if (typeof language.separator !== 'string') throw new Error(INVALID_LANGUAGE)
  const wordlist = language.wordlist

  // get words from input
  const words = unorm.nfkd(encoded).split(language.separator)
  const wordCount = words.length

  // convert words to bit strings
  const encodedBitLength = wordCount * wordBitLength
  // console.log('encodedBitLength', encodedBitLength)
  const encodedByteLength = Math.ceil(encodedBitLength / 8)
  // console.log('encodedByteLength', encodedByteLength)
  const decodedBitPadding = ( encodedByteLength * 8 ) - encodedBitLength
  // console.log('decodedBitPadding', decodedBitPadding)

  // read each word into the bitArray
  const wordValues = words.map((word) => {
    const value = wordlist.indexOf(word)
    if (value === -1) throw new Error(INVALID_ENCODING)
    return value
  })
  // console.log('wordValues', wordValues)
  const wordBitArrays = wordValues.map((value) => {
    const valueBuffer = bitUtils.integerToBuffer(value)
    const valueBitArray = bitUtils.bufferToBitArray(valueBuffer)
    // ensure length is exactly wordBitLength
    const paddedBitArray = bitUtils.leftPadBitArray(valueBitArray, wordBitLength)
    const lengthAdjustedBitArray = paddedBitArray.slice(-wordBitLength)
    return lengthAdjustedBitArray
  })
  // console.log('out word chunk\n', wordBitArrays.map(bitUtils.bitArrayToBinary))

  const bitArray = flatten(wordBitArrays)
  const bytes = bitUtils.bitArrayToBuffer(bitArray)
  const firstNonZeroByte = bytes.findIndex(byte => byte > 0)
  // trim preceding zero bytes
  const decoded = bytes.slice(firstNonZeroByte)

  return decoded
}
