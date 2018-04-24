#include<bits/stdc++.h>
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
}