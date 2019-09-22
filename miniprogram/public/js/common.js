function formatDate(t, e = "-") {
  var i = function (t) {
    return t > 9 ? t : "0" + t
  };
  return ("number" == typeof t || "string" == typeof t)
    && (t = new Date(t)), [t.getFullYear(), i(t.getMonth() + 1), i(t.getDate())].join(e || "")
}

module.exports = {
  formatDate
}