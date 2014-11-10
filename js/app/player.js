define(['screenfull.min','app/flash'],function () {

    var Application = function (id){
        console.log(2222);
        var that = this;
        this.file = "http://cs12504v4.vk.me/u18666201/videos/dedab814de.720.mp4?extra=J4AHT2-kbIsofD2vZnu-BsEwqpcvQaVp5Zld7TJleU41Pffj-gXE0yscTxt63Ip6gypx05ivQRaUkJWpmEd8DxO2t0jxLUUA";
        //Добавляем флеш плеер

        this.display = MDP_SWF_Adapter;

        this.display.init(id,function (){
            that._initGUI();
        });
    }

    Application.prototype = {
        display:null,

        _initGUI: function () {
            var that = this;

            $('#bPlay').one('click', function () {
                that.play(that.file);
                $(this).on('click', function () {
                    that.toglePlay();
                });
            });


            $('#bFullScreen').on('click', function () {
                if (screenfull.enabled) {
                    screenfull.toggle(document.getElementById('player_wrapper'));
                }
            });
        },

        play: function(file) {
           /* if (this._swf) {
                this._swf.startPlay(file);
            } else {
                this._getSWF();
                this._swf.startPlay(file);
            }*/

            this.display.o.startPlay(this.file);
        },

        toglePlay:function (){
            if (this._swf) {
                this._swf.pp();
            } else {
                this._getSWF();
                this._swf.pp();
            }
        },

        volume: function(val){
            if (this._swf) {
                this._swf.volume(val);
            } else {
                this._getSWF();
                this._swf.volume(val);
            }
        },

        seek: function(val){
            if (this._swf) {
                this._swf.seek(val);
            } else {
                this._getSWF();
                this._swf.seek(val);
            }
        }

    }

    window.MDPlayer = Application;
});
