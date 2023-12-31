//开启定时器添加雪花图片
setInterval(function(){
    var img = $("<img src='images/snow.png'>");
    $("body").append(img);
    //设置雪花的尺寸10- 20px
    //0-20 + 20
    var size = parseInt(Math.random()*11)+10;
    img.css("width",size+"px");
    //得到屏幕宽度
    var w = $(window).width();
    //取值范围应该是0-屏幕宽度-雪花宽度
    var left =parseInt(Math.random()*(w-size));
    //把得到的随机1eft给到图片
    img.css("left",left+"px");
    //添加雪花移动的动画
    //得到雪花移动的距离 = 屏幕高度-雪花尺寸
    var top = $(window).height()-size;
    
    img.animate({"top":top+"px"},size*100)
    /* .fadeOut(1000,function(){
        //当动画完成时执行此代码
        img.remove();
        //console.log($("img").length);
    }); */
},10)