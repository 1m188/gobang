#ifndef STARTSCENE_H
#define STARTSCENE_H

#include "Scene.h"

//游戏开始的场景
class StartScene : public Scene
{
	Q_OBJECT

public:
	StartScene(QWidget *parent);
	~StartScene();

private:


public:
	void init();

	private slots:
	void newGameButtonClicked(); //单击开始新游戏按钮
};

#endif // STARTSCENE_H
