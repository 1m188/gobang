#ifndef CONFIG_H
#define CONFIG_H

#include "QString"

//设置类
class Config
{
private:
	Config(); //禁止自动构造

	static Config *instance; //单例指针

public:
	Config(const Config &) = delete;
	Config &operator=(const Config &) = delete;
	~Config();

	static Config *getInstance(); //获取单例指针

	void init(); //初始化所有设置
	void uninit(); //保存设置
};

#endif // CONFIG_H
