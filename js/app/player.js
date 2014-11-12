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

        STOP:0,
        PLAYED:1,
        PAUSED:2,

        rotateAngle:0,

        elH: 0,
        elW: 0,
        dCP: 0,

        _initGUI: function () {
            var that = this;

            this.elH = String($('#player_wrapper').css('height')).replace('px','');
            this.elW = String($('#player_wrapper').css('width')).replace('px','');

            this.dCP = Math.abs((this.elW/2)-(this.elH/2));


            console.log('INIT GUI');
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
                that.elH = String($('#player_wrapper').css('height')).replace('px','');
                that.elW = String($('#player_wrapper').css('width')).replace('px','');

                that.dCP = Math.abs((that.elW/2)-(that.elH/2));
                if (that.rotateAngle == 90 || that.rotateAngle == 270){
                    $(that.display.o).css('width',$('#player_wrapper').css('height'));
                    $(that.display.o).css('height',$('#player_wrapper').css('width'));
                    $(that.display.o).css('top','-'+that.dCP+'px');
                    $(that.display.o).css('left',that.dCP+'px');
                } else {
                    $(that.display.o).css('width',$('#player_wrapper').css('width'));
                    $(that.display.o).css('height',$('#player_wrapper').css('height'));
                    $(that.display.o).css('top','0');
                    $(that.display.o).css('left','0');
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

        chahgeQuality:function (){

        },

        progress:function(t,s){
            var td = Math.round(t/this.file.duration*10000)/100;
            $('.progress-bar').css('width',td+'%');
        },

        rotate:function(){
            var elH = 0, elW= 0, dCP = 0;


            this.elH = String($('#player_wrapper').css('height')).replace('px','');
            this.elW = String($('#player_wrapper').css('width')).replace('px','');

            this.dCP = Math.abs((this.elW/2)-(this.elH/2));

            console.log(dCP);

            this.rotateAngle+=90;
            this.rotateAngle= this.rotateAngle ==360 ? 0 : this.rotateAngle;

            if (this.rotateAngle == 90 || this.rotateAngle == 270){
                $(this.display.o).css('width',$('#player_wrapper').css('height'));
                $(this.display.o).css('height',$('#player_wrapper').css('width'));
                $(this.display.o).css('top','-'+this.dCP+'px');
                $(this.display.o).css('left',this.dCP+'px');
            } else {
                $(this.display.o).css('width',$('#player_wrapper').css('width'));
                $(this.display.o).css('height',$('#player_wrapper').css('height'));
                $(this.display.o).css('top','0');
                $(this.display.o).css('left','0');
            }

            $(this.display.o).css('mozTransform','rotate('+this.rotateAngle+'deg)');
            $(this.display.o).css('transform','rotate('+this.rotateAngle+'deg)');
            $(this.display.o).css('webkitTransform','rotate('+this.rotateAngle+'deg)');
            $(this.display.o).css('msTransform','rotate('+this.rotateAngle+'deg)');
            $(this.display.o).css('oTransform','rotate('+this.rotateAngle+'deg)');


        }

    }

    window.MDPlayer = Application;
});
