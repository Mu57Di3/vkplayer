define(['screenfull.min','app/flash'],function () {

    var Application = function (id,file){
        var that = this;
        this.file = file;

        //получаем минимальнодоступное качество
        var q = Object.keys(file.files);
        this.curentQuality = String(q[0]).replace('mp4_','');

        //Выводим заголовок и время
        var min = Math.round(file.duration/60),
            sec = file.duration%60;

        $('#video_dutation').text(min+':'+sec);
        $('#video_title').text(file.title);

        //Добавляем флеш плеер
        this.display = MDP_SWF_Adapter;

        this.display.init(id,function (){
            that._initGUI();
        });

    }

    Application.prototype = {
        display:null,
        curentQuality: 240,
        file:null,
        status:0,

        _playerWrapper:null,
        _player:null,

        STOP:0,
        PLAYED:1,
        PAUSED:2,

        rotateAngle:0,

        elH: 0,
        elW: 0,
        dCP: 0,

        _initGUI: function () {
            var that = this;

            this._playerWrapper = $('#player_wrapper');
            this._player = $('#swf_wrapper');

            this.elH = String(this._playerWrapper.css('height')).replace('px','');
            this.elW = String(this._playerWrapper.css('width')).replace('px','');

            this.dCP = Math.abs((this.elW/2)-(this.elH/2));


            console.log('INIT GUI');

            //генерим кнопочки с качеством
            var q = Object.keys(this.file.files),
                cnt = q.length;
            console.log(cnt);
            for(var i=0;i<cnt;i++){
                var qp = q[i].replace('mp4_','');
                $('#b'+qp).on('click',function(e){
                    that.chahgeQuality($(this).attr('q'));
                });
            }


            $('#bPlay').one('click', function () {
                console.log(that.file.files['mp4_'+that.curentQuality]);
                that.play(that.file.files['mp4_'+that.curentQuality]);
                that.status = that.PLAYED;
                $(this).find('i.glyphicon ').addClass('glyphicon-pause');
                $(this).on('click', function () {
                    that.toglePlay();
                    
                });
            });

            //апдейтим размер плеера при изменении размера
            screenfull.onchange = function(){
                that.elH = String(that._playerWrapper.css('height')).replace('px','');
                that.elW = String(that._playerWrapper.css('width')).replace('px','');

                that.dCP = Math.abs((that.elW/2)-(that.elH/2));
                if (that.rotateAngle == 90 || that.rotateAngle == 270){
                    $(that._player).css('width',that.elH);
                    $(that._player).css('height',that.elW);
                    $(that._player).css('top','-'+that.dCP+'px');
                    $(that._player).css('left',that.dCP+'px');
                } else {
                    $(that._player).css('width',that.elW);
                    $(that._player).css('height',that.elH);
                    $(that._player).css('top','0');
                    $(that._player).css('left','0');
                }
            }


            $('#bFullScreen').on('click', function () {
                if (screenfull.enabled) {
                    screenfull.toggle(document.getElementById('player_wrapper'));
                }
            });

            $(this.display).on('adapter.progress',function(e,a,b){
                that.progress(a,b);

            });

            $(this.display).on('adapter.stop',function(e){
                console.log(1111);
                that.status = that.STOP;
                $('#bPlay').off('click');
                $('#bPlay').find('i.glyphicon ').removeClass('glyphicon-pause');
                $('#bPlay').find('i.glyphicon ').removeClass('glyphicon-play');
                $('#bPlay').find('i.glyphicon ').addClass('glyphicon-repeat');

                $('#bPlay').one('click',function (){
                    $(this).find('i.glyphicon ').removeClass('glyphicon-repeat');
                    $(this).find('i.glyphicon ').addClass('glyphicon-pause');
                    $(this).on('click', function () {
                        that.toglePlay();
                    });
                    that.replay();
                });
            });

            $('.progress').on('click',function (e){

                if (that.status > 0){
                    var cx = e.clientX,
                        ep = 40,
                        ew = String($('.progress').css('width')).replace('px',''),
                        dw = Math.round((cx-ep)/ew*10000)/10000,
                        time = that.file.duration*dw;
                    that.seek(time);
                }
            })

            $('#bRotate').on('click',function(){
                that.rotate();
            });
        },

        play: function(file) {
            this.display.o.startPlay(file);
        },

        toglePlay:function (){
            this.display.o.pp();
            $('#bPlay').find('i.glyphicon ').removeClass('glyphicon-pause');
            $('#bPlay').find('i.glyphicon ').removeClass('glyphicon-play');
            if (this.status == this.PLAYED){
                this.status = this.PAUSED;
                $('#bPlay').find('i.glyphicon ').addClass('glyphicon-play');
            } else if (this.status == this.PAUSED){
                this.status = this.PLAYED
                $('#bPlay').find('i.glyphicon ').addClass('glyphicon-pause');
            }
        },

        volume: function(val){
            this.display.o.volume(val);
        },

        seek: function(val){
            this.display.o.seek(val);
        },

        replay:function(){
            this.display.o.replay();
            this.status = this.PLAYED;
        },

        chahgeQuality:function (val){
            console.log(' Change Quality - '+val);
            this.curentQuality = val;
            var time =  this._getTime();
            console.log(time);
            if (this.status != this.STOP) {
                this.display.o.changeQuality(this.file.files['mp4_' + val], time);
            }
        },

        _getTime:function(){
            var dpb = $('.progress-bar').css('width').replace('px',''),
                pb = $('.progress').css('width').replace('px','');
            console.log();
            return Math.round(this.file.duration * (dpb/pb));
        },

        progress:function(t,s){
            var td = Math.round(t/this.file.duration*10000)/100;
            $('.progress-bar').css('width',td+'%');
        },

        rotate:function(){
            this.elH = String(this._playerWrapper.css('height')).replace('px','');
            this.elW = String(this._playerWrapper.css('width')).replace('px','');

            this.dCP = Math.abs((this.elW/2)-(this.elH/2));



            this.rotateAngle+=90;
            this.rotateAngle= this.rotateAngle ==360 ? 0 : this.rotateAngle;
            


            $(this._player).css('mozTransform','rotate('+this.rotateAngle+'deg)');
            $(this._player).css('transform','rotate('+this.rotateAngle+'deg)');
            $(this._player).css('webkitTransform','rotate('+this.rotateAngle+'deg)');
            $(this._player).css('msTransform','rotate('+this.rotateAngle+'deg)');
            $(this._player).css('oTransform','rotate('+this.rotateAngle+'deg)');

            if (this.rotateAngle == 90 || this.rotateAngle == 270){
                $(this._player).css('width',this.elH);
                $(this._player).css('height',this.elW);
                $(this._player).css('top','-'+this.dCP+'px');
                $(this._player).css('left',this.dCP+'px');
            } else {
                $(this._player).css('width',this.elW);
                $(this._player).css('height',this.elH);
                $(this._player).css('top','0');
                $(this._player).css('left','0');
            }

        }

    }

    window.MDPlayer = Application;
});
