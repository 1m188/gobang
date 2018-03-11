#ifndef SCENE_H
#define SCENE_H

#include <QWidget>
#include "QApplication"
#include "QDeskTopWidget"
#include "QPainter"

class Scene : public QWidget
{
	Q_OBJECT

public:
	Scene(QWidget *parent);
	~Scene();

private:
	int lineNum;
	double interval;

protected:
	void paintEvent(QPaintEvent *);
};

#endif // SCENE_H
