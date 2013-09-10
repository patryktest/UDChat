function responseLogin(json) {
        
    user = new User(json.user.id, json.user.name, user_status.online, json.friendList, json.groupList, json.lastConversation);
    
    var groupList = new Array();
    groupList = json.groupList;
    for(var i=0;i<groupList.length;i++){
        checkUpdateGroupName(groupList[i].groupId);
    }
    console.log("responseLogin OK ");
    console.log(user);
    if (user !== null) {
        onUserLogin();
    }
    else {
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
    for (var i = 0; i < user.groupList.length; i++) {
        if (user.groupList[i].groupId === json.data.groupId)
            user.groupList.splice(i, 1);
    }
    removeGroupFromContactList(json.data.groupId);
    removeGroupFromMainList(json.data.groupId);
    onCloseGroupChatWindow();

}
function responseGroupInfo(json) {
    console.log('responseGroupInfo: OK');
    group = getGroupById(json.data.groupId);
    if (group) {
        for (var i = 0; i < user.groupList.length; i++) {
            if (user.groupList[i].groupId === json.data.groupId)
                user.groupList[i]= json.data;
        }
        
        
        console.info(group);
        checkUpdateGroupName(json.data.groupId);
    }
    else {
        user.groupList.push(json.data);
        if (groupLeader(json.data.groupId)) {
            setActiveGroupChat(json.data.groupId);
            onGroupCreate();
        }
        else
            onAddToFriendGroup();
            
        checkUpdateGroupName(json.data.groupId);
        renderContactList($('#contactListT'));
        updateRecentConversations(json.data);
    }
    


}

/*
 * response after adding user to group
 */
function responseGroupJoin(json) {
    console.log('responseGroupJoin: OK');
    for (var i = 0; i < user.groupList.length; i++) {
        if (user.groupList[i].groupId === json.data.groupId){
            user.groupList[i].users.push(json.data.user);
            checkUpdateGroupName(json.data.groupId);
        }
            
        
    }
    console.log(user);
}

function responseGroupLeave(json) {
    console.log('responseGroupLeave: OK');
    if (removeUserFromGroup(json.data.id, json.data.groupId)){
        console.log('user with id:' + json.data.id + ' leaved group');
        checkUpdateGroupName(json.data.groupId);
    }
    else
        console.log('ERROR in leave group');
    console.log(user);
}
function responseGroupMessage(json) {
    console.log('responseGroupMessage: OK');
    group = getGroupById(json.data.groupId);
    if (group) {
        group.history.push(json.data);
    }
    if (json.data.groupId === getActiveGroupChat()) {
        if (json.data.senderId === user.id) {
            $('#inputGroupMessage').val('');
        }
        addMessageToActiveGroupChat(getActiveGroupChat());
    }
    else {
        //addRecentNotification(json.data);
        // TODO: zobraz upozornenie o neprecitanej sprave
    }


}

/*
 * after open new private conversation
 */
function responsePrivateHistory(json) {
    console.log('responsePrivateHistory: OK');
    var friend = user.getFriendById(getActiveConverastion());
    friend.updateHistory(json.history);
    addNewConversation(getActiveConverastion());
    onOpenPrivateChatWindow(getActiveConverastion());
}

function responsePrivateMessageNew(json) {
    console.log('responsePrivateMessageNew: OK');    
    var friend = user.getFriendById(json.data.senderId);
    friend.addToHistory(jason.data);
    confirmPrivateMessage(json.data.senderId,json.data.receiverId,json.data.timeId,private_message_status.delivered);
    if (json.data.senderId === getActiveConverastion()) {
        updatePrivateChatWindow(getActiveConverastion());
        //updateRecentContactMessage(json.data.senderId, json.data.message);
        confirmPrivateMessage(json.data.senderId,json.data.receiverId,json.data.timeId,private_message_status.read);
    }
    else {
        // TODO: zobraz upozornenie o neprecitanej sprave
        addRecentNotification(json.data);
    }

}
function responsePrivateMessageSent(json) {
    console.log('responsePrivateMessageSent: OK');
    var friend = user.getFriendById(json.data.receiverId);
    friend.addToHistory(json.data);
    $('#inputPrivateMessage').val('');
    updatePrivateChatWindow(getActiveConverastion());
    //updateRecentContactMessage(json.data.receiverId, json.data.message);
}

function responsePrivateMessageDelivered(json){
    
}

function responsePrivateMessageRead(json){
    
}

function responseStatusUpdate(json) {
    if (json.result === "OK") {
        console.log('responseStatusUpdate OK');
        user.setUserStatus(global_status);
    }
    else if (json.userId) {
        var change_status = false;
        for(var status in user_status){
            if(json.chatStatus === user_status[status])
                change_status = true;
        }
        if(change_status){ 
            var friend = user.getFriendById(json.userId);
            friend.updateStatus(json.chatStatus);
            viewUpdateFriendStatus(friend);
        }
    }
    else
        console.log('responseStatusUpdate ERR result: ' + json.result);


}

function responseSetconversationMode(json) {

}