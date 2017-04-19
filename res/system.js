var $html_colors = new Array();
var $min_width = "70px", $min_height = "70px", $block_id = 1, $scale = 1;
var $html_template = "<!doctype html><html><head><style type='text/css'>%css_rules%</style><title>Design by Evolve.js</title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\
<link href=\"style.css\" type=\"text/css\" rel=\"stylesheet\" /></head><body>%body_content%%copyright%</body></html>";
var $html_copyright = "";
var $css_template = "\n\
html, body { margin: 0; padding: 0; width: 100%; height: 100%; }\n\
.content { min-height: 100%; position: relative; overflow: auto; z-index: 0; }\n\
.background { position: absolute; z-index: -1; top: 0; bottom: 0; margin: 0; padding: 0;}\n\
.top_block { width: 100%; display: block; }\n\
.bottom_block { position: absolute; width: 100%; display: block; bottom: 0; }\n\
.left_block { display: block; float: left; }\n\
.right_block { display: block; float: right; }\n\
.center_block { display: block; width: auto; }\n";
function generate_colors()
{
    c=new Array('00','CC','33','66','99','FF');
    for(i=1;i<5;i++)
        for(j=2;j<5;j++)
            for(k=3;k<6;k++)
                $html_colors.push(c[i]+c[j]+c[k]);
}

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();


