#ifndef SETTINGSCENE_H
#define SETTINGSCENE_H

#include "Scene.h"

//设置场景
class SettingScene : public Scene
{
	Q_OBJECT

public:
	SettingScene(Window *parent);
	~SettingScene();

	void init() override; //初始化场景

	private slots:
	void returnToStartSceneButtonClicked(); //单击返回开始场景按钮
};

#endif // SETTINGSCENE_H
