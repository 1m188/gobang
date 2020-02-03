#ifndef DIRECTOR_H
#define DIRECTOR_H

#include "Window.h"

//导演类
class Director
{
private:
	Director(); //防止外部自动构造

	static Director *instance; //单例指针

	Window *window; //游戏窗口指针

public:
	Director(const Director &) = delete;
	Director &operator=(const Director &) = delete;
	~Director();

	static Director *getInstance(); //获取单例

	//设置游戏窗口指针实例
	void setWindow(Window *window);
	//获取游戏窗口指针实例
	Window *getWindow();
};

#endif // !DIRECTOR_H
