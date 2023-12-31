(function($) { 
var source = [];  //游戏资源, 存放图片和声音
var c = $("#game-box");  //游戏容器
var cxt = c.get(0).getContext("2d");  //构造画布
var c_width, c_height;  //画布的高和宽

//游戏结束信息提示框
var modal = {
    "show": function (s) {
        $("#content").html(s);
        $("#modal").removeClass("hide");
    },
    "hide": function () {
        $("#modal").addClass("hide");
    }
};

//游戏配置
var config = {
    "imageSrc" : "images/",  //图片url前缀
    "soundSrc" : "sounds/",  //声音url前缀
    "loadImg" : ['bg.jpg', 'loading1.png', 'loading2.png', 'loading3.png', 'logo.png'],  //等待动画图片资源
    "gameImg" : ['cartridge.png', 'cartridge_power.png', 'die1.png', 'die2.png', 'me.png', 'plain1.png', 'plain2.png', 'plain3.png', 'plain2_hurt.png', 'plain3_hurt.png', 'plain1_die1.png', 'plain1_die2.png', 'plain1_die3.png', 'plain2_die1.png', 'plain2_die2.png', 'plain2_die3.png', 'plain2_die4.png', 'plain3_die1.png', 'plain3_die2.png', 'plain3_die3.png', 'plain3_die4.png', 'plain3_die5.png', 'plain3_die6.png', 'me_die1.png', 'me_die2.png', 'me_die3.png', 'me_die4.png', 'prop1.png', 'prop2.png', 'bomb.png', 'me_2.png', 'plain3_2.png'],  //游戏图片资源
    "gameSound" : ['achievement.mp3', 'plain2_die.mp3', 'plain3_die.mp3', 'fire_bullet.mp3', 'game_music.mp3', 'game_over.mp3', 'get_bomb.mp3', 'get_double_laser.mp3', 'show_prop.mp3', 'plain1_die.mp3', 'use_bomb.mp3'],
    "gameSpeed" : 8,  //游戏速度
    "cartridgeSpeed" : 10,  //子弹速度
    "isMobile" : navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|mobile)/)  //是否手机 
};

main();  //执行main方法
//新建图片函数
function creatImg(src) {
    if(typeof source[src] != "undefined") {
        return source[src];
    }
    source[src] = new Image();
    source[src].src = config.imageSrc + src;
    return source[src];
}

//新建声音函数
function creatAudio(src) {
    if(typeof source[src] != "undefined") {
        return source[src];
    }
    source[src] = new Audio();
    source[src].src = config.soundSrc + src;
    return source[src];
}

//播放声音方法
function playAudio(src) {
    if(config.isMobile) {
        return;
    }
    var media = creatAudio(src);
    media.currentTime = 0;
    media.play();
}

//图片预加载函数
function loadImage(images, callback) {
    var toLoadLength = images.length;
    var loadLength = 0;
    for(var i=toLoadLength; i--;) {
        var src = images[i];
        source[src] = new Image();
        source[src].onload = function () {
            loadLength++;
            if (toLoadLength == loadLength) {
                callback();
            }
        }
        source[src].src = config.imageSrc + src;
    }
}

//声音预加载函数
function loadSound(sounds, callback) {
    var toloadLength = sounds.length;
    var loadLength = 0;
    for(var i=toloadLength; i--;) {
        var src = sounds[i];
        source[src] = new Audio();
        source[src].addEventListener("canplaythrough", function () {
            loadLength++;
            if (toloadLength == loadLength) {
                callback();
            }
        });
        source[src].src = config.soundSrc + src;
    }
}


//游戏主事件
function main() {
    loadImage(config.loadImg, loading);

    resize();
    $(window).on("resize", resize);
    function resize() {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        c_height = screenHeight < 800 ? screenHeight : 800;
        c_width = screenWidth < 480 ? screenWidth : 480;
        c.attr({
            height: c_height,
            width: c_width
        }).offset({
            top: (screenHeight - c_height) / 2
        });
        
        cxt.font = "30px Microsoft YaHei";
        cxt.fillStyle = "#333";
    }
}

