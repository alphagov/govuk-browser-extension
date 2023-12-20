function pluck (array, key) {
  return array.map(function (object) {
    return object[key]
  })
}
