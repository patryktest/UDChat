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
    onCloseGroupChatWindow();
}
function responseGroupInfo(json) {
    console.log('responseGroupInfo: OK');
    user.groupList.push(json.data);
    setActiveGroupChat(json.data.groupId);
    onSetupGroup();
}

/*
 * respon after adding user to group
 */
function responseGroupJoin(json) {
    console.log('responseGroupJoin: OK');
    for(var i=0;i<user.groupList.length;i++){
        if(user.groupList[i].groupId === json.data.groupId)
            user.groupList[i].users.push(json.data.user);
    }
    console.log(user);
    uploadSetupGroupContent();
    
}
function responseGroupLeave(json) {
    console.log('responseGroupLeave: OK');
    for(var i=0;i<user.groupList.length;i++){
        if(user.groupList[i].groupId === json.data.groupId){
            for(var j=0;j<user.groupList[i].users.length;j++){
                if(user.groupList[i].users[j].id===json.data.id)
                    user.groupList[i].users.splice(j,1);
            }
        }
    }
    console.log(user);
}
function responseGroupMessage(json) {
    console.log('responseGroupMessage: OK');
    for(var i=0;i<user.groupList.length;i++){
        if(user.groupList[i].groupId === json.data.groupId){
            user.groupList[i].history.push(json.data);
        }
    }
    $('#groupInputPrivateMessage').val('');
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

function responsePrivateMessage(json) {
    console.log('responsePrivateMessage: OK');
    if (user.id === json.data.receiverId) {
        for (var i = 0; i < user.friendList.length; i++) {
            if (user.friendList[i].id === json.data.senderId){
                user.friendList[i].history.push(json.data);
            }  
        }
    }
    if (user.id === json.data.senderId) {
        for (var i = 0; i < user.friendList.length; i++) {
            if (user.friendList[i].id === json.data.receiverId)
                user.friendList[i].history.push(json.data);
        }
        $('#inputPrivateMessage').val('');
    }
    if(json.data.senderId === getActiveConverastion() || json.data.receiverId === getActiveConverastion())
        showMessageInActivePrivateConversation(getActiveConverastion());
    else{
        // TODO: zobraz upozornenie o neprecitanej sprave
        addNotificationToPrivateChat(json.data);
    }

}

function responseStatusUpdate(json) {
    if (json.result === 0){
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