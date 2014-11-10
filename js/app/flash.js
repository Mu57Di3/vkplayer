(function(){

    var isCommonjs = typeof module !== 'undefined' && module.exports;
    var flashvars = {
    };
    var params = {
        menu: "false",
        scale: "noScale",
        allowFullscreen: "true",
        allowScriptAccess: "always",
        bgcolor: "",
        wmode: "opaque" // can cause issues with FP settings & webcam
    };
    var attributes = {
        id:"VPPLAS",
        class:'md_vk_player'
    };

    var MDP_SWF_Adapter = {
        id:'',
        _swf:null,

        init:function(id,callback){
            this.id = id;
            console.log(11111);
            swfobject.embedSWF(
                "swf/VPPLAS.swf",
                id, "100%", "100%", "10.0.0","",
                flashvars, params, attributes,function (e){
                    console.log('object created');
                    console.log(e)
                    if (callback != undefined){
                        callback();
                    }
                });
        },

        get o (){
            if (!this._swf) {
                this._swf = swfobject.getObjectById(attributes.id);
            }
            return this._swf;
        }
    };

    if (isCommonjs) {
        module.exports = MDP_SWF_Adapter;
    } else {
        window.MDP_SWF_Adapter = MDP_SWF_Adapter;
    }

})();
