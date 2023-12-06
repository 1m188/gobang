#include "Window.h"
#include "QApplication"
#include "QDeskTopWidget"
#include "StartScene.h"
#include <QScreen>

Window::Window() : QWidget(Q_NULLPTR)
{
    // 基本设置
    setAttribute(Qt::WA_DeleteOnClose, true);
    setAttribute(Qt::WA_QuitOnClose, true);

    // 窗口标题和大小设置
    setWindowTitle(tr(u8"五子棋"));
    setFixedSize(960, 960);

    // 移动到屏幕中央
    QRect rect = frameGeometry();
    QPoint p;
#if defined(QT_VERSION) && QT_VERSION >= QT_VERSION_CHECK(5, 14, 2)
    p = QGuiApplication::primaryScreen()->availableGeometry().center();
#else
    p = QApplication::desktop()->availableGeometry().center();
#endif
    rect.moveCenter(p);
    move(rect.topLeft());
}

Window::~Window()
{
}

void Window::show()
{
    // 开始场景
    StartScene *startScene = new StartScene(this);
    startScene->init();
    startScene->show();

    QWidget::show();
}