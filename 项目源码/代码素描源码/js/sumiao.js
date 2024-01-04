(function() {
    var asciiContainer = document.getElementById("ascii");
    var capturing = false;

    camera.init({
        width: 160,
        height: 120,
        fps: 30,
        mirror: true,

        onFrame: function(canvas) {
            ascii.fromCanvas(canvas, {
                callback: function(asciiString) {
                    asciiContainer.innerHTML = asciiString;
                }
            });
        },

        onSuccess: function() {
            document.getElementById("info").style.display = "none";

            const button = document.getElementById("button");
            button.style.display = "block";
            button.onclick = function() {
                if (capturing) {
                    camera.pause();
                    button.innerText = '恢复';
                } else {
                    camera.start();
                    button.innerText = '拍照';
                }
                capturing = !capturing;
            };
        },

        onError: function(error) {
        },

        onNotSupported: function() {
            document.getElementById("info").style.display = "none";
            asciiContainer.style.display = "none";
            document.getElementById("notSupported").style.display = "block";
        }
    });
})();