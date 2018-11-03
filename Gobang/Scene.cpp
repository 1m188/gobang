#include "Scene.h"

Scene::Scene(QWidget *parent)
	: QWidget(parent)
{
	resize(parent->size());
}

Scene::~Scene()
{

}

void Scene::init()
{
}