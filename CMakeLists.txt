cmake_minimum_required(VERSION 3.15)
project(gobang)

find_package(Qt5 REQUIRED Widgets)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

aux_source_directory(./src main.cpp)
add_executable(${PROJECT_NAME} main.cpp)
target_include_directories(${PROJECT_NAME} PRIVATE ./scene ./game)
file(GLOB srcs ./scene/*.cpp ./game/*.cpp)
target_sources(${PROJECT_NAME} PRIVATE gobang.qrc ${srcs})
target_compile_definitions(${PROJECT_NAME} PRIVATE $<$<CONFIG:Debug>:DEBUG> $<$<CONFIG:Release>:RELEASE>)
target_link_libraries(${PROJECT_NAME} PRIVATE Qt5::Widgets)

if(WIN32)
    set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS_RELEASE "/subsystem:windows /entry:mainCRTStartup")
endif()