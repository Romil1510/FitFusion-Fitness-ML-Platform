#include<iostream>
using namespace std;

int main()
{
	int array[]={0,1,1,1,2,2,2,2,2,3,4,5,5,5};
	int i=0,j=1;
	
	while(j<(sizeof(array)/sizeof(array[0])))
	{
		if(array[i]==array[j])
		{
			j++;
		}
		else
		{
			i++;
			array[i]=array[j];
			j++;
		}
//		j++;
	}
	
	
	cout<<i<<endl;
	return 0;
}
