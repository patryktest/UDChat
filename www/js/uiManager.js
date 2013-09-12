function onConnectionOpen(){
    var statusOnConnect = $('#connectionON');
    statusOnConnect.text('Connected');
    console.log('connected to ws');
    $('#loginButton').button('enable');
    $('#loginButton').button( "refresh" );
}

function onConnectionError(){
    var statusOnConnect = $('#connectionON');
    statusOnConnect.text('Not Connected');
    console.log(error);
   // alert(error);
   $('#loginButton').button('disable');
   $('#loginButton').button( "refresh" );
    
}
/*
 * After login response open main chat page with friend list and group list
 */
function onUserLogin() {
    $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
    renderRecentConversations();
}

function onLogout(){
    user = {};
    window.location = '#loginPage';
}

function onGoToMainPage(){
    setActiveConverastion('');
    setActiveGroupChat('');
    $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
    renderRecentConversations();
}

function onOpenPrivateChatWindow(id){
    renderPrivateChatWindow(id);
    $.mobile.changePage( "index.html#chatPageTemplate", { transition: "slide"} );
    
    //renderRecentConversations();
    var friend = user.getFriendById(id);
    if(friend){
        var history = friend.history;
        var historyL = history.length-1;
        var countMessage = friend.newMessages;
        if(countMessage>0){
            confirmPrivateMessage(history[historyL].senderId,history[historyL].receiverId,history[historyL].timeId,private_message_status.read);
            friend.updateMessageStatus(user.id,history[historyL].timeId,private_message_status.read);
            friend.newMessages = 0;
            friend.recent = true;
            clearRecentNotification('friend',friend);
        }
        
    }
    
}

function onClosePrivateChatWindow(){
    closePrivateChatWindow();
    setActiveConverastion('');
    window.location = '#mainPage';
    
}

function onOpenPageCreatingGroupChat(){
    window.location = '#createGroupPage';
}

function onOpenGroupChatWindow(id){
    $.mobile.changePage( "index.html#groupChatPageTemplate", { transition: "slide"} );
    setActiveGroupChat(id);
    renderGroupChatWindow(id);
    var group = user.getGroupById(id);
    if(group){
        group.newMessages = 0;
        clearRecentNotification('group',group);
    }
    
}
function onCloseGroupChatWindow(){
    $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
    setActiveGroupChat('');
    renderContactList(); 
}

function onOpenContactList(){
    
    $.mobile.changePage( "index.html#contactPage", { transition: "slide"} );
    
    updateSelectedFriendView();
    if($('#contactListT').html()==="")
        renderContactList();
    else
        updateContactListView();
}
function onManageGroupMembers(group){
    userlength = group.users.length;
    $.mobile.changePage( "index.html#contactPage", { transition: "slide"} );
    if($('#contactListT').html()==="")
        renderContactList();
    for(var i=0;i<userlength;i++){
        addToSelectedFriend(group.users[i].id);
        updateContactListSelectFriend(group.users[i].id, 'add');
    }
    
    
    
    updateSelectedFriendView();
    
}

function onOpenGroupMenu(groupId){
    var group = user.getGroupById(groupId);
    $.mobile.changePage( "index.html#groupMenuPageTemplate", { transition: "slide"} );
    renderGroupMenu(group);
    
}

function onGroupPopupMenu(command){
    var group = user.getGroupById(getActiveGroupChat());
    var closefunction = 'commandCloseGroupChat('+getActiveGroupChat()+')';
    var leavefunction = 'commandLeaveConversation('+getActiveGroupChat()+')';
    var setNamefunction = 'commandSetGroupName('+getActiveGroupChat()+',$(\'#inputGroupName\').val())';
    
    
    switch(command){
        case 'manage': mannage_group_conntact = true; onManageGroupMembers(group); break;
        case 'rename': mannage_group_name = true; renderPopupGroupMenu('<input type="text" id="inputGroupName" placeholder="'+group.groupName+'"/>','back','rename',setNamefunction);$('#popupGroupMenu').popup('open'); break;
        case 'leave':  renderPopupGroupMenu('Are you sure you want to leave group?','no','yes',leavefunction);$('#popupGroupMenu').popup('open');break;
        case 'close':  renderPopupGroupMenu('Are you sure you want to close group?','no','yes',closefunction);$('#popupGroupMenu').popup('open');break;
    }
    
}

function onOpenPrivateGroupChat() {
    if (selectedFriend.length) {
        if (selectedFriend.length < 2){
            commandOpenPrivateChat(selectedFriend[0]);
        }
        else
            commandOpenGroupChat(user.name);
    }
}

function onAfterGroupCreate() {
    for (var i = 0; i < selectedFriend.length; i++)
        commandAddUserToGroup(selectedFriend[i], getActiveGroupChat());
    onOpenGroupChatWindow(getActiveGroupChat());
    clearSelectedFriend();
}

function onAddToFriendGroup() {
   // console.log('friend create group');
}

function onOkManageGroupMembers(){
    var group = user.getGroupById(getActiveGroupChat());
    for (var i = 0; i < group.users.length; i++){
        if(!isGroupUserInSelectFriend(group.users[i]))
            commandLeaveConversation(group.groupId,group.users[i].id);
    }
    
    for (var i = 0; i < selectedFriend.length; i++){
        if(!group.hasUser(selectedFriend[i])){
            commandAddUserToGroup(selectedFriend[i], getActiveGroupChat());
        }
    }
        
    onOpenGroupChatWindow(getActiveGroupChat());
    clearSelectedFriend();
    mannage_group_conntact = false;
    
}

function onCancelManageGroupMembers(){
    mannage_group_conntact = false;
    clearSelectedFriend();
    onOpenGroupChatWindow(getActiveGroupChat());
}