function pluck(array, key) {
  return array.map(function (object) {
    return object[key];
  })
}

function stubLocation(url) {
  var location = document.createElement('a');
  location.href = url;
  return location;
}
