#pragma once

#include "Scene.h"

// 设置场景
class SettingScene : public Scene
{
    Q_OBJECT

public:
    SettingScene(Window *parent);
    ~SettingScene();

    void init() override; // 初始化场景

private slots:
    void themeChooseButtonClicked();        // 单击主题选择按钮
    void returnToStartSceneButtonClicked(); // 单击返回开始场景按钮
};
