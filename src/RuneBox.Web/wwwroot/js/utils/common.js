
function random(min, max) {
    if (typeof min !== 'number') min = 1;
    if (typeof max !== 'number') max = min, min = 0;
    return min + Math.random() * (max - min);
}

function ensureUrlOfInput(id, resetIfEmpty) {
    var element = document.getElementById(id);
    var str = element.value;
    if (str == null || str.length == 0) {
        if (resetIfEmpty == true)
            element.value = "http://";
        return;
    }
    else if (str.startsWith("http://") || str.startsWith("https://"))
        return;
    element.value = "http://" + str;
}

function ensureUrl(str) {
    if (str == null || str == undefined || str.length == 0)
        return null;
    else if (str.startsWith("http://") || str.startsWith("https://"))
        return str;
    return "http://" + str;
}

function getParameter(parameterName) {
    var result = null,
        tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}


function showCharm(id) {
    Metro.charms.open("#" + id);
}

function hideCharm(id) {
    Metro.charms.close("#" + id);
}

function showOrHideCharm(id) {
    Metro.charms.toggle("#" + id);
}

function showOrHideCharm(id, canClose) {
    if (Metro.charms.isOpen("#" + id) === true && canClose === true) {
        Metro.charms.close("#" + id);
    } else {
        Metro.charms.open("#" + id);
    }
}

function disableElement(id) {
    $("#" + id).attr('disabled', true);
}

function enableElement(id) {
    $("#" + id).attr('disabled', false);
}


function showError(msg) {
    // Notify
    //var notify = Metro.notify;
    //notify.setup({
    //    width: 300,
    //    cls: "alert",
    //    timeout: 2500
    //});
    //notify.create(msg, null, {
    //    cls: "alert"
    //});
    //notify.reset();

    // toast
    var toast = Metro.toast.create;
    toast(msg, null, 5000, "bg-red fg-white");
}

function showMessage(msg) {
    // notify
    //var notify = Metro.notify;
    //notify.setup({
    //    width: 300,
    //    timeout: 2500
    //});
    //notify.create(msg, null, {
    //    cls: "success"
    //});
    //notify.reset();

    // toast
    var toast = Metro.toast.create;
    toast(msg, null, 5000, "bg-green fg-white");
}

function redirectUsingPost(url, ajaxData) {
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: ajaxData,
        async: true,
        processData: false,
        cache: false
    });
}

// 重定向的URL通过响应的信息提供
function postAndRedirect(url, ajaxData, buttonId, divMessageId) {
    if (buttonId)
        $("#" + buttonId).attr('disabled', true);
    if (divMessageId)
        $("#" + divMessageId).html();
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: ajaxData,
        async: true,
        processData: false,
        cache: false,
        success: function (data, textStatus, XmlHttpRequest) {
            var data = JSON.parse(XmlHttpRequest.responseText);
            if (data.success == false) {
                //displayError(data.error);
                $("#" + divMessageId).html("<p>" + data.error + "</p>");
                return;
            }
            // success: redirect
            location.href = data.url;
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            var data = "【Status】" + textStatus + "【error】" + errorThrown + "【others】" + XmlHttpRequest.responseText;
            //displayError(data);
            $("#" + divMessageId).html("<p>" + data + "</p>");
            if (buttonId)
                $("#" + buttonId).attr('disabled', false);
        }
    });
}

// 重定向的URL通过响应的信息提供
function saveAndRedirect(url, ajaxData, buttonId) {
    if (buttonId)
        $("#" + buttonId).attr('disabled', true);
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: ajaxData,
        async: true,
        processData: false,
        cache: false,
        success: function (data, textStatus, XmlHttpRequest) {
            var data = JSON.parse(XmlHttpRequest.responseText);
            if (data.success == false) {
                showError(data.error);
                return;
            }
            // success: redirect
            location.href = data.url;
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            var data = "【Status】" + textStatus + "【error】" + errorThrown + "【others】" + XmlHttpRequest.responseText;
            showError(data);
            if (buttonId)
                $("#" + buttonId).attr('disabled', false);
        }
    });
}

function saveAndShowMessage(url, ajaxData, buttonId) {
    $.ajax({
        url: url,
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: ajaxData,
        async: true,
        processData: false,
        cache: false,
        success: function (data, textStatus, XmlHttpRequest) {
            var data = JSON.parse(XmlHttpRequest.responseText);
            //console.log(data);
            if (data.success == false) {
                showError(data.error);
                return;
            }
            // success: show message
            showMessage(data.message);
            $("#" + buttonId).attr('disabled', false);
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            var data = "【Status】" + textStatus + "【error】" + errorThrown + "【others】" + XmlHttpRequest.responseText;
            showError(data);
            $("#" + buttonId).attr('disabled', false);
        }
    });
}

// 需要调用: Scripts/3rd/imageviewer.js
function showImage(url) {
    if (url == null || url == undefined || url.length == 0)
        return;
    var data = [];
    data.push(url);
    showImagesInViewer(data);
}

// 需要调用: sha512.js
function generateRobotAvatar(site, username, imageExt = ".png") {
    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(username + "@" + site);
    var hash = shaObj.getHash("HEX");
    return "https://robohash.org/" + hash + imageExt;
}