#include "Director.h"

Director *Director::instance = nullptr; //初始化单例指针

Director::Director() :window(nullptr)
{
}

Director::~Director()
{
}

Director * Director::getInstance()
{
	if (instance == nullptr)
	{
		instance = new Director();
	}
	return instance;
}

void Director::setWindow(Window * window)
{
	this->window = window;
}

Window * Director::getWindow()
{
	return window;
}