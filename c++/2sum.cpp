#include<iostream>
#include<vector>
  
using namespace std;

int main()
{
	int nums[]={1,2,4,5,6,2,9,21,5};
	int target,length=sizeof(nums)/sizeof(nums[0]),flag=0;
	vector<int> solution;
	
	cout<<"enter target :";
	cin>>target;
	
	for(int i=0;i<length;i++)
	{
		if(flag==0)
		{			
		for(int j=i+1;j<=length;j++)
		{
			if((nums[i]+nums[j])==target)
			{
				solution.push_back(i);
				solution.push_back(j);
				cout<<" solution found !!!"<<endl;
				flag=1;
				break;
			}
		}		
		}
		else
		{
			break;
		}
	}
	
	for(int i=0;i<solution.size();i++)
	{
		cout<<solution[i]<<" ";
	}
	
	
}
