#include "Scene.h"

Scene::Scene(Window *parent) : QWidget(parent)
{
    resize(parent->size());
}

Scene::~Scene()
{
}

void Scene::init()
{
}