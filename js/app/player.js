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

        _initGUI: function () {
            var that = this;

            $('#bPlay').one('click', function () {
                console.log(that.file.files['mp4_'+that.curentQuality]);
                that.play(that.file.files['mp4_'+that.curentQuality]);
                $(this).on('click', function () {
                    that.toglePlay();
                });
            });


            $('#bFullScreen').on('click', function () {
                if (screenfull.enabled) {
                    screenfull.toggle(document.getElementById('player_wrapper'));
                }
            });

            $(this.display).on('adapter.progress',function(e,a,b){
                that.progress(a,b);

            });
        },

        play: function(file) {
            this.display.o.startPlay(file);
        },

        toglePlay:function (){
            this.display.o.pp();
        },

        volume: function(val){
            this.display.o.volume(val);
        },

        seek: function(val){
            this.display.o.seek(val);
        },

        chahgeQuality:function (){

        },

        progress:function(t,s){
            var td = Math.round(t/this.file.duration*10000)/100;
            $('.progress-bar').css('width',td+'%');
        }

    }

    window.MDPlayer = Application;
});
