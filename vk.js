var VkApi = function (AppId){
    var appId = AppId;
    var access_token = '';
    var _win;
    var selfUrl = window.location.protocol+'//'+window.location.host;

    function getCenteredCoords(width, height) {
        var xPos = null;
        var yPos = null;
        if (window.ActiveXObject) {
            xPos = window.event.screenX - (width/2) + 100;
            yPos = window.event.screenY - (height/2) - 100;
        } else {
            var parentSize = [window.outerWidth, window.outerHeight];
            var parentPos = [window.screenX, window.screenY];
            xPos = parentPos[0] +
            Math.max(0, Math.floor((parentSize[0] - width) / 2));
            yPos = parentPos[1] +
            Math.max(0, Math.floor((parentSize[1] - (height*1.25)) / 2));
        }
        return [xPos, yPos];
    }

    function parseUrl( url ) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

    function parseResponse (url){
        url = parseUrl(url).search;
        if (url.length > 0){
            url = url.substr(1);
            var tmp = url.split('&');
            url = {};
            for(var i= 0, total= tmp.length; i<total; i++){
                var t = tmp[i].split('=');
                url[t[0]] = t[1];
            }
        }
        return url;
    }

    return {
        _url: '//oauth.vk.com/authorize?',
        secure:true,
        user:{},

        login: function(callback){
            that = this;
            var adr = 'http:';
            var winUrl='';
            if (this.secure){
                adr = 'https:';
            }
            adr += this._url;
            adr += 'client_id='+appId;
            adr += '&scope=video';
            adr += '&redirect_uri='+selfUrl+'/auth.html?'
            adr += '&response_type=code';



            _win = window.open(adr,'Авторизация',"width=800,height=600,resizable=yes,scrollbars=yes,status=no,location=no");
            var coords = getCenteredCoords(800,600);
            _win.moveTo(coords[0],coords[1]);
            var watchClose = setInterval(function() {
                try{
                    if (_win.window.location.href !== 'about:blank'){
                        _win.close();
                        clearTimeout(watchClose);
                        that.user = parseResponse(_win.window.location.href);
                        that._getAccessToken();
                        if (callback != undefined){
                            callback();
                        }
                    }
                } catch(e){}

                /*if (_win.closed) {

                 }*/
            }, 200);

        },

        _getAccessToken: function(callback){
            params = {
                client_id:appId,
                client_secret:'dROZMR2UOdm5d0xjuKl7',
                code:this.user.code,
                redirect_uri:selfUrl+'/auth.html?'
        }
            $.ajax({
                url: 'https://oauth.vk.com/access_token',
                data: params,
                crossDomain: true,
                dataType: 'jsonp',
                type: 'get',
                success: function(data) {
                    console.log(data);

                    if (callback != undefined){
                        callback(data);
                    }
                    console.log(data);
                },

                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    if (error != undefined){
                        error();
                    }
                    console.log('An Ajax error was thrown.');
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        _sendQuery: function (method,param,callback){
            var adr = 'http:';
            if (this.secure){
                adr = 'https:';
            }
            adr += this.url;
            $.get(addr,param,'text')
                .done(function (data){
                    if (callback != undefined){
                        callback(data)
                    }
                })
                .fail(function (){
                    console.log('error')
                });
        }
    }
}
