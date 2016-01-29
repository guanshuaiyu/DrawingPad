$(function(){
    var box = $(".box");
    var copy = $(".copy");
    var canvas = $("canvas");
    var cobj =canvas[0].getContext("2d");
    canvas.attr({
        width:copy.width(),
        height:copy.height()
    })
    $(".hasson").hover(function(){
        $(this).find(".son").finish();
        $(this).find(".son").slideDown(200);
    },function(){
        $(this).find(".son").finish();
        $(this).find(".son").slideUp(200);
    })
    var obj=new shape(copy[0],canvas[0],cobj,$(".xp"),$(".selectarea"));
    //画图的类型
    $(".shapes li").click(function(){
        obj.shapes = $(this).attr("data-role");
        obj.draw();
    })
//    画图的方式
    $(".type li").click(function(){
        obj.type = $(this).attr("data-role");
        obj.draw();
    })
//    边框的颜色
    $(".lineColor input").change(function(){
        obj.bordercolor = $(this).val();
        obj.draw();
    })
    //背景颜色
    $(".fillcolor input").change(function(){
        obj.bgcolor = $(this).val();
        obj.draw();
    })
    //边框粗细
    $(".lineWidth li").click(function(){
        obj.linewidth = $(this).attr("data-role");
        obj.draw();
    })
//  橡皮
$(".xpsize li").click(function(){
    var W = $(this).attr("data-role");
    var H = $(this).attr("data-role");
    obj.xp($(".xp"),W,H);
})
//file
    $(".file li").click(function(){
        var index = $(this).index(".file li");
        if(index == 0){
            if(obj.history.length>0){
                var yes=window.confirm("是否要保存");
                if(yes){
                    location.href=canvas[0].toDataURL().replace("data:image/png","data:stream/octet");
                }
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }else if(index ==1){
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            if(obj.history.length==0){
               alert("不能后退");
                return;
            }
            var data = obj.history.pop();
            cobj.putImageData(data,0,0);
        }else if(index ==2){
            location.href=canvas[0].toDataURL().replace("data:image/png","data:stream/octet");
        }
    })

    $(".select").click(function(){
        obj.select($(".selectarea"));
    })
    $(".parent li").click(function(){
        if(obj.temp){
            obj.history.push(cobj.getImageData(0,0,canvas[0].width,canvas[0].height));
            this.temp=null;
            $(".selectarea").css({
            display:"none"
        })
        }
    })
})