window.onload = function(){
    document.onkeydown = function (){
        var e = window.event || arguments[0];
        //F12
        if(e.keyCode == 123){
            return false;
        //Ctrl+Shift+I
        }else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)){
            return false;
        //Shift+F10
        }else if((e.shiftKey) && (e.keyCode == 121)){
            return false;
        //Ctrl+U
        }else if((e.ctrlKey) && (e.keyCode == 85)){
            return false;
        }
    };
    document.oncontextmenu = function (){
        return false;
    }
}