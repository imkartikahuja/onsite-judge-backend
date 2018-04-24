const moment = require('moment');

let t1 = moment();
let times = 5;
let t2 = moment().add(20 * times,'m');

console.log(moment(t1).format("ddd, hA"));

console.log(t1);

console.log(t2.diff(t1,'m'));
console.log(t2);
