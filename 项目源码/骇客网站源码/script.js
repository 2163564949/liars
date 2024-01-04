document.oncontextmenu = new Function("event.returnValue=false;");
document.onselectstart = new Function("event.returnValue=false;");
window.onload = function () {
	document.onkeydown = function (){
			var e = window.event || arguments[0];
			//F12
			if(e.keyCode == 123){
				return false;
			//Ctrl+Shift+I
			}else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)){
				return false;
			//Ctrl+Shift+C
			}else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 67)){
				return false;
			//Shift+F10
			}else if((e.shiftKey) && (e.keyCode == 121)){
				return false;
			//Ctrl+U
			}else if((e.ctrlKey) && (e.keyCode == 85)){
				return false;
			//Ctrl+S
			}else if((e.ctrlKey) && (e.keyCode == 83)){
			return false;
		}
	};
	document.oncontextmenu = function (){
		return false;
	}
    var canvas = document.getElementById("xf_dmy");
    var context = canvas.getContext("2d");
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    var fontSize = 16;
    var colunms = Math.floor(W / fontSize);
    var drops = [];
    for (var i = 0; i < colunms; i++) {
        drops.push(0);
    }
    var str = "01";
    function draw() {
        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fillRect(0, 0, W, H);
        context.font = fontSize + 'px 微软雅黑';
        context.fillStyle = randColor();
        for (var i = 0; i < colunms; i++) {
            var index = Math.floor(Math.random() * str.length);
            var x = i * fontSize;
            var y = drops[i] * fontSize;
            context.fillText(str[index], x, y);
            if (y >= canvas.height && Math.random() > 0.92) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };
    function randColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
	
    draw();
    setInterval(draw, 33);	
};
