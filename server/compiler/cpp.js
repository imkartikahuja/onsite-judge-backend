const fs = require('fs');
const { exec } = require('child_process');

const compileCpp = (code,time_limit,userId) => {
  const defaults = {
    encoding: 'utf8',
    timeout: time_limit,
    maxBuffer: 2000 * 1024,
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
  };

  // userId = "5acde196528b1829144a9b2f";
  userId = Math.floor(Math.random() * 200);

  exec(`mkdir ./tmp/${userId}`,(error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${userId} folder created`);

    fs.writeFile(`./tmp/${userId}/code.cpp`, code, (err) => {
      if (err) {console.log(err);throw err;}

      // success case, the file was saved
      console.log('Code saved!');

      //compile code
      exec(`g++ -o tmp/${userId}/a.out tmp/${userId}/code.cpp`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`${userId} folder deleted`);
          });
          return;
        }

        console.time('execute');
        exec(`tmp/${userId}/./a.out < compiler/in.txt`, defaults,(error, stdout, stderr) => {
          if (error) {
            if(error.code == 139){
              console.log('Segmentation fault');
            } else if (error.signal == 'SIGTERM') {
              console.log('Time limit exceeded');
            }
            console.error(`exec error: ${error}`);
            //console.log(error);
            exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              console.log(`${userId} folder deleted`);
            });
            return;
          }
           //console.log(`stdout: ${stdout}`);
          fs.writeFileSync(`tmp/${userId}/output.txt`,stdout);
          console.log(`stderr: ${stderr}`);
          console.timeEnd('execute');

          exec(`cmp tmp/${userId}/output.txt compiler/out.txt`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Wrong Answer`);
              exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return;
                }
                console.log(`${userId} folder deleted`);
              });
              return;
            }

            console.log('Correct Answer');

            exec(`rm -rf ./tmp/${userId}`,(error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              console.log(`${userId} folder deleted`);
            });
          });

        });

      });
    });

  });


}

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

compileCpp(`#include<bits/stdc++.h>
using namespace std;
#define pb push_back
typedef vector<long long int> vi;
typedef long long int ll;
#define FOR(i,n) for(int (i)=0;(i)<(n);++(i))
#define FORI(i,n) for(int (i)=1;(i)<=(n);++(i))
#define REP(i,a,b) for(int (i)=(a);(i)<=(b);++i)
#define vin vi arr; for(long long int i=0;i<n;i++){long long int a;cin>>a;arr.pb(a);}
#define FAST ios_base::sync_with_stdio(0);cin.tie(0);cout.tie(0);


int main()
{
    ll n;
    cin>>n;
    vin
    ll m;
    cin>>m;
    while(m--)
    {
        ll x;
        cin>>x;
        FOR(i,n)
        {
            if(x<arr[i])
                arr[i]--;
        }


    }

    FOR(i,n)
        cout<<arr[i]<<" ";
    return 0;
}`,1200);

// const defaults = {
//   encoding: 'utf8',
//   timeout: 1000,
//   maxBuffer: 2000 * 1024,
//   killSignal: 'SIGTERM',
//   cwd: null,
//   env: null
// };

// exec('g++ code.cpp', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
// });
// console.time('execute');
// exec('./a.out < in.txt', defaults,(error, stdout, stderr) => {
//   if (error) {
//     if(error.code == 139){
//       console.log('Segmentation fault');
//     } else if (error.signal == 'SIGTERM') {
//       console.log('Time limit exceeded');
//     }
//     console.error(`exec error: ${error}`);
//     //console.log(error);
//     return;
//   }
//   // console.log(`stdout: ${stdout}`);
//   fs.writeFileSync('output.txt',stdout);
//   console.log(`stderr: ${stderr}`);
//   console.timeEnd('execute');
//
//   exec('cmp output.txt out.txt', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Wrong Answer`);
//       return;
//     }
//
//     console.log('Correct Answer');
//   });
//
// });
