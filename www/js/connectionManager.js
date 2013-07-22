var back = false;
var connection;

var user = {};
var friendList = {};
var groupList = {};
var actualOpeningChat = "";
var openConversation = [];
var messageArrayText;

$(function() {
    connect();
    background();
    messageArrayText = $('#messageArray');
    messageArrayText.text('');
});

function background() {
    back = true;
}
/*$(function() {
 
 document.addEventListener("deviceready", onDeviceReady, true);
 
 //connect();
 });*/

function hide() {
    back = true;
}
function show() {
    back = false;
}

function onDeviceReady()
{
    connect();
    document.addEventListener("pause", hide, false);
    document.addEventListener("resume", show, false);

}

function connect() {
    var statusOnConnect = $('#connectionON');
    statusOnConnect.text('');

    input = $('#input');
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //connection = new WebSocket('ws://demo-project.patryktesting.c9.io');
    connection = new WebSocket('ws://192.168.2.49:8180/UniquedocChat');


    connection.onopen = function() {
        statusOnConnect.text('Connected');
    };

    connection.onerror = function(error) {
        statusOnConnect.text('Not Connected');
        // an error occurred when sending/receiving data
        alert(error);
    };

    connection.onmessage = function(message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        console.log(json);

        switch (json.type) {
            case 'SERVER_LOGIN':
                responseLogin(json);
                break;
            case 'SERVER_LOGOUT':
                responseLogout(json);
                break;
            case 'SERVER_STATUS_UPDATE':
                responseStatusUpdate(json);
                break;
            case 'SERVER_FRIENDLIST_UPDATE':
                responseFriendListUpdate();
                break;
            case 'SERVER_PRIVATE_HISTORY':
                responsePrivateHistory(json);
                break;
            case 'SERVER_PRIVATE_MESSAGE':
                responsePrivateMessage(json);
                break;

            case 'SERVER_GROUP_MESSAGE':
                responseGroupMessage(json);
                break;

            case 'SERVER_GROUP_INFO':
                responseGroupInfo(json);
                break;
            case 'SERVER_GROUP_JOIN':
                responseGroupJoin(json);
                break;
            case 'SERVER_GROUP_LEAVE':
                responseGroupLeave(json);
                break;
            case 'SERVER_GROUP_CLOSE':
                responseGroupClose(json);
                break;
        }


    };


    function addMessage(name, message) {
        //content.prepend('<br><b>' + name + '</b>' + ': ' + message);
        messageArrayText.prepend('<li class="ui-li ui-li-static ui-btn-up-c">' + name + ':' + message + '</li>');

    }

    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            //connection.send(msg);
            connection.send(JSON.stringify({type: 'message', text: msg}));
            $(this).val('');
        }
    });
}