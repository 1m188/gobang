#include "scene.h"

Scene::Scene(QWidget *parent)
	: QWidget(parent), lineNum(15)
{
	setWindowTitle(tr(u8"Îå×ÓÆå"));
	setFixedSize(960, 960);
	QRect rect = frameGeometry();
	rect.moveCenter(QApplication::desktop()->availableGeometry().center());
	move(rect.topLeft().x(), rect.topLeft().y() - 20);
	//Ë¢°×±³¾°
	setPalette(QPalette(QColor(Qt::white)));

	//Ïß¼ä¾à
	interval = static_cast<double>(width()) / (lineNum + 1);

	show();
}

Scene::~Scene()
{

}

void Scene::paintEvent(QPaintEvent *event)
{
	QPainter *painter = new QPainter(this);
	//»­±³¾°Ïß
	for (int i = 1; i <= lineNum; i++)
	{
		painter->drawLine(0, i*interval, width(), i*interval);
		painter->drawLine(i*interval, 0, i*interval, height());
	}

	painter->end();
}