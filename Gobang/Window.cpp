#include "Window.h"
#include "QApplication"
#include "QDeskTopWidget"
#include "GameScene.h"

Window::Window(QWidget *parent)
	: QWidget(parent)
{
	//基本设置
	setAttribute(Qt::WA_DeleteOnClose, true);
	setAttribute(Qt::WA_QuitOnClose, true);

	//窗口标题和大小设置
	setWindowTitle(tr(u8"五子棋"));
	setFixedSize(960, 960);

	//移动到屏幕中央
	QRect rect = frameGeometry();
	rect.moveCenter(QApplication::desktop()->availableGeometry().center());
	move(rect.topLeft());
}

Window::~Window()
{

}

void Window::show()
{
	QWidget::show();

	//游戏场景
	GameScene *gameScene = new GameScene(this);
	gameScene->init();
	gameScene->show();
}