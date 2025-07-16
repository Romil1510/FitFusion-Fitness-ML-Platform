#include<iostream>
using namespace std;

class node
{
	public:
	int data;
	node* next;
	
	node(int data)
	{
		this->data=data;
		this->next=NULL;
	}	
};


void insertattail(node*& tail,node*& head,int data)
{
	if(tail==NULL)
	{
		node *temp=new node(data);
		head=temp;
		tail=temp;
	}
	else
	{
		node* temp=new node(data);
		tail->next=temp;
		tail=temp;
	}
}

bool checkcircle(node* head)
{
	node *fast=head->next;
	node *slow=head;
	
	while(fast!=NULL && slow!=NULL)
	{
		if(fast==slow)
		{
			return true;
		}
		else
		{
			slow=slow->next;
			fast=fast->next->next;
		}
	}
	return false;
}

void show(node* head)
{
	node* temp=head;
	while(temp)
	{
		cout<<temp->data<<"->";
		temp=temp->next;
	}
}

int main()
{
	node* head;
	node* tail;
	insertattail(tail,head,1);
	insertattail(tail,head,2);
	insertattail(tail,head,3);
	insertattail(tail,head,5);
	insertattail(tail,head,10);
//	show(head);
	tail->next=head;
	
	cout<<checkcircle(head)<<endl;
	
	return 0;
}
