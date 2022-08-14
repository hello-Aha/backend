/* eslint-disable require-jsdoc */

function ipTester(ip: string): any {
  const re = new RegExp('((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$');
  const ipArr = ip.split(':');
  ip = ipArr[ipArr.length - 1];
  return {result: re.test(ip), ip};
}

export default ipTester;
