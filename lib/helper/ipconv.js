module.exports = {
  itos(intval) {
    return [
      intval >> 24 & 0xff,
      intval >> 16 & 0xff,
      intval >> 8 & 0xff,
      intval & 0xff
    ].join('.');
  },
  stoi(ipstr) {
    return ipstr.split('.').map((octet, index, array) => {
      return parseInt(octet) * Math.pow(256, (array.length - index - 1));
    }).reduce((prev, curr) => {
      return prev + curr;
    });
  }
};