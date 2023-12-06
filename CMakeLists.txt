cmake_minimum_required(VERSION 3.5)
project(gobang CXX)

find_package(Qt5 REQUIRED Widgets)

set(target ${PROJECT_NAME})
file(GLOB_RECURSE sources src/*.cpp)
add_executable(${target} ${sources})
target_sources(${target} PRIVATE res/gobang.qrc)

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
target_include_directories_recurse(${target} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)

target_compile_definitions(${target} PRIVATE
$<$<CONFIG:Debug>:DEBUG>
$<$<CONFIG:Release>:RELEASE>
)
target_link_libraries(${target} PRIVATE Qt5::Widgets)

set_target_properties(${target} PROPERTIES
AUTOMOC ON
AUTORCC ON
AUTOUIC ON
)

if(MSVC_IDE)
    target_compile_options(${target} PRIVATE /utf-8)
    set_target_properties(${target} PROPERTIES LINK_FLAGS_RELEASE "/subsystem:windows /entry:mainCRTStartup")
endif()