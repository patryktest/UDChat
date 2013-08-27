/*
 * After login response open main chat page with friend list and group list
 */
function onUserLogin() {
    $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
    renderRecentConversations($('#chatListT'));
    
    /*if(isOpenConveresation()){
        $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
        renderRecentConversations($('#chatListT'));
    }
    else{
        $.mobile.changePage( "index.html#contactPage", { transition: "slide"} );
        renderContactList($('#contactListT'));
    }*/
}

function onLogout(){
    user = {};
    window.location = '#loginPage';
}

function onGoToMainPage(){
    setActiveConverastion('');
    $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
}

function onOpenPrivateChatWindow(id){
    renderPrivateChatWindow(id);
    renderRecentConversations($('#chatListT'));
    clearRecentNotification(id);
    $.mobile.changePage( "index.html#chatPageTemplate", { transition: "slide"} );
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
}
function onCloseGroupChatWindow(){
    $.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
    renderContactList($('#contactListT')); 
}

function onOpenContactList(){
    //window.location = '#contactPage';
    $.mobile.changePage( "index.html#contactPage", { transition: "slide"} );
    
    updateSelectedFriendView();
    if($('#contactListT').html()==="")
        renderContactList($('#contactListT'));
    else
        updateContactListView();
}

function onOpenGroupMenu(groupId){
    group = getGroupById(groupId);
    $.mobile.changePage( "index.html#groupMenuPageTemplate", { transition: "slide"} );
    renderGroupMenu(group);
    
}

function onGroupPopupMenu(command){
    group = getGroupById(getActiveGroupChat());
    closefunction = 'closeGroupChat('+getActiveGroupChat()+')';
    leavefunction = 'leaveConversation('+getActiveGroupChat()+')';
    setNamefunction = 'setGroupName('+getActiveGroupChat()+',$(\'#inputGroupName\').val())';
    
    
    switch(command){
        case 'manage': onOpenContactList(); break;
        case 'rename': renderPopupGroupMenu('<input type="text" id="inputGroupName" placeholder="'+group.groupName+'"/>','back','rename',setNamefunction);$('#popupGroupMenu').popup('open'); break;
        case 'leave':  renderPopupGroupMenu('Are you sure you want to leave group?','no','yes',leavefunction);$('#popupGroupMenu').popup('open');break;
        case 'close':  renderPopupGroupMenu('Are you sure you want to close group?','no','yes',closefunction);$('#popupGroupMenu').popup('open');break;
    }
    
}