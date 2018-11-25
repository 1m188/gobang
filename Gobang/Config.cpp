#include "Config.h"
#include "QFile"
#include "QApplication"

Config *Config::instance = nullptr; //初始化单例指针

Config::Config()
{

}

Config::~Config()
{

}

Config * Config::getInstance()
{
	if (!instance)
	{
		instance = new Config();
	}
	return instance;
}

void Config::init()
{
	//初始化默认的设置
	themeResourceUrl = ":/theme/Resoueces/theme/default.qss";

	QFile f("config.ini");
	//文件存在则读入设置数据
	if (f.exists())
	{
		f.open(QIODevice::ReadOnly);
		QString temp;
		//读取主题资源url
		temp = f.readLine();
		temp.chop(1);
		themeResourceUrl = temp;
		f.close();
	}
	//否则新建文件，并用默认的设置开始游戏
	else
	{
		f.open(QIODevice::WriteOnly);
		f.close();
	}

	//设置当前主题风格
	setTheme(themeResourceUrl);
}

void Config::uninit()
{
	QFile f("config.ini");
	f.open(QIODevice::WriteOnly | QIODevice::Truncate); //只写+清空已有内容
	f.write(themeResourceUrl.toStdString().c_str());
	f.write("\n");
	f.close();
}

void Config::setTheme(QString themeResourceUrl)
{
	QFile f(themeResourceUrl);
	f.open(QIODevice::ReadOnly);
	qApp->setStyleSheet(f.readAll());
	f.close();
	this->themeResourceUrl = themeResourceUrl;
}