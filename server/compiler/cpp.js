const fs = require('fs');
const { exec } = require('child_process');
const moment = require('moment');

const compileCpp = (code,time_limit,userId, problemCode,contestName ,cb) => {
  const defaults = {
    encoding: 'utf8',
    timeout: time_limit,
    maxBuffer: 2000 * 1024,
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
  };

  // userId = "5acde196528b1829144a9b2f";
  // userId = Math.floor(Math.random() * 200);

  exec(`mkdir ./tmp/${userId}`,(error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
  exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return cb(error);
        }
        console.log(`${userId} folder deleted`);
      });
      return cb(error);
    }
    console.log(`${userId} folder created`);

  fs.writeFile(`./tmp/${userId}/code.cpp`, code, (err) => {
        if (err) {console.log(err);
   exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return cb(error);
        }
        console.log(`${userId} folder deleted`);
      });
      return cb(err);
    }

      // success case, the file was saved
      console.log('Code saved!');

      //compile code
    exec(`g++ -o tmp/${userId}/a.out tmp/${userId}/code.cpp`, (error, stdout, stderr) => {
        if (error) {
           console.error(`exec error: ${error}`);

          exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return cb(error);
            }
            console.log(`${userId} folder deleted`);
          });
          return cb('Compilation Error');
        }

        console.time('execute');
        var start = moment().valueOf();
      exec(`tmp/${userId}/./a.out < contests/${contestName}/${problemCode}/in.txt`, defaults,(error, stdout, stderr) => {
          if (error) {
            if(error.code == 139){
              console.log('Segmentation fault');
              exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return cb(error);
                }
                console.log(`${userId} folder deleted`);
              });
              return cb('Segmentation fault');
            } else if (error.signal == 'SIGTERM') {
              console.log('Time limit exceeded');
              exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return cb(error);
                }
                console.log(`${userId} folder deleted`);
              });
              return cb('TLE');
            }
            console.error(`exec error: ${error}`);
            //console.log(error);
           exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return cb(error);
              }
              console.log(`${userId} folder deleted`);
            });
            return cb(error);
          }
           //console.log(`stdout: ${stdout}`);
           var time;
           time = console.timeEnd('execute');

          var end = moment().valueOf();
          // time = end.diff(start,'ms');
          time = (end - start);
           console.log('time:',time);



          fs.writeFileSync(`tmp/${userId}/output.txt`,stdout);
          console.log(`stderr: ${stderr}`);


        exec(`cmp tmp/${userId}/output.txt contests/${contestName}/${problemCode}/out.txt`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Wrong Answer`);
              exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return cb(error);
                }
                console.log(`${userId} folder deleted`);
              });
              return cb('Wrong Answer');
            }

            console.log('Correct Answer');

            exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return error;
              }
              console.log(`${userId} folder deleted`);
            });
            return cb(`Correct Answer ${time} msec`);
          });

        });

      });
    });

  });


}

module.exports = {compileCpp};


// compileCpp(`#include<bits/stdc++.h>
// using namespace std;
// #define pb push_back
// typedef vector<int> vi;
// typedef long long int ll;
//
// int main()
// {
//     //int arr[10000000000];
//     ll t;
//     cin>>t;
//     while(t--)
//     {
//         cout<<"Hello World!\\n";
//     }
//     return 0;
// }
// `,1000);

// compileCpp(`#include<bits/stdc++.h>
// using namespace std;
// #define pb push_back
// typedef vector<long long int> vi;
// typedef long long int ll;
// #define FOR(i,n) for(int (i)=0;(i)<(n);++(i))
// #define FORI(i,n) for(int (i)=1;(i)<=(n);++(i))
// #define REP(i,a,b) for(int (i)=(a);(i)<=(b);++i)
// #define vin vi arr; for(long long int i=0;i<n;i++){long long int a;cin>>a;arr.pb(a);}
// #define FAST ios_base::sync_with_stdio(0);cin.tie(0);cout.tie(0);
//
//
// int main()
// {
//     ll n;
//     cin>>n;
//     vin
//     ll m;
//     cin>>m;
//     while(m--)
//     {
//         ll x;
//         cin>>x;
//         FOR(i,n)
//         {
//             if(x<arr[i])
//                 arr[i]--;
//         }
//
//
//     }
//
//     FOR(i,n)
//         cout<<arr[i]<<" ";
//     return 0;
// }`,1200);
