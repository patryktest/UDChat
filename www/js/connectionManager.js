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
    //$('#loginButton').button ("disable");
    var statusOnConnect = $('#connectionON');
    statusOnConnect.text('');

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    try{
        connection = new WebSocket(WEBSOCKETLINK);
    }
    catch (e){
        console.log(e);
    }
    


    connection.onopen = function() {
        statusOnConnect.text('Connected');
        console.log('connected to ws');
       // $('#loginButton').removeClass('ui-disabled');
       $('#loginButton').button('enable');
       $('#loginButton').button( "refresh" );
       
        
    };

    connection.onerror = function(error) {
        onLogout();
        statusOnConnect.text('Not Connected');
        // an error occurred when sending/receiving data
        console.log(error);
       // alert(error);
       $('#loginButton').button('disable');
       $('#loginButton').button( "refresh" );
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
            case 'SERVER_GROUP_MESSAGE':
                responseGroupMessage(json);
                break;
            
           case 'SERVER_PRIVATE_MESSAGE_SENT':
                responsePrivateMessageSent(json);
                break;
            case 'SERVER_PRIVATE_MESSAGE_NEW':
                responsePrivateMessageNew(json);
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
            case 'SERVER_':
                responseSetconversationMode(json);
                break; 
        }


    };
}