#ifndef SCENE_H
#define SCENE_H

#include <QWidget>
#include "QApplication"
#include "QDeskTopWidget"
#include "QPainter"
#include "QMouseEvent"
#include "cmath"

class Scene : public QWidget
{
	Q_OBJECT

public:
	Scene(QWidget *parent);
	~Scene();

private:
	int lineNum;
	double interval;

	const enum player
	{
		black,
		white
	};
	player whichPlayer;

	//以下三个坐标都是先x，再y
	QVector<QPair<int, int>> pos;
	QVector<QPair<int, int>> blackPos;
	QVector<QPair<int, int>> whitePos;

protected:
	void paintEvent(QPaintEvent *);
	void mousePressEvent(QMouseEvent *);
};

#endif // SCENE_H
