#include <QtWidgets/QApplication>
#include "Window.h"

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	Window *window = new Window();
	window->show();
	return a.exec();
}
