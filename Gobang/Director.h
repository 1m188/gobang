#ifndef DIRECTOR_H
#define DIRECTOR_H

#include "Window.h"

//������
class Director
{
private:
	Director(); //��ֹ�ⲿ�Զ�����

	static Director *instance; //����ָ��

	Window *window; //��Ϸ����ָ��

public:
	Director(const Director &) = delete;
	Director &operator=(const Director &) = delete;
	~Director();

	static Director *getInstance(); //��ȡ����

	//������Ϸ����ָ��ʵ��
	void setWindow(Window *window) { this->window = window; }
	//��ȡ��Ϸ����ָ��ʵ��
	Window *getWindow() { return window; }
};

#endif // !DIRECTOR_H