//等待事件
function loading() {
    //等待时间
    var loadingTime = 0;

    //等待动画刷新事件
    var refresh = function () {
        drawBg();
        drawLogo();
        load();
        loadingTime++;
    }

    //设置背景
    function drawBg() {
        var bg_img = creatImg("bg.jpg");
        var bg_img_width = bg_img.width;
        var bg_img_height = bg_img.height;
        cxt.drawImage(bg_img, 0, 0, bg_img_width, bg_img_height);
    }

    //构造logo
    function drawLogo() {
        var logo_img = creatImg("logo.png");
        var logo_width = logo_img.width;
        var logo_height = logo_img.height;

        var x = (c_width - logo_width) / 2;
        var y = 100;
        cxt.drawImage(logo_img, x, y, logo_width, logo_height);
    }

    //等待动画
    function load() {
        if (loadingTime == 600) {
            loadingTime = 0;
        }

        //loadingTime每隔200换一张图, 实现等待动画
        var pic = creatImg("loading" + (parseInt(loadingTime / 200) + 1) + ".png");
        var pic_width = pic.width;
        var pic_height = pic.height;

        var x = (c_width - pic_width) / 2;
        cxt.drawImage(pic, x, 220, pic_width, pic_height);
    }

    //开始动画
    var loadingClock = setInterval(refresh, 1);
    loadSound(config.gameSound, function () {
        loadImage(config.gameImg, function () {
            clearInterval(loadingClock);
            game();
        });
    });
}

