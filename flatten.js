module.exports = flatten

function flatten(ary, ret) {
  return ary.reduce(function(ret, entry) {
    if (Array.isArray(entry)) {
      flatten(entry, ret)
    } else {
      ret.push(entry)
    }
    return ret
  }, ret || [])
}