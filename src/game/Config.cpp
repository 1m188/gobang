#include "Config.h"
#include "QFile"
#include "QApplication"
#include "QJsonObject"
#include "QJsonDocument"

Config *Config::instance = nullptr; // 初始化单例指针

Config::Config()
{
}

Config::~Config()
{
}

Config *Config::getInstance()
{
    if (!instance)
    {
        instance = new Config();
    }
    return instance;
}

void Config::init()
{
    // 初始化默认的设置
    themeResourceUrl = ":/theme/Resoueces/theme/default.qss";

    QFile f("config.ini");
    // 文件存在则读入设置数据
    if (f.exists())
    {
        // 从文件读取json内容
        f.open(QIODevice::ReadOnly);
        QByteArray temp = f.readAll();
        f.close();

        // json格式解析
        QJsonDocument jsonDocument = QJsonDocument::fromJson(temp);
        QJsonObject json = jsonDocument.object();
        themeResourceUrl = json.value("ThemeResourceUrl").toString(); // 读取主题风格样式表路径
    }
    // 否则新建文件，并用默认的设置开始游戏
    else
    {
        f.open(QIODevice::WriteOnly);
        f.close();
    }

    // 设置当前主题风格
    setTheme(themeResourceUrl);
}

void Config::uninit()
{
    // json格式写入
    QJsonObject json;
    json.insert("ThemeResourceUrl", themeResourceUrl); // 写入主题风格样式表路径

    QJsonDocument jsonDocument;
    jsonDocument.setObject(json);
    QByteArray byteArray = jsonDocument.toJson();

    // 文件写入
    QFile f("config.ini");
    f.open(QIODevice::WriteOnly | QIODevice::Truncate); // 只写+清空已有内容
    f.write(byteArray);
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