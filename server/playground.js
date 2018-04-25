const moment = require('moment');

let t1 = moment();
let times = 5;
let t2 = moment().add(20 * times,'m');

console.log(moment(t1).format("ddd, hA"));

console.log(t1);

console.log(t2.diff(t1,'m'));
console.log(t2);

console.log(`#include<bits/stdc++.h>\nusing namespace std;\n#define pb push_back\ntypedef vector<long long int> vi;\ntypedef long long int ll;\n#define FOR(i,n) for(int (i)=0;(i)<(n);++(i))\n#define FORI(i,n) for(int (i)=1;(i)<=(n);++(i))\n#define REP(i,a,b) for(int (i)=(a);(i)<=(b);++i)\n#define vin vi arr; for(long long int i=0;i<n;i++){long long int a;cin>>a;arr.pb(a);}\n#define FAST ios_base::sync_with_stdio(0);cin.tie(0);cout.tie(0);\nint main()\n{\nll n;\ncin>>n;\nvin\nll m;\ncin>>m;\nwhile(m--){\nll x;\ncin>>x;\nFOR(i,n)\n{\nif(x<arr[i])\narr[i]--;\n}\n}\nFOR(i,n)\ncout<<arr[i]<<" ";\nreturn 0;\n}`);
