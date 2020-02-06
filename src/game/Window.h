#pragma once

#include <QWidget>

// 游戏主窗口
class Window : public QWidget
{
    Q_OBJECT

public:
    Window();
    ~Window();

    void show(); // 重写基类的show函数，使得初始的场景从这里开始而不是从构造函数开始
};
