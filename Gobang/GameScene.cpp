#include "GameScene.h"
#include "Director.h"
#include "StartScene.h"
#include "QPainter"
#include "QMouseEvent"
#include "QMessageBox"

GameScene::GameScene(QWidget *parent) :Scene(parent)
{
}

GameScene::~GameScene()
{
}

void GameScene::init()
{
	//初始化游戏相关变量
	lineNum = 15;
	whichPlayer = black;
	title = QMap<player, QString>{ {black,tr(u8"五子棋-请黑棋落子") },{white,tr(u8"五子棋-请白棋落子") } };
	pos = {};
	blackPos = {};
	whitePos = {};

	//初始化窗口标题
	Director::getInstance()->getWindow()->setWindowTitle(title[whichPlayer]);

	//刷白背景
	setAutoFillBackground(true);
	setPalette(QPalette(QColor(Qt::white)));

	//线间距
	interval = static_cast<double>(width()) / (lineNum + 1);

	//初始化可落子点坐标
	for (int i = 1; i <= lineNum; i++)
	{
		for (int j = 1; j <= lineNum; j++)
		{
			pos.push_back(QPair<int, int>(j, i));
		}
	}

	//重绘棋盘
	update();
}

void GameScene::paintEvent(QPaintEvent *event)
{
	QPainter *painter = new QPainter(this);

	//画背景线
	painter->setPen(QPen(QColor(Qt::black)));
	for (int i = 1; i <= lineNum; i++)
	{
		painter->drawLine(0, i*interval, width(), i*interval);
		painter->drawLine(i*interval, 0, i*interval, height());
	}

	//画黑子
	painter->setBrush(QBrush(Qt::black));
	for (QPair<int, int> i : blackPos)
	{
		painter->drawEllipse(i.first*interval - interval / 2, i.second*interval - interval / 2, interval, interval);
	}

	//画白子
	painter->setBrush(QBrush(Qt::white));
	for (QPair<int, int> i : whitePos)
	{
		painter->drawEllipse(i.first*interval - interval / 2, i.second*interval - interval / 2, interval, interval);
	}

	painter->end();

	return QWidget::paintEvent(event);
}

void GameScene::mousePressEvent(QMouseEvent *event)
{
	//判定落子
	for (QVector<QPair<int, int>>::iterator it = pos.begin(); it != pos.end(); it++)
	{
		int x = it->first;
		int y = it->second;
		if (sqrt(pow(x*interval - event->pos().x(), 2) + pow(y*interval - event->pos().y(), 2)) < 10)
		{
			if (whichPlayer == black)
			{
				blackPos.push_back(*it);
				whichPlayer = white;
			}
			else if (whichPlayer == white)
			{
				whitePos.push_back(*it);
				whichPlayer = black;
			}
			Director::getInstance()->getWindow()->setWindowTitle(title[whichPlayer]); //重设窗口标题
			pos.erase(it);
			break;
		}
	}

	update(); //刷新当前的棋盘和棋子

	//判定输赢
	if ((whichPlayer == black&&isWin(whitePos)) || (whichPlayer == white&&isWin(blackPos)))
	{
		//如果不想再来一局的话返回开始场景
		if (QMessageBox::information(this, tr(u8"游戏结束"), tr(QString(u8"游戏结束，").toUtf8() + (whichPlayer == black ? u8"白" : u8"黑") + u8"棋胜！是否想要再来一局？"), QMessageBox::Yes, QMessageBox::No) == QMessageBox::No)
		{
			StartScene *startScene = new StartScene(Director::getInstance()->getWindow());
			startScene->init();
			startScene->show();
			hide();
			deleteLater();
			return QWidget::mousePressEvent(event);
		}
	}
	else
	{
		return QWidget::mousePressEvent(event);
	}

	//重新初始化相关数据
	for (QVector<QPair<int, int>>::const_iterator it = blackPos.begin(); it != blackPos.end(); it++)
	{
		pos.push_back(*it);
	}
	blackPos.clear();
	for (QVector<QPair<int, int>>::const_iterator it = whitePos.begin(); it != whitePos.end(); it++)
	{
		pos.push_back(*it);
	}
	whitePos.clear();
	whichPlayer = black;
	Director::getInstance()->getWindow()->setWindowTitle(title[whichPlayer]); //重设窗口标题

	return QWidget::mousePressEvent(event);
}

bool GameScene::isWin(QVector<QPair<int, int>> chess)
{
	//这里判断是否有一方赢了，如果有的话会在判断的过程中直接return true，否则在最后会return false

	//上下方向
	for (QVector<QPair<int, int>>::const_iterator it = chess.begin(); it != chess.end(); it++)
	{
		int num = 1;
		for (int i = 1; isExist(chess, QPair<int, int>{it->first, it->second + i}); i++)
		{
			num++;
		}
		for (int i = 1; isExist(chess, QPair<int, int>{it->first, it->second - i}); i++)
		{
			num++;
		}
		if (num == 5)
		{
			return true;
		}
	}

	//左右方向
	for (QVector<QPair<int, int>>::const_iterator it = chess.begin(); it != chess.end(); it++)
	{
		int num = 1;
		for (int i = 1; isExist(chess, QPair<int, int>{it->first + i, it->second}); i++)
		{
			num++;
		}
		for (int i = 1; isExist(chess, QPair<int, int>{it->first - i, it->second}); i++)
		{
			num++;
		}
		if (num == 5)
		{
			return true;
		}
	}

	//左上右下方向
	for (QVector<QPair<int, int>>::const_iterator it = chess.begin(); it != chess.end(); it++)
	{
		int num = 1;
		for (int i = 1; isExist(chess, QPair<int, int>{it->first - i, it->second - i}); i++)
		{
			num++;
		}
		for (int i = 1; isExist(chess, QPair<int, int>{it->first + i, it->second + i}); i++)
		{
			num++;
		}
		if (num == 5)
		{
			return true;
		}
	}

	//右上左下方向
	for (QVector<QPair<int, int>>::const_iterator it = chess.begin(); it != chess.end(); it++)
	{
		int num = 1;
		for (int i = 1; isExist(chess, QPair<int, int>{it->first + i, it->second - i}); i++)
		{
			num++;
		}
		for (int i = 1; isExist(chess, QPair<int, int>{it->first - i, it->second + i}); i++)
		{
			num++;
		}
		if (num == 5)
		{
			return true;
		}
	}

	return false;
}

bool GameScene::isExist(QVector<QPair<int, int>> judgeAim, QPair<int, int> element)
{
	for (QVector<QPair<int, int>>::const_iterator it = judgeAim.begin(); it != judgeAim.end(); it++)
	{
		if (it->first == element.first&&it->second == element.second)
		{
			return true;
		}
	}
	return false;
}