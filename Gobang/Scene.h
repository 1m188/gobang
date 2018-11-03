#ifndef SCENE_H
#define SCENE_H

#include <QWidget>

//场景类
class Scene : public QWidget
{
	Q_OBJECT

public:
	Scene(QWidget *parent);
	virtual ~Scene();

private:

public:
	virtual void init(); //初始化场景元素内容
};

#endif // SCENE_H
