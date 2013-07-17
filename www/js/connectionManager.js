$(function() {
    connect();
    background();
    messageArrayText = $('#messageArray');
    messageArrayText.text('');
});
var back = false;
var connection;

var user = {};
var friendList = {};
var groupList = {};
var actualOpeningChat="";
var messageArrayText;


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
function login(name) {
    //if (name !== "") {
    //window.location = '#second';

    //}

    var params = ['conan@cd.ef', '123'];
    sendCommand('user.loginWS', params);

}

function logout() {
    console.log('logout user: ' + user.id);
    sendCommand('user.logout', [user.id]);

}

function setStatus(status){
    console.log('set status: '+status);
    sendCommand('user.updateStatus',[user.id,status]);
}

function openPrivateChat(friendId){
    console.log('open private chat: '+user.id+' with '+friendId);
    sendCommand('chat.openPrivateConversation',[user.id,friendId]);
    sendCommand('chat.getPrivateHistory',[user.id,friendId]);
    actualOpeningChat = "";
    actualOpeningChat = friendId;
    
}

function closePrivateChat(friendId){
    console.log('close private chat: '+user.id+' with '+friendId);
    sendCommand('chat.closePrivateConversation',[user.id,friendId]);
}

function sendPrivateMessage(friendId,message){
    console.log('send private message to '+friendId+' with text '+message);
    sendCommand('chat.sendPrivateMessage',[user.id,friendId,message]);
}

function sendCommand(command, params) {

    connection.send(JSON.stringify({command: command, parameters: params}));
    // parameters
    /* connection.send(JSON.stringify({command: 'user.loginWS', parameters: param}));        [user,login]       status>0 login F,
     connection.send(JSON.stringify({command: 'user.logout', parameters: param}));           [id]
     
     connection.send(JSON.stringify({command: 'user.requestFriendList', parameters: param}));
     connection.send(JSON.stringify({command: 'chat.requestGroupList', parameters: param}));
     
     connection.send(JSON.stringify({command: 'user.updateStatus', parameters: param}));    [id,chat_status_string]  CHAT_STATUS_AWAY,CHAT_STATUS_DND,CHAT_STATUS_BUSY,CHAT_STATUS_AVAILABLE
     
     connection.send(JSON.stringify({command: 'chat.openPrivateConversation', parameters: param}));     [id,idfriend]
     connection.send(JSON.stringify({command: 'chat.closePrivateConversation', parameters: param}));    [id,idfriend]
     
     connection.send(JSON.stringify({command: 'chat.getPrivateHistory', parameters: param}));           [id,idfriend]
     connection.send(JSON.stringify({command: 'chat.sendPrivateMessage', parameters: param}));          [id,idfriend,message]
     
     connection.send(JSON.stringify({command: 'chat.openGroupConversation', parameters: param}));
     connection.send(JSON.stringify({command: 'chat.closeGroupConversation', parameters: param}));
     connection.send(JSON.stringify({command: 'chat.addUserToConversation', parameters: param}));
     connection.send(JSON.stringify({command: 'chat.leaveConversation', parameters: param}));
     connection.send(JSON.stringify({command: 'chat.sendGroupMessage', parameters: param})); 
     */
}
function createFriend(id, name, newMessages, status) {
    var friend = {
        id: id,
        name: name,
        newMessages: newMessages,
        status: status,
        history: ''
    };
    return friend;
}

function createGroup() {

}



function connect() {
    var statusOnConnect = $('#connectionON');
    statusOnConnect.text('');

    input = $('#input');
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //connection = new WebSocket('ws://demo-project.patryktesting.c9.io');
    connection = new WebSocket('ws://192.168.2.51:8180/UniquedocChat');


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

        /*if (json.type === 'history')
         {
         for (var i = 0; i < json.data.length; i++)
         addMessage(json.data[i].name, json.data[i].text);
         }
         if (json.type === 'message') {
         /*if (back == true) {
         navigator.notification.vibrate(200);
         }*/
        /*addMessage(json.data.name, json.data.text);
         }*/


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
                responseGroupMessage();
                break;

            case 'SERVER_GROUP_INFO':
                responseGroupInfo();
                break;
            case 'SERVER_GROUP_JOIN':
                responseGroupJoin();
                break;
            case 'SERVER_GROUP_LEAVE':
                responseGroupLeave();
                break;
            case 'SERVER_GROUP_CLOSE':
                responseGroupClose();
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

function showConversation(){
    messageArrayText.text('');
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === actualOpeningChat){
            for(var j=0;j<user.friendList[i].history.length;j++)
                messageArrayText.prepend('<li class="ui-li ui-li-static ui-btn-up-c">' + user.friendList[i].history[j].senderId + ':' + user.friendList[i].history[j].message + '</li>');
            
        }
    }
   
}


