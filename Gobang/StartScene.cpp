#include "StartScene.h"
#include "Director.h"
#include "GameScene.h"
#include "SettingScene.h"
#include "QLabel"
#include "QPushButton"
#include "QGridLayout"
#include "QApplication"

StartScene::StartScene(Window *parent) :Scene(parent)
{
}

StartScene::~StartScene()
{
}

void StartScene::init()
{
	Director::getInstance()->getWindow()->setWindowTitle(tr(u8"五子棋"));

	//控件
	QLabel *infoLabel = new QLabel(this);
	infoLabel->setAlignment(Qt::AlignCenter);
	infoLabel->setFont(QFont(u8"微软雅黑", 40));
	infoLabel->setText(tr(u8"欢  乐  五  子  棋"));

	QPushButton *newGameButton = new QPushButton(this);
	newGameButton->setFont(QFont(u8"微软雅黑", 15));
	newGameButton->setText(tr(u8"开始新游戏"));
	connect(newGameButton, &QPushButton::clicked, this, &StartScene::newGameButtonClicked);

	QPushButton *settingButton = new QPushButton(this);
	settingButton->setFont(QFont(u8"微软雅黑", 15));
	settingButton->setText(tr(u8"设置"));
	connect(settingButton, &QPushButton::clicked, this, &StartScene::settingButtonClicked);

	QPushButton *exitButton = new QPushButton(this);
	exitButton->setFont(QFont(u8"微软雅黑", 15));
	exitButton->setText(tr(u8"退出"));
	connect(exitButton, &QPushButton::clicked, QApplication::quit);

	//布局
	QGridLayout *layout = new QGridLayout(this);
	layout->addWidget(infoLabel, 0, 0, 10, 15);
	layout->addWidget(newGameButton, 10, 5, 3, 5);
	layout->addWidget(settingButton, 13, 5, 3, 5);
	layout->addWidget(exitButton, 16, 5, 3, 5);
}

void StartScene::newGameButtonClicked()
{
	//初始化并显示游戏主场景
	GameScene *gameScene = new GameScene(Director::getInstance()->getWindow());
	gameScene->init();
	gameScene->show();
	//删除开始场景
	deleteLater();
}

void StartScene::settingButtonClicked()
{
	SettingScene *settingScene = new SettingScene(Director::getInstance()->getWindow());
	settingScene->init();
	settingScene->show();
	deleteLater();
}