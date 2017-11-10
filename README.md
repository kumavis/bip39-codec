# bip39 codec

encode buffers into words, like bip39.

easy way for humans to take small amounts of binary data and:
- write it down
- or say it over the telephone

### behavior

guarantees matching input and output content and length,

but does include any correctness check for user-error (e.g. skipped or swapped words)

### example

```js
const initial = Buffer.from('deadbeefcafe', 'hex') // <Buffer de ad be ef ca fe>
const encoded = bip39codec.encode(initial) // "abandon asset turn term sand garlic"
const decoded = bip39codec.decode(encoded) // <Buffer de ad be ef ca fe>
```