function responseLogin(json) {
        
    user = new User(json.user.id, json.user.name, user_status.online, json.friendList, json.groupList, json.lastConversation);
    
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
    user.removeGroup(json.data.groupId);
    onCloseGroupChatWindow();

}
function responseGroupInfo(json) {
    console.log('responseGroupInfo: OK');
    var group = user.getGroupById(json.data.groupId);
    var nameChanged = false;
    if (group) {
        nameChanged = group.update(json.data.groupId, json.data.groupLeader, json.data.groupName, json.data.groupStream,json.data.groupStreamStatus,json.data.history,json.data.limit,json.data.ongoingVideo,json.data.users);
        console.info(group);
        if(mannage_group_name && nameChanged){
            onOpenGroupChatWindow(getActiveGroupChat());
            mannage_group_name = false;
        }    
    }
    else {
        var group = new Group(json.data.groupId, json.data.groupLeader, json.data.groupName, json.data.groupStream,json.data.groupStreamStatus,json.data.history,json.data.limit,json.data.ongoingVideo,json.data.users);
        user.groupList.push(group);
        if (group.isgroupLeader()) {
            setActiveGroupChat(json.data.groupId);
            onAfterGroupCreate();
        }
        else{
            onAddToFriendGroup();
            renderContactList();
            updateRecentConversations(group);
        }
            
        
    }
    


}

/*
 * response after adding user to group
 */
function responseGroupJoin(json) {
    console.log('responseGroupJoin: OK');
    var group = user.getGroupById(json.data.groupId);
    if(group!==null)
        group.addSelectedFriend(json.data.user);
    console.log(user);
}

function responseGroupLeave(json) {
    console.log('responseGroupLeave: OK');
    var group = user.getGroupById(json.data.groupId);
    
    if (group.removeUser(json.data.id)){
        console.log('user with id:' + json.data.id + ' leaved group');
    }
    else
        console.log('ERROR in leave group');
    console.log(user);
}
function responseGroupMessage(json) {
    console.log('responseGroupMessage: OK');
    var group = user.getGroupById(json.data.groupId);
    if (group) {
        group.history.push(json.data);
        if (group.groupId === getActiveGroupChat()) {
            if (json.data.senderId === user.id) {
                $('#inputGroupMessage').val('');
            }
                addMessageToActiveGroupChat(group);
        }
        else {
            group.newMessages++;
            addRecentNotification('group',json.data);
        }
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
    friend.addToHistory(json.data);    
    if (json.data.senderId === getActiveConverastion()) {
        updatePrivateChatWindow(getActiveConverastion());
        confirmPrivateMessage(json.data.senderId,json.data.receiverId,json.data.timeId,private_message_status.read);
        friend.updateMessageStatus(user.id,json.data.timeId,private_message_status.read);
    }
    else {
        confirmPrivateMessage(json.data.senderId,json.data.receiverId,json.data.timeId,private_message_status.delivered);
        friend.updateMessageStatus(user.id,json.data.timeId,private_message_status.delivered);
        friend.newMessages++;
        addRecentNotification('friend',json.data);
    }

}
function responsePrivateMessageSent(json) {
    console.log('responsePrivateMessageSent: OK');
    var friend = user.getFriendById(json.data.receiverId);
    friend.addToHistory(json.data);
    $('#inputPrivateMessage').val('');
    updatePrivateChatWindow(getActiveConverastion());
}

function responsePrivateMessageDelivered(json){
    var friend = user.getFriendById(json.data.senderId);
    friend.updateMessageStatus(user.id,json.data.timeId,json.type);
}

function responsePrivateMessageRead(json){
    var friend = user.getFriendById(json.data.senderId);
    friend.updateMessageStatus(user.id,json.data.timeId,json.type);
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