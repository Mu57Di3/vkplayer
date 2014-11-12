define(['app/player'],function () {
    var vctest;
    var file = {
        id: 157857876,
        owner_id: 18666201,
        title: 'The Guild - Game On',
        duration: 228,
        description: 'от лучшего в мире вебкаста The Guild!',
        date: 1292741814,
        views: 5,
        comments: 0,
        photo_130: 'http://cs12546.vk.me/u711703/video/s_6d206cf6.jpg',
        photo_320: 'http://cs12546.vk.me/u711703/video/l_7467cd07.jpg',
        files: {
            mp4_240: 'http://vktest.mu57di3.org/video/157857876-240.mp4',
            mp4_360: 'http://vktest.mu57di3.org/video/157857876-360.mp4',
            mp4_480: 'http://vktest.mu57di3.org/video/157857876-480.mp4',
            mp4_720: 'http://vktest.mu57di3.org/video/157857876-720.mp4'
        },
        player: 'http://vk.com/video_ext.php?oid=18666201&id=157857876&hash=58f05f46f59b803a&api_hash=1415727274b2fe4b3a7ab271ffee',
        privacy_view: {
            type: 'all'
        },
        privacy_comment: {
            type: 'all'
        },
        can_repost: 1,
        likes: {
            user_likes: 0,
            count: 0
        },
        repeat: 0
    };

    var params = {
        videos:'18666201_157857876',
        access_token:'526d61b057c05f5b59f0de5ae1ace073b5bccd7c6d1d579d31fc4fc76ce61a2caeeb8b94ff41aa1bb5e89'
    }

    $.ajax({
        url: 'https://api.vk.com/method/video.get',
        data: params,
        crossDomain: true,
        dataType: 'jsonp',
        type: 'get',
        success: function(data) {
            file = data.response[1];
            console.log(file);
            vctest = new MDPlayer('altContent',file);

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

});