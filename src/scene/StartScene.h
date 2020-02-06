#pragma once

#include "Scene.h"

// 游戏开始的场景
class StartScene : public Scene
{
    Q_OBJECT

public:
    StartScene(Window *parent);
    ~StartScene();

    void init() override;

private slots:
    void newGameButtonClicked(); // 单击开始新游戏按钮
    void settingButtonClicked(); // 单击设置按钮
};
