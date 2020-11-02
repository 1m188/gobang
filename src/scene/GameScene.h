#pragma once

#include "Scene.h"
#include "QMap"

// 游戏主场景
class GameScene : public Scene
{
    Q_OBJECT

private:
    int lineNum;     // 横竖线的数量
    double interval; // 线之间的间距

    // 棋子的枚举
    enum player
    {
        black,
        white
    };
    player whichPlayer; // 当前等待落子的一方

    QMap<player, QString> title; // 黑白棋对应的标题字符串

    // 以下三个坐标都是先x，再y
    QVector<QPair<int, int>> pos;      // 当前所有可以落子的坐标
    QVector<QPair<int, int>> blackPos; // 黑棋已经落子的坐标
    QVector<QPair<int, int>> whitePos; // 白棋...

    // 判定输赢
    bool isWin(QVector<QPair<int, int>>);
    // 判定该容器之中是否有某个元素
    bool isExist(QVector<QPair<int, int>>, QPair<int, int>);

public:
    GameScene(Window *parent);
    ~GameScene();

    void init() override; // 初始化

protected:
    void paintEvent(QPaintEvent *event) override;      // 重写绘制事件，绘制棋盘和棋子
    void mousePressEvent(QMouseEvent *event) override; // 重写鼠标点击事件，确定落子和判定输赢
};
