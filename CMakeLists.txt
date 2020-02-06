cmake_minimum_required(VERSION 3.15)
project(gobang)

find_package(Qt5 REQUIRED Widgets)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

file(GLOB_RECURSE sources src/*.cpp)
add_executable(${PROJECT_NAME} ${sources})
target_sources(${PROJECT_NAME} PRIVATE res/gobang.qrc)

# recurse include path
function(target_include_directories_recurse target attr root)
    if(IS_DIRECTORY ${root})
        target_include_directories(${target} ${attr} ${root})
    endif()
    file(GLOB sub_srcs RELATIVE ${root} ${root}/*)
    foreach(sub ${sub_srcs})
        if(IS_DIRECTORY ${root}/${sub})
            target_include_directories_recurse(${target} ${attr} ${root}/${sub})
        endif()
    endforeach()
endfunction()
target_include_directories_recurse(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)

target_compile_definitions(${PROJECT_NAME} PRIVATE $<$<CONFIG:Debug>:DEBUG> $<$<CONFIG:Release>:RELEASE>)
target_link_libraries(${PROJECT_NAME} PRIVATE Qt5::Widgets)

if(WIN32)
    target_compile_options(${PROJECT_NAME} PRIVATE /utf-8)
    set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS_RELEASE "/subsystem:windows /entry:mainCRTStartup")
endif()