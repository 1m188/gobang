#include <QtWidgets/QApplication>
#include "Director.h"
#include "Window.h"

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	Director::getInstance()->setWindow(new Window());
	Director::getInstance()->getWindow()->show();
	return a.exec();
}
