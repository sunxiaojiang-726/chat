$(function () {
    // 初始化右侧滚动条
    // 这个方法定义在scroll.js中
    resetui();

    // 1. 为发送按钮绑定鼠标点击事件
    $('#btnSend').on('click', function () {
        // 要发送的消息内容，清除两边的空格
        var text = $('#ipt').val().trim();
        if (text.length <= 0) {
            // 如果文本框的内容为空，后边代码不执行，并清空里边内容
            return $('#ipt').val('');
        }
        // 如果用户输入了聊天内容，则将聊天内容追加到页面上显示
        $('#talk_list').append('<li class="right_word"><img src="img/person01.png" /><span>' + text + '</span></li>')
        $('#ipt').val('');
        // 每次追加完成之后，要重置滚动条的位置
        resetui();
        // TODO: 发起请求，获取机器人返回的聊天内容
        getMsg(text);
    })

    // 2. 获取聊天机器人发送过来的消息
    function getMsg(text) {
        $.ajax({
            method: 'GET',
            url: 'http://www.liulongbin.top:3006/api/robot',
            data: {
                spoken: text
            },
            success: function (res) {
                if (res.message === 'success') {//如果请求成功
                    // 接收聊天信息
                    var msg = res.data.info.text;
                    $('#talk_list').append('<li class="left_word"><img src="img/2.png" /> <span>' + msg + '</span></li>');
                    // 重置滚动条的位置
                    resetui();
                    // TODO: 发起请求，将机器人的聊天消息转为语音格式
                    getVoice(msg);
                }
            }
        })
    }

    // 3. 将机器人的聊天内容转换为语音进行播放
    function getVoice(text) {
        $.ajax({
            method: 'GET',
            url: 'http://www.liulongbin.top:3006/api/synthesize',
            data: {
                text: text
            },
            success: function (res) {
                if (res.status === 200) {//如果请求成功
                    // 播放语音
                    $('#voice').attr('src', res.voiceUrl);
                }
            }
        })
    }

    // 4. 使用回车发送消息
    // 为本文输入框绑定keyup事件
    $('#ipt').on('keyup', function (e) {
        if (e.keyCode === 13) {
            $('#btnSend').click();//触发发送按钮的点击事件
        }
    })
})