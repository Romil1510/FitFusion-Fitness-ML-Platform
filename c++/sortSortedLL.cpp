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

void check(node* head)
{
	node* temp=head;
	show(temp);
}

void sortLL(node*& head)
{
	node* back=head;
	node* front=head->next;
	
	while(front!=NULL && back!=NULL)
	{
		if(front->data==back->data)
		{
			front=front->next;
		}
		else
		{
			back->next=front;
			back=front;
			front=front->next;
		}
	}
	
	back->next=NULL;
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
	insertattail(tail,head,1);
	insertattail(tail,head,1);
	insertattail(tail,head,2);
	insertattail(tail,head,3);
	insertattail(tail,head,3);
	insertattail(tail,head,5);
	insertattail(tail,head,10);
	insertattail(tail,head,10);
	insertattail(tail,head,10);
//	show(head);
//	sortLL(head);
//	cout<<endl;
//	show(head);
check(head);
	return 0;
}
