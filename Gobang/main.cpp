#include <QtWidgets/QApplication>
#include "scene.h"

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	Scene w(nullptr);
	return a.exec();
}
