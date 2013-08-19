function responseLogin(json) {
    friendList = new Array();
    for (var i = 0; i < json.friendList.length; i++) {
        friendList.push(createFriend(json.friendList[i].id, json.friendList[i].name, json.friendList[i].newMessages, json.friendList[i].status));
    }
    groupList = new Array();
    groupList = json.groupList;
    
    user = {
        id: json.user.id,
        name: json.user.name,
        friendList: friendList,
        groupList: groupList,
        status: available
    };
    console.log("responseLogin OK ");
    console.log(user);
    if(user!== null){
            onUserLogin();
        }
    else{
        console.log('ERR: user is null after LOGIN');
    }   
}

function responseLogout(json) {
    console.log('responseLogout: OK');
}

function responseFriendListUpdate() {

}
function responseGroupClose(json) {
    console.log('responseGroupClose: OK');
    for(var i=0;i<user.groupList.length;i++){
        if(user.groupList[i].groupId === json.data.groupId)
            user.groupList.splice(i,1);
    }
    removeGroupFromContactList(json.data.groupId);
    removeGroupFromMainList(json.data.groupId);
    onCloseGroupChatWindow();
    
}
function responseGroupInfo(json) {
    console.log('responseGroupInfo: OK');
    group = getGroupById(json.data.groupId);
    if(group){
        group=json.data;
    }
    else{
        user.groupList.push(json.data);
        if(groupLeader(json.data.groupId)){
            setActiveGroupChat(json.data.groupId);
            onGroupCreate();
        }
        else onAddToFriendGroup();
        
        addGroupToContactList(json.data);
        addGroupToMainList(json.data);
    }
    
    
}

/*
 * response after adding user to group
 */
function responseGroupJoin(json) {
    console.log('responseGroupJoin: OK');
    for(var i=0;i<user.groupList.length;i++){
        if(user.groupList[i].groupId === json.data.groupId)
            user.groupList[i].users.push(json.data.user);
    }
    console.log(user);    
}

function responseGroupLeave(json) {
    console.log('responseGroupLeave: OK');
    if(removeUserFromGroup(json.data.id, json.data.groupId))
        console.log('user with id:'+json.data.id+' leaved group');
    else
        console.log('ERROR in leave group');
    console.log(user);
}
function responseGroupMessage(json) {
    console.log('responseGroupMessage: OK');
    group = getGroupById(json.data.groupId);
    if(group){
        group.history.push(json.data);
    }
    if(json.data.groupId===getActiveGroupChat())
        addMessageToActiveGroupChat(getActiveGroupChat());
    else{
        // TODO: zobraz upozornenie o neprecitanej sprave
    }
    
    
}

/*
 * after open new private conversation
 */
function responsePrivateHistory(json) {
    console.log('responsePrivateHistory: OK');
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === getActiveConverastion())
            user.friendList[i].history = json.history;
    }
    console.log(user.friendList);
    addNewConversation(getActiveConverastion());
    onOpenPrivateChatWindow(getActiveConverastion());
}

/*function responsePrivateMessage(json) {
    console.log('responsePrivateMessage: OK');
    if (user.id === json.data.receiverId) {
        for (var i = 0; i < user.friendList.length; i++) {
            if (user.friendList[i].id === json.data.senderId){
                user.friendList[i].history.push(json.data);
                updateHistoryTextUndeContact(json.data.senderId,json.data.message);
            }  
        }
    }
    if (user.id === json.data.senderId) {
        for (var i = 0; i < user.friendList.length; i++) {
            if (user.friendList[i].id === json.data.receiverId)
                user.friendList[i].history.push(json.data);
                updateHistoryTextUndeContact(json.data.receiverId,json.data.message);
        }
        $('#inputPrivateMessage').val('');
    }
    
    if(json.data.senderId === getActiveConverastion() || json.data.receiverId === getActiveConverastion())
        showMessageInActivePrivateConversation(getActiveConverastion());
    else{
        // TODO: zobraz upozornenie o neprecitanej sprave
        addNotificationToPrivateChat(json.data);
    }

}*/

function responsePrivateMessageNew(json){
    console.log('responsePrivateMessageNew: OK');
    friend = getFriendById(json.data.senderId);
    friend.history.push(json.data);
    updateHistoryTextUndeContact(json.data.senderId,json.data.message);
    if(json.data.senderId === getActiveConverastion())
        showMessageInActivePrivateConversation(getActiveConverastion());
    else{
        // TODO: zobraz upozornenie o neprecitanej sprave
        addNotificationToPrivateChat(json.data);
    }
}
function responsePrivateMessageSent(json){
    console.log('responsePrivateMessageSent: OK');
    friend = getFriendById(json.data.receiverId);
    friend.history.push(json.data);
    updateHistoryTextUndeContact(json.data.receiverId,json.data.message);
    $('#inputPrivateMessage').val('');
    showMessageInActivePrivateConversation(getActiveConverastion());
}

function responseStatusUpdate(json) {
    if (json.result === "OK"){
        console.log('responseStatusUpdate OK');
        setUserStatus(global_status);
    }
    else if(json.userId){
        updateFriendStatus(json.userId,json.chatStatus);
    }
    else
        console.log('responseStatusUpdate ERR result: ' + json.result);


}

function responseSetconversationMode(json){
    
}