#include<iostream>
using namespace std;

class Node
{
	public:
		
	int data;
	Node* next;
	
	Node(int data)
	{
		
		this->data=data;
		this->next=NULL;
	}	
};

void insertathead(Node*& head,int data)
{
	if(head==NULL)
	{
		Node *temp=new Node(data);
		head=temp;
		head=temp;
	}
	else
	{
		Node* temp=new Node(data);
		temp->next=head;
		head=temp;
	}
}

void insertattail(Node*& tail,Node*& head,int data)
{
	if(tail==NULL)
	{
		Node *temp=new Node(data);
		head=temp;
		tail=temp;
	}
	else
	{
		Node* temp=new Node(data);
		tail->next=temp;
		tail=temp;
	}
}
void show(Node*& head)
{
	Node* temp=head;
	while(temp)
	{
		cout<<temp->data<<"->";
		temp=temp->next;
	}
}

void combine(Node* head,Node* head1)
{
	Node* head3=NULL;
	Node* tail3=NULL;
	
	Node* list1=head;
	Node* list2=head1;
	
	while((list1!=NULL) && (list2!=NULL))
	{
		if(list1->data>list2->data)
		{
			insertattail(tail3,head3,list2->data);
			list2=list2->next;
		}
		else
		{
			insertattail(tail3,head3,list1->data);
			list1=list1->next;
		}
	}
	
	
	
	if(list1!=NULL)
	{
		while(list1)
		{
			insertattail(tail3,head3,list1->data);
			list1=list1->next;
		}
	}
	
	if(list2!=NULL )
	{
		while(list2)
		{
			insertattail(tail3,head3,list2->data);
			list2=list2->next;
		}
	}
	
	show(head3);
}

int main()
{
	Node* head=NULL;
	Node* tail=NULL;
	Node* head1=NULL;
	Node* tail1=NULL;
	
	insertattail(tail,head,1);
	insertattail(tail,head,2);
	insertattail(tail,head,3);
	insertattail(tail,head,5);
	insertattail(tail,head,10);
	
	insertattail(tail1,head1,1);
	insertattail(tail1,head1,3);
	insertattail(tail1,head1,5);
	insertattail(tail1,head1,7);
	insertattail(tail1,head1,8);
	insertattail(tail1,head1,9);
	combine(head,head1);
//	show(head1);
	return 0;
}