function game() {
    var player = {};
    player.GodMod = false;
    player.x;
    player.y;
    player.lastX;
    player.lastY;
    player.bomb = 0;
    player.status = true;
    player.model = creatImg("me.png");
    player.model2 = creatImg("me_2.png");
    player.width = c_width / 480 * player.model.width;
    player.height = player.width / player.model.width * player.model.height;
    player.move = function (x, y) {
        player.lastX = player.x;
        player.lastY = player.y;        //鼠标的坐标是飞机的右下角位置
        player.x = x - player.width / 2;
        player.y = y - player.height / 2;
        player.x = player.x > c_width - player.width ? c_width - player.width : player.x;
        player.x = player.x < 0 ? 0 : player.x;
        player.y = player.y > c_height - player.height ? c_height - player.height : player.y;
        player.y = player.y < 0 ? 0 : player.y;
    }
    player.moveing = function () {
        if (!player.status) {
            return;
        }
                
        cxt.drawImage(game.time % 30 > 15 ? player.model : player.model2, player.x, player.y, player.width, player.height);
        player.attacking();
    }
    player.cartridges = [];
    player.attackTime = 0;
    player.attackPower = false;
    player.attack = function () {
        if (!player.status) {
            return;
        }

        player.attackTime++;
        if ((player.attackTime * game.refreshInterval) % (game.refreshInterval * 20) != 0) {
            return;
        }

        player.attackTime = 0;
        playAudio("fire_bullet.mp3");
        var cartridges;
        window.document.onkeydown = function (evt){
    		evt = (evt) ? evt : window.event
			if (evt.keyCode) {
				if(evt.keyCode == 49){
			     player.attackPower = false;
			     player.GodMod = false;
			     game.player.bomb = 0;
			     //do something
			   }
			   if(evt.keyCode == 50){
			     player.attackPower = true;
			     //do something
			   }
			   
			   if(evt.keyCode == 51){
			     game.player.bomb += 10;
			     //do something
			   }
			   if(evt.keyCode == 52){
			   	player.attackPower = false;
			     player.GodMod = true;
			     //do something
			   }
			}
    	}
        if (player.attackPower) {
            cartridges = [(new cartridge(player.x - (player.width / 5), player.y, 2, player)), (new cartridge(player.x + (player.width / 5), player.y, 2, player))];
        }else if (player.GodMod) {
        	game.player.bomb = 1000;
            cartridges = [(new cartridge(player.x - 3 * (player.width / 5), player.y, 3, player)), (new cartridge(player.x - 2*(player.width / 5), player.y, 3, player)), (new cartridge(player.x - (player.width / 5), player.y, 3, player)), (new cartridge(player.x, player.y, 3, player)), (new cartridge(player.x + (player.width / 5), player.y, 3, player)), (new cartridge(player.x + 2*(player.width / 5), player.y, 3, player)), (new cartridge(player.x + 3*(player.width / 5), player.y, 3, player))];
        }else{
            cartridges = [(new cartridge(player.x, player.y, 1, player))];
        }
        Array.prototype.push.apply(player.cartridges, cartridges);
    }
    player.attacking = function () {
        player.attack();
        var cartridgeSpeed = config.cartridgeSpeed;
        var cartridges_length = player.cartridges.length;
        firstloop: for(var i=cartridges_length; i--;) {
            var cartridge = player.cartridges[i];
            cxt.drawImage(cartridge.model, cartridge.x, cartridge.y, cartridge.width, cartridge.height);
            if (cartridge.y <= 0) {
                player.cartridges.splice(i, 1);
                continue firstloop;
            }

            var plain_length = game.plains.length;
            secondloop: for(var j=plain_length; j--;) {
                var plain = game.plains[j];
                var X = cartridge.x;
                var Y = cartridge.y;
                var nextY = Y - cartridgeSpeed;
                if (
                    X > plain.x
                    && X < (plain.x + plain.width)
                    && nextY < (plain.y + plain.height + plain.speed)
                    && Y >= (plain.y + plain.height)
                ) {
                    plain.byAttack();
                    player.cartridges.splice(i, 1);
                    continue firstloop;
                }
            }

            cartridge.y = cartridge.y - cartridgeSpeed;  //子弹向上移动
        }
    }
    player.useBomb = function () {
    
        if (game.player.bomb <= 0) {
            return;
        }
        game.player.bomb--;
        playAudio("use_bomb.mp3");
        var plains_length = game.plains.length;
        for (var i = plains_length; i--; ) {
            var plain = game.plains[i];
            plain.die();
        }
    }
    player.die = function () {
        if (!player.status) {
            return;
        }

        player.status = false;
        playAudio("game_over.mp3");
        var dieSpeed = 20;
        var x = player.x;
        var y = player.y;
        var h = player.height;
        var w = player.width;
            
        game.plainsDies.push((new playerDie()));

        function playerDie() {
            var dieTime = 4 * dieSpeed;
            this.animationTime = 4 * dieSpeed;

            this.call = function () {
                if (this.animationTime == 1) {
                    game.over();
                }
                var dieModel = creatImg("me_die" + (parseInt((dieTime - this.animationTime) / dieSpeed) + 1) + ".png");
                cxt.drawImage(dieModel, x, y, w, h);
                this.animationTime--;
            }
        }
    }

    var game = {};
    game.score = 0;
    game.time = 0;

    game.player = player;

    game.bgImg = creatImg("bg.jpg");
    game.refreshInterval = config.gameSpeed;

    game.refresh = function () {
        game.time++;
        game.bgScroll();
        game.plainsScroll();
        game.plainsDying();
        game.player.moveing();
        game.propShow();
        game.refreshMessage();       
    }

    game.bgScrollTime = 0;
    game.bgScroll = function () {
        var bg_img_height = game.bgImg.height;
        var bg_img_width = game.bgImg.width;
        game.bgScrollTime += 0.5;
        if (game.bgScrollTime > bg_img_height) {
            game.bgScrollTime = 0;
        }
        cxt.drawImage(game.bgImg, 0, game.bgScrollTime - bg_img_height, bg_img_width, bg_img_height);
        cxt.drawImage(game.bgImg, 0, game.bgScrollTime, bg_img_width, bg_img_height);
    }
    game.props = [];
    game.addProp = function () {
        var interval = 10;
        if((game.time * game.refreshInterval) % (interval * 1000) == 0) {
            game.props.push((new prop(parseInt(Math.random() * 1.8 + 1.1))));
            playAudio("show_prop.mp3");
        }
    }
    game.propShow = function () {
        game.addProp();
        var props_length = game.props.length;
        for(var i=props_length; i--;) {
            var prop = game.props[i];
            if(prop.isDeleted == true) {
                game.props.splice(i ,1);
                continue;
            }

            prop[prop.status]();

            if(prop.y > c_height) {
                game.props.splice(i ,1);
                continue;
            }
        }
    }

    game.plains = [];
    game.plainsNum = 0;
    game.addPlain = function () {
        if (game.time % 60 != 0) {
            return;
        }

        if (game.plainsNum == 26) {
            game.plainsNum = 0;
        }

        game.plainsNum++;
        switch (true) {
            case game.plainsNum % 13 == 0:
                game.plains.push(new plain(3));
                break;
            case game.plainsNum % 6 == 0:
                game.plains.push(new plain(2));
                break;
            default:
                game.plains.push(new plain(1));
                break;
        }

    }
    game.plainsScroll = function () {
        game.addPlain();
        var removePlain = [];
        var plains_length = game.plains.length;
        for(var i=plains_length; i--;) {
            var plain = game.plains[i];
            if (plain.y > c_height || plain.status == false) {
                game.plains.splice(i, 1);
                continue;
            }

            plain.show();

            if (isCollide(plain)) {
                game.player.die();
            }

            plain.y = plain.y + plain.speed;
        }

        //判断是否和玩家的飞机碰撞
        function isCollide(plain) {
            var plainTopLeft = [plain.x, plain.y];
            var plainBottomRight = [plain.x + plain.width, plain.y + plain.height];
            var meTopLeft = [game.player.x + game.player.width / 3, game.player.y];
            var meBottomRight = [game.player.x + (game.player.width * 2 / 3), game.player.y + (game.player.height * 2 / 3)];

            var collideTopLeft = [Math.max(plainTopLeft[0], meTopLeft[0]), Math.max(plainTopLeft[1], meTopLeft[1])];
            var collideBottomRight = [Math.min(plainBottomRight[0], meBottomRight[0]), Math.min(plainBottomRight[1], meBottomRight[1])];

            if (collideTopLeft[0] < collideBottomRight[0] && collideTopLeft[1] < collideBottomRight[1]) {
                return true;
            }

            return false;
        }
    }
    game.plainsDies = [];
    game.plainsDying = function () {
        var plainsDies_length = game.plainsDies.length;
        for(var i=plainsDies_length; i--;) {
            var plainDie = game.plainsDies[i];
            if (plainDie.animationTime == 0) {
                game.plainsDies.splice(i, 1);
                continue;
            }
            plainDie.call();
        }
    }
    game.over = function () {
        game.music.pause();
        c.removeClass("playing");
        if (config.isMobile) {
            c.get(0).removeEventListener("touchmove");
        } else {
            c.off("mousemove");
        }
        c.off("click");
        clearInterval(game.clock);
        modal.show(game.score);
    }
    game.clear = function () {
        game.player.x = (c_width - game.player.width) / 2;
        game.player.y = c_height - game.player.height;

        game.plains = [];
        game.plainsDies = [];
        game.plainsNum = 0;
        game.time = 0;
        game.bgScrollTime = 0;
        game.score = 0;
        game.player.status = true;
        game.player.bomb = 0;
        game.player.attackPower = false;
        clearTimeout(game.player.attackPowerClock);
    }
    game.music = creatAudio("game_music.mp3");
    game.start = function () {
        game.music.currentTime = 0;
        game.music.loop = true;
        game.music.play();

        c.addClass("playing");
        c.on("click", game.player.useBomb);
        if (config.isMobile) {
            c.get(0).addEventListener("touchmove", function (e) {
                e.preventDefault();
                var touch = e.targetTouches[0];
                var x = touch.pageX - c.offset().left;
                var y = touch.pageY - c.offset().top;
                game.player.move(x, y);
            });
        } else {
            c.on("mousemove", function (e) {
                var e = e ? e : window.event;
                var x = e.clientX - c.offset().left;
                var y = e.clientY - c.offset().top;
                game.player.move(x, y);
            });
        }

        modal.hide();
        game.clear();
        game.clock = setInterval(function () {
            game.refresh();
        }, game.refreshInterval);
    }
    game.refreshMessage = function () {
        cxt.fillText(game.score, 20, 44);

        if(game.player.bomb > 0) {
            var bombModel = creatImg("bomb.png");
            cxt.drawImage(bombModel, 10, c_height - bombModel.height - 10, bombModel.width, bombModel.height);
            cxt.fillText(game.player.bomb, 20 + bombModel.width, c_height - bombModel.height + 28);
        }
    }
    game.start();

    function prop(type) {
        this.type = type;
        this.status = "show";
        this.isDeleted = false;
        this.modelImg;
        this.getSound;
        switch(type) {
            case 1:
                this.modelImg = "prop1.png";
                this.getSound = "get_bomb.mp3";
                break;
            case 2:
                this.modelImg = "prop2.png";
                this.getSound = "get_double_laser.mp3";
                break;
        }
        this.model = creatImg(this.modelImg);
        this.width = c_width / 480 * this.model.width;
        this.height = this.model.height / this.model.width * this.width;
        this.x = Math.random() * (c_width - this.width);
        this.y = -this.height;

        var speed = this.speed = 6;
        var animateTime = this.animateTime = 70;
        this.showType = "down";
        this.show = function () {
            if(this.animateTime <= animateTime / 2) {
                this.showType = "up";
            }
            cxt.drawImage(this.model, this.x, this.y, this.width, this.height);
            if(isGain(this)) {
                this.isDeleted = true;
                this.byGain();
                return;
            }
            var move = ((c_height + this.height) / 3) / (animateTime / 2);
            this.speed = move;
            if(this.showType == "down") {
                this.y += move; 
            } else {
                this.y -= move; 
            }
            this.animateTime--;
            if(this.animateTime <= 0) {
                this.speed = speed;
                this.status = "move";
            }
        }
        this.move = function () {
            this.y += this.speed;
            cxt.drawImage(this.model, this.x, this.y, this.width, this.height);
            if(isGain(this)) {
                this.isDeleted = true;
                this.byGain();
                return;
            }
        }

        this.byGain = function () {
            switch (this.type) {
                case 1:
                    game.player.bomb++;
                    break;
                case 2:
                    game.player.attackPower = true;
                    game.player.attackPowerClock = setTimeout(function () {
                        game.player.attackPower = false;
                    }, 15000);
                    break;
            }
            playAudio(this.getSound);
        }

        //判断有没有吃到道具
        var isGain = function(prop) {
            var leftX = prop.x;
            var rightX = prop.x + prop.width;
            if(rightX < game.player.x || leftX > (game.player.x + game.player.width)) {
                return false;
            }
            var removing = prop.status == "move" ? prop.speed : (prop.showType == "down" ? prop.speed : -prop.speed);
            var nextY = prop.y + removing;
            if(((prop.y + prop.height) > game.player.y || (nextY + prop.height) < game.player.y) && game.player.lastY > (prop.y + prop.height)) {
                return false;
            }
            return true;
        }
    }

    function plain(type) {
        this.type = type;
        this.hp;  //飞机生命值
        this.height;
        this.width;
        this.maxSpeed;
        this.dieTime;
        this.status = true;  //飞机死了没
        var dieSpeed = 20;  //死亡动画播放速度

        switch (type) {
            case 1:
                this.hp = 1;
                this.score = 1000;
                this.maxSpeed = 5;
                this.dieTime = dieSpeed * 3;
                break;
            case 2:
                this.hp = 8;
                this.score = 8000;
                this.maxSpeed = 2;
                this.dieTime = dieSpeed * 4;
                break;
            case 3:
                this.hp = 18;
                this.score = 30000;
                this.maxSpeed = 1;
                this.dieTime = dieSpeed * 6;
                break;
        }

        this.dieSound = "plain" + this.type + "_die.mp3";
        this.modelimg = "plain" + this.type + ".png";
        this.model = creatImg(this.modelimg);

        if(this.type == 3) {
            this.modelimg2 = "plain3_2.png";
            this.model2 = creatImg(this.modelimg2);
        }

        this.width = c_width / 480 * this.model.width;
        this.height = this.width / this.model.width * this.model.height;

        this.x = Math.random() * (c_width - this.width);
        this.y = -(this.height);

        var maxSpeed = game.time / 1000 > 10 ? 10 : game.time / 1000;
        this.speed = Math.random() * (maxSpeed - 1) + 1;
        this.speed = this.speed < 0.5 ? Math.random() * 0.5 + 0.5 : this.speed;
        this.speed = this.speed > this.maxSpeed ? this.maxSpeed : this.speed;

        this.show = function () {
            if(this.type == 3) {
                cxt.drawImage(game.time % 30 > 15 ? this.model : this.model2, this.x, this.y, this.width, this.height);
                return;
            }
            cxt.drawImage(this.model, this.x, this.y, this.width, this.height);
        }

        this.die = function () {
            var plainType = this.type;
            var plainX = this.x;
            var plainY = this.y;
            var plainW = this.width;
            var plainH = this.height;

            game.plainsDies.push((new die(this.dieTime)));
                    
            game.score += this.score;
            this.status = false;

            function die(dieTime) {
                var dieTime = dieTime;
                this.animationTime = dieTime;

                this.call = function () {
                    if (this.animationTime <= 0) {
                        return;
                    }
                    var dieModel = creatImg("plain" + plainType + "_die" + (parseInt((dieTime - this.animationTime) / dieSpeed) + 1) + ".png");
                    cxt.drawImage(dieModel, plainX, plainY, plainW, plainH);
                    this.animationTime--;
                }
            }
        }

        var hp = this.hp;
        this.byAttack = function () {
            this.hp--;
            if (this.hp <= 0) {
                this.die();
                playAudio(this.dieSound);
                return;
            }

            if (this.hp <= hp / 3) {
                this.model = creatImg("plain" + this.type + "_hurt.png");
            }
        }
    }

    function cartridge(x, y, type, player) {
        this.model = creatImg(type == 2 ? "cartridge_power.png" : "cartridge.png");
        this.model = creatImg(type == 3 ? "cartridge_power.png" : "cartridge.png");
                
        this.width = c_width / 480 * this.model.width;
        this.height = this.width / this.model.width * this.model.height;
        this.x = x + (player.width - this.width) / 2;
        this.y = y - this.height;
    }

    $("#modal").on("click", "button", game.start);


}
})(jQuery);