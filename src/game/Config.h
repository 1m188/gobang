#pragma once

#include "QString"

// 设置类
class Config
{
private:
    Config(); // 禁止自动构造

    static Config *instance; // 单例指针

    QString themeResourceUrl; // 主题资源url

public:
    Config(const Config &) = delete;
    Config &operator=(const Config &) = delete;
    ~Config();

    static Config *getInstance(); // 获取单例指针

    void init();                             // 初始化所有设置
    void uninit();                           // 保存设置
    void setTheme(QString themeResourceUrl); // 设置当前主题
};
