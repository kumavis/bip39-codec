const test = require('tape')
const bip39codec = require('../index')


test('codec - encode "ff"', (t) => {

  const initial = Buffer.from('ff', 'hex')
  const encoded = bip39codec.encode(initial)
  const decoded = bip39codec.decode(encoded)
  t.ok(initial.equals(decoded), 'inital matches decoded')
  t.end()

})

test('codec - encode "00"', (t) => {

  const initial = Buffer.from('00', 'hex')
  const encoded = bip39codec.encode(initial)
  const decoded = bip39codec.decode(encoded)
  t.ok(initial.equals(decoded), 'inital matches decoded')
  t.end()

})

test('codec - encode "abad1dea"', (t) => {

  const initial = Buffer.from('abad1dea', 'hex')
  const encoded = bip39codec.encode(initial)
  const decoded = bip39codec.decode(encoded)
  t.ok(initial.equals(decoded), 'inital matches decoded')
  t.end()

})

test('codec - encode "deadbeefcafe"', (t) => {

  const initial = Buffer.from('deadbeefcafe', 'hex')
  const encoded = bip39codec.encode(initial)
  const decoded = bip39codec.decode(encoded)
  t.ok(initial.equals(decoded), 'inital matches decoded')
  t.end()

})

test('codec - encode "000123456789abcdef00"', (t) => {

  const initial = Buffer.from('000123456789abcdef00', 'hex')
  const encoded = bip39codec.encode(initial)
  const decoded = bip39codec.decode(encoded)
  // console.log(initial, encoded, decoded)
  t.ok(initial.equals(decoded), 'inital matches decoded')
  t.end()

})
