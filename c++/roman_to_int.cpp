#include<iostream>
#include<stack>
using namespace std;

int value(char charr)
{

	if(charr=='I')
	{
		return 1;
	}
	 else if(charr=='V')
	{
	 	return 5;
	}
	 else if(charr=='X')
	{
	 	return 10;
	}
	 else if(charr=='L')
	{
	 	return 50;
	}
	 else if(charr=='C')
	{
	 	return 100;
	}
	 else if(charr=='D')
	{
	 	return 500;
	}
	 else if(charr=='M')
	{
	 	return 1000;
	}	
	return 0;

}


int main()
{
	stack<int> s;
	int pointer,answer=0;
	string roman="MCMXCIV";
	pointer=roman.size()-1;
	
	while(pointer>=0)
	{
		if(s.empty())
		{
			s.push(value(roman[pointer]));
		//	cout<<value(roman[pointer])<<endl;
		}
		else
		{
			if(s.top()>value(roman[pointer]))
			{
				int temp=s.top();
				s.pop();
				s.push(temp-value(roman[pointer]));	
			//	cout<<temp-value(roman[pointer])<<endl;					
			}
			else
			{
				s.push(value(roman[pointer]));
			//	cout<<value(roman[pointer])<<endl;
			}
		}
		pointer--;
	}
	
	while(!s.empty())
	{
		answer=answer+s.top();	
		s.pop();
	}
	
	cout<<answer;
	return 0;
}
