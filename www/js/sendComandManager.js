function login(login,pass) {
    //var params = ['conan@cd.ef', '123'];
    if(login!=="" && pass!=="")
        sendCommand('user.loginWS', [login,pass]);
    else alert('Login or password missing!');
}

function logout() {
    console.log('logout user: ' + user.id);
    sendCommand('user.logout', [user.id]);
    onLogout();

}

function setStatus(status){
    console.log('set status: '+status);
    sendCommand('user.updateStatus',[user.id,status]);
}

function openPrivateChat(friendId){
    console.log('open private chat: '+user.id+' with '+friendId);
    setActiveConverastion(friendId);
    if(!findConverasation(friendId)){
        sendCommand('chat.openPrivateConversation',[user.id,friendId]);
        sendCommand('chat.getPrivateHistory',[user.id,friendId]);
    }
    else{
        onOpenPrivateChatWindow(getActiveConverastion());
    }
        
}

function closePrivateChat(friendId){
    console.log('close private chat: '+user.id+' with '+friendId);
    sendCommand('chat.closePrivateConversation',[user.id,friendId]);
    onClosePrivateChatWindow(friendId)
}

function sendPrivateMessage(message){
    if(getActiveConverastion()!==''){
        console.log('send private message to '+actualOpeningChat+' with text '+message);
        sendCommand('chat.sendPrivateMessage',[user.id,actualOpeningChat,message]);
    }
    else
        console.log('ERR send private message friend ID missing');
    
}

function openGroupChat(groupName){
    console.log('creating Group with name: '+groupName);
    sendCommand('chat.openGroupConversation',[user.id,groupName]);
}

function closeGroupChat(groupId){
    console.log('close Group with ID: '+groupId);
    sendCommand('chat.closeGroupConversation',[user.id,groupId]);
}

function addUserToGroup(friendId,groupId){
    console.log('add user : '+friendId+' to group: '+groupId);
    sendCommand('chat.addUserToConversation',[friendId,groupId]);
}

function leaveConversation(groupId){
    console.log('leave group '+groupId);
    sendCommand('chat.leaveConversation',[groupId, user.id]);
}

function sendGroupMessage(groupId,message){
    console.log('leave group '+groupId);
    sendCommand('chat.sendGroupMessage',[user.id,groupId, message]);
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
     
     connection.send(JSON.stringify({command: 'chat.openGroupConversation', parameters: param}));       [id,string nazov grupy]
     connection.send(JSON.stringify({command: 'chat.closeGroupConversation', parameters: param}));      [id, group id]
     connection.send(JSON.stringify({command: 'chat.addUserToConversation', parameters: param}));       [id of frienduser, id group]
     connection.send(JSON.stringify({command: 'chat.leaveConversation', parameters: param}));           [id grup, id my]
     connection.send(JSON.stringify({command: 'chat.sendGroupMessage', parameters: param}));            [user.id,group.id,message]
     */
}