#include<iostream>
#include<string>
#include<cstring>

using namespace std;

bool check(int x)
{
	string temp;
	temp=std::to_string(x);
	if(x<0)
	{
		return false;
	}
		
	else
	{
		int left=0;
		int right=temp.length()-1;
		
		while(left<right)
		{
			if(temp[left]==temp[right])
			{
				left++;
				right--;
			}
			else
			{
				return false;
			}
		}
	}
}


int main()
{
	int x=121;
	cout<<check(x);
	return 0;
}