$(document).ready(function() {
    var $layout = $('.window'), $cel_css = new Array();
    generate_colors();
    $block_menu_template = '<ul class="uimenu">\
    <li><a href="#"><span class="ui-button-icon-primary ui-icon ui-icon-gear"></span></a>\
    <ul style="position:absolute; display: none; z-index: 1001;">\
  <li><a href="#" class="add_block">Add block</a></li>\
  <li><a href="#" class="reattach_block">Reattach block</a></li>\
  <li><a href="#" class="del_block">Delete block</a></li>\
  <li><a href="#" class="params_block">Block parameters</a></li>\
</ul>\
</li></ul>';

    $new_block_template = '<div class="new_block">\
    <div class="name">Click and move me</div>\
    <div class="da_blocks">\
        <div class="top"></div>\
        <div class="left"></div>\
        <div class="right"></div>\
        <div class="bottom"></div>\
    </div>\
    </div>';
    $new_block_menu_template = '<ul class="uimenu">\
    <li><a href="#"><span class="ui-button-icon-primary ui-icon ui-icon-gear"></span></a>\
    <ul class="uimenu-ul" style="position:absolute; display: none;">\
        <li><a href="#" class="del_block">Delete block</a></li>\
        <li><a href="#" class="dock_group">Attach block</a>\
            <ul>\
                <li><a href="#" class="dock_top">&uarr;</a></li>\
                <li><a href="#" class="dock_bottom">&darr;</a></li>\
                <li><a href="#" class="dock_left">&larr;</a></li>\
                <li><a href="#" class="dock_right">&rarr;</a></li>\
                <li><a href="#" class="dock_center">Fill free area</a></li>\
            </ul>\
        </li>\
    </ul>\
    </li></ul>';

    $(".uimenu", $layout).livequery(function(){
        $(this).bind("mouseenter mouseleave mouseover mouseout", function(event){
            if (event.type == 'mouseover' || event.type == 'mouseenter')
            {
                $(this).parent().css("background-color", "yellow");
            }
            else
            {
                $(this).parent().css("background-color", $(this).parent().data("style")["background-color"]);
            }
            //event.stopImmediatePropagation();
            event.stopPropagation();
        });
    });


    $(".uimenu", $layout).livequery(function(){
        $(this).menubar({
			menuIcon: true,
			buttons: true,
            select: function(event, ui) {
                $link = $("a", ui.item);
                if ($link.hasClass("add_block"))
                {
                    if ($link.closest("div").find("div.new_block").length <=0)
                    {
                        $parent = $link.closest("div");
                        $color_input = $("[name='color']", $(".block_new"));
                        $("[name='name']", $(".block_new")).val("block_"+$block_id);
                        if ($html_colors.length <= 0)
                            generate_colors();
                        $bg_color = $html_colors.pop();
                        $color_input.val($bg_color);
                        $color_input.css("background-color", "#" + $bg_color);
                        $color_input.ColorPicker({
                            onSubmit: function(hsb, hex, rgb, el) {
                                $(el).val(hex);
                                $(el).css("background-color", "#" + hex);
                                $(el).ColorPickerHide();
                            },
                            onBeforeShow: function () {
                                $(this).ColorPickerSetColor($(this).val());
                            }
                        }).bind('keydown', function(){
                            return false;
                        });

                        $block_id++;
                        $(".block_new").dialog({
                            modal: true,
                            width: 350,
                            height: 150,
                            position: "center",
                            buttons:
                            [
                                {
                                    text: "Save",
                                    click: function(){ $.add_new_block($(this), $parent)   }
                                },
                                {
                                    text: "Close",
                                    click: function() { $parent.children("div.da_blocks").hide(); $(this).dialog("close"); }
                                }
                            ],
                            close: function(event, ui) {
                                $color_input.ColorPickerHide();
                            }
                        });
                    }
                    else
                        alert("Finish adding active blocks");
                }
                else if ($link.hasClass("del_block"))
                {
                    $block = $link.closest("div");
                    $block.dock_remove();
                }
                else if ($link.hasClass("reattach_block"))
                {
                    $block = $link.closest("div");
                    $block.dock_reattach();
                }
                else if ($link.hasClass("params_block"))
                {
                    $block = $link.closest("div");
                    var width = ($block.data().style && $block.data("style").width) || ($.style($block[0], "width") && $.scale_size($.style($block[0], "width"), 1 / $scale)) || ($block.css("width") && $.scale_size($block.css("width"), 1 / $scale)) || ($block.width() && $.scale_size($block.width(), 1 / $scale)),
                        height = ($block.data().style && $block.data("style").height) || ($.style($block[0], "height") && $.scale_size($.style($block[0], "height"), 1 / $scale)) || ($block.css("height") && $.scale_size($block.css("height"), 1 / $scale)) || ($block.height() && $.scale_size($block.height(), 1 / $scale)),
                        name = ($block.data().name && $block.data("name")) || "", className = ($block.data().className && $block.data("className")) || "";
                    $("[name='name']", $(".block_params")).val(name);
                    $("[name='width']", $(".block_params")).next().val($.get_size_ed(width));
                    $("[name='height']", $(".block_params")).next().val($.get_size_ed(height));
                    width = width != "auto" ? parseInt(width) : "auto";
                    height = height != "auto" ? parseInt(height) : "auto";
                    $("[name='width']", $(".block_params")).val(width);
                    $("[name='height']", $(".block_params")).val(height);
                    $("input[name='margin']", $(".block_params")).val($.style($block[0], "margin"));
                    $("input[name='padding']", $(".block_params")).val($.style($block[0], "padding"));
                    $("input[name='class']", $(".block_params")).val(className);

                    $(".block_params").dialog({
                        modal: true,
                        width: 380,
                        buttons:
                        [
                            {
                                text: "Save",
                                click: function(){ $.block_params($(this), $block)   }
                            },
                            {
                                text: "Close",
                                click: function() { $(this).dialog("close"); }
                            }
                        ]
                    });
                }
                else if ($link.hasClass("dock_top"))
                {
                    $block = $link.closest("div");
                    $block.dock_top();
                }
                else if ($link.hasClass("dock_bottom"))
                {
                    $block = $link.closest("div");
                    $block.dock_bottom();
                }
                else if ($link.hasClass("dock_left"))
                {
                    $block = $link.closest("div");
                    $block.dock_left();
                }
                else if ($link.hasClass("dock_right"))
                {
                    $block = $link.closest("div");
                    $block.dock_right();
                }
                else if ($link.hasClass("dock_center"))
                {
                    $block = $link.closest("div");
                    $block.dock_center();
                }
                return false;
            }
        });
    });

    $rnd_id = $.rnd();
    $(".body").data({id: $rnd_id, zIndex: 100, style: {width: "100%", height: "auto", position: "relative", display: "block", "min-height": "100%", "background-color": "#fff"}});
    $(".body").attr("title", "body");
    //$(".body").tooltip();
    $(".body").children("div.name, div.da_blocks, div.left_block, div.right_block, div.top_block, div.bottom_block, div.center_block").show();
    $(".da_blocks", $layout).livequery(function(){
        $parent = $(this).parent();
        $(this).children("div").droppable({
            tolerance: 'touch',
            scope: $parent.data("id"),
            hoverClass: "ui-state-active",
            drop: function(event, ui) {
                ui.draggable.mouseleave();
                if ($(this).hasClass("left"))
                    ui.draggable.dock_left();
                else if ($(this).hasClass("top"))
                    ui.draggable.dock_top();
                else if ($(this).hasClass("right"))
                    ui.draggable.dock_right();
                else if ($(this).hasClass("bottom"))
                    ui.draggable.dock_bottom();

                $(this).parent().children("div").removeClass("ui-state-active");
            }
        });
    });

    $cel_css.push($(".css_rules > textarea").val());

    $(".work_area").stop().scrollTo($(".window"), 0);
    $(".abc").click(function(){
        $(".css_rules").toggle("slow");
        return false;
    });

    $(".css_rules > .apply").click(function(){
        $.tocssRule($(".css_rules > textarea").val());
        $n_cnt = $cel_css.push($(".css_rules > textarea").val());
        if ($n_cnt > 0)
            $(".css_rules > .cancel").removeAttr('disabled');
        if ($n_cnt>10)
            $cel_css.shift();
        return false;
    });

    $(".css_rules > .cancel").click(function(){
        if ($cel_css.length > 0)
            $(".css_rules > textarea").val($cel_css.pop());
        if ($cel_css.length == 0)
            $(this).attr('disabled', 'disabled');
        return false;
    });

    $(".navigation > .resolution").change(function(){
        var $wa_width, $wa_height, $window_height, $scc_rules = "";
        $(".work_area").width(100);
        $(".work_area").height(100);
        if ($(this).val() == "0x0")
        {
            $wa_width = $(window).width();
            $wa_height = $(window).height() - 90;
            $(".work_area").width($wa_width);
            $(".work_area").height($wa_height);
            $window_height = $wa_height - parseInt($(".work_area > .ekran > .browser > .navigation").height() / $scale) - parseInt($(".work_area > .ekran > .browser > .status").height() / $scale);
            $scc_rules += ".ekran.r0x0 .browser .window {display: block; height: " + $window_height + "px; width: " + $wa_width + "px; background: yellow; zoom: 1; overflow: auto;}\n";
            $scc_rules += ".ekran.r0x0.x2 {width: " + $wa_width*2 + "px; height: " + $wa_height*2 + "px;}\n";
            $scc_rules += ".ekran.r0x0.x2 .browser .window {display: block; height: " + $window_height*2 + "px; background: yellow; zoom: 1; font-size: 200%;}\n";
            $.tocssRule($scc_rules);
        }
        $(".ekran").removeClass().addClass("ekran r" + $(this).val() + " x" + $scale);
        if ($(this).val() != "0x0")
        {
            $(".work_area").height($(".ekran").height());
            $(".work_area").width($(".ekran").width());
        }
        $(".work_area").stop().scrollTo($(".window"), 0);
        $(".body").reset_dim();
        $(".body").set_menu_position();
    });

    $(window).resize(function(){
        if ($(".navigation > .resolution").val() == "0x0")
        {
            $(".navigation > .resolution").change();
        }
    });

    $(".navigation > .scale").change(function(){
        $scale = parseInt($(this).val());
        $(".ekran").removeClass().addClass("ekran r" + $(".navigation > .resolution").val() + " x" + $(this).val());
        $("div.left_block, div.right_block, div.top_block, div.bottom_block, div.center_block").filter(".ui-resizable").each(function(){
            $(this).resizable("option", "grid", $scale);
        });
        $(".body").calc_dim();
        $(".body").reset_dim();
        $(".body").set_menu_position();
    });


    $(".css_rules").dialog({
        modal: true,
        width: 680,
        autoOpen: false
    });

    $(".save_layout").click(function(){
        var $export_layout = $(".body").my_clone(), $export_html = $("#html-code textarea"), $export_combined = $("#combined textarea"), $export_css = $("#css-code textarea"), $css_rules = "";

        $export_layout.add($("div", $export_layout)).each(function(){
            var $classes = $(this).attr("class").replace(/(ui-([\w-])+(\s|\b))/g, "").trim();
            var $style = "", $level = $(this).parents().length;
            var $parent = $(this).parent().parent();
            var $content_block = $("<div class=\"content\"></div>");
            var $childs = $(this).children("div.left_block, div.right_block, div.top_block, div.bottom_block, div.center_block");
            $(this).unbind();
            if ($childs.length == 0)
                $(this).text("");

            $content_block.append($childs);
            $(this).append($content_block);
            $(this).removeClass().addClass($classes + " " + $(this).data("name"));
            $(this).data("style", $.extend($(this).data().style, {"background-color": $.rgb2hex($(this).css("background-color"))}));
            $(this).removeAttr("title");
            $(this).removeAttr("style");
            $(this).removeAttr("aria-disabled");
            if ($(this).is(".left_block, .right_block, .center_block"))
            {
                var $block_bg = $("<div class=\"background\"></div>"), $block_bg_style = "", $block_style = $(this).data("style");
                $block_bg.addClass($(this).data("name"));
                $block_bg_style = ".background." + $(this).data("name") + " { height: auto !important; padding-bottom: 0;";
                if ($parent && $parent.length > 0 && $(".background." + $parent.data("name"), $export_layout).length > 0)
                {
                    $(".background." + $parent.data("name"), $export_layout).append($block_bg);
                }
                else
                    $(this).before($block_bg);

                if ($(this).is(".left_block"))
                    $block_bg_style += " left: 0; width: " + $block_style.width + ";";
                else if ($(this).is(".right_block"))
                    $block_bg_style += " right: 0; width: " + $block_style.width + ";";
                else if ($(this).is(".center_block"))
                    $block_bg_style += " left: 0; right: 0;";

                $block_bg_style += " background-color: " + $block_style["background-color"] + ";"
                if ($block_style["margin-top"] && $block_style["margin-top"] != "0px")
                    $block_bg_style += " margin-top: " + $block_style["margin-top"] + ";";
                if ($block_style["padding-bottom"] && $block_style["padding-bottom"] != "0px")
                    $block_bg_style += " margin-bottom: " + $block_style["padding-bottom"] + ";";
                if ($block_style["margin-left"] && $block_style["margin-left"] != "0px")
                    $block_bg_style += " margin-left: " + $block_style["margin-left"] + ";";
                if ($block_style["margin-right"] && $block_style["margin-right"] != "0px")
                    $block_bg_style += " margin-right: " + $block_style["margin-right"] + ";";
                delete $block_style["margin-top"]; delete $block_style["margin-left"]; delete $block_style["margin-right"]; delete $block_style["background-color"];
                $block_bg_style += " }\n";
                $css_rules += $block_bg_style;
                $(this).data("style", $block_style);
            }

            if (!$(this).is(".body"))
                $css_rules += "." + $(this).data("name") + " {" + $.data2style($(this).data("style")) + "}\n";
        });
        $css_rules = $css_template + $css_rules;
        $css_rules = $css_rules.replace(/((\{\s)|(\{))/gi, "{\n\t").replace(/(\})/gi, "\n}\n").replace(/(\; ([^\n]))/gi, ";\n\t$2");
        //$export_css.val($css_rules.replace(/((\{\s)|(\{))/gi, "{\n\t").replace(/(\})/gi, "\n}\n").replace(/(\; ([^\n]))/gi, ";\n\t$2"));
        $export_html.val($.htmlClean($html_template.replace(/%body_content%/, $.trim($export_layout.html())), {format:true, allowedClasses: "all", formatIndent: -1}).replace("%copyright%", $html_copyright).replace("%css_rules%",$css_rules));
        $(".css_rules").dialog("open");
        return false;
    });
    
    $("#code-tabs").tabs();

});