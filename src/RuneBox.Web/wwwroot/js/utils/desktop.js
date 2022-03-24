
var Recorder = {
    capturer: new CCapture({
        format: 'webm',
        framerate: 30,
        verbose: true
    }),
    isRecording: false
};

function onSelectBgColor(color) {
    $("#container").css("background", color.toHexString());
    $("#body").css("background", color.toHexString());
}

// element is a input
function onSelectImage(element) {
    if (element.files && element.files[0]) {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#container").css("background", "transparent");
            $("#body").css("background", "url(" + e.target.result + ") no-repeat");
            $("#body").css("background-size", "cover");
        };
        reader.readAsDataURL(file);
    }
}

function startRecord() {
    Recorder.capturer.start();
    Recorder.isRecording = true;
}

function stopRecord() {
    Recorder.capturer.stop();
    Recorder.isRecording = false;
}

function downloadRecord() {
    Recorder.capturer.save();
}

$(document).keypress(function (event) {
    var e = event || window.event;
    var k = e.keyCode || e.which || event.charCode;
    switch (k) {
        case 49: // 1/!
            Metro.charms.toggle("#panelCharm");
            break;
        case 51: // 3/#
            launchFullScreen(document.documentElement);
            break;
    }
    return false;
});


//if ($("#colorpicker")) {
//    $("#colorpicker").spectrum({
//        color: "#000",
//        showAlpha: true,
//        showInput: true,
//        chooseText: "OK",
//        cancelText: "Cancel",
//        change: onSelectBgColor
//    });
//}