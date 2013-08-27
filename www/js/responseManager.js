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
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === getActiveConverastion())
            user.friendList[i].history = json.history;
    }
    console.log(user.friendList);
    addNewConversation(getActiveConverastion());
    onOpenPrivateChatWindow(getActiveConverastion());
}

function responsePrivateMessageNew(json) {
    console.log('responsePrivateMessageNew: OK');
    friend = getFriendById(json.data.senderId);
    friend.history.push(json.data);
    if (json.data.senderId === getActiveConverastion()) {
        updatePrivateChatWindow(getActiveConverastion());
        updateRecentContactMessage(json.data.senderId, json.data.message);
    }
    else {
        // TODO: zobraz upozornenie o neprecitanej sprave
        addRecentNotification(json.data);
    }

}
function responsePrivateMessageSent(json) {
    console.log('responsePrivateMessageSent: OK');
    friend = getFriendById(json.data.receiverId);
    friend.history.push(json.data);
    $('#inputPrivateMessage').val('');
    updatePrivateChatWindow(getActiveConverastion());
    updateRecentContactMessage(json.data.receiverId, json.data.message);
}

function responseStatusUpdate(json) {
    if (json.result === "OK") {
        console.log('responseStatusUpdate OK');
        setUserStatus(global_status);
    }
    else if (json.userId) {
        updateFriendStatus(json.userId, json.chatStatus);
    }
    else
        console.log('responseStatusUpdate ERR result: ' + json.result);


}

function responseSetconversationMode(json) {

}