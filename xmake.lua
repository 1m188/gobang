add_rules("mode.debug", "mode.release")

target("gobang")

    add_rules("qt.widgetapp")
    add_files("src/**.cpp", "res/gobang.qrc", "src/**.h")

    if is_mode("debug") then
        add_defines("DEBUG")
    elseif is_mode("release") then
        add_defines("RELEASE")
    end

    -- 递归获取头文件目录
    on_load(function (target) 
        local dir = target:scriptdir().."/src/**"
        target:add("includedirs", os.dirs(dir))
    end)

target_end()