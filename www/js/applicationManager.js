/*
 * After login response open main chat page with friend list and group list
 */
function onUserLogin() {
    $('#usernameT').text(user.name);
    window.location = '#mainPage';
    ShowChatList();
   // ShowUserGroupList();
}

function onLogout(){
    user = {};
    window.location = '#loginPage';
}

function onGoToMainPage(){
    setActiveConverastion('');
    window.location = '#mainPage';
}

function onOpenPrivateChatWindow(id){
    loadPrivateChat(id);
    clearNotificationToPrivateChat(id);
    //updateRightMenu();
    window.location = '#chatPageTemplate';
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
    setActiveGroupChat(id);
    loadGroupChat(id);
    window.location = '#groupChatPageTemplate';
}
function onCloseGroupChatWindow(){
    //ShowUserGroupList();
    window.location = '#mainPage';
}

function onOpenContactList(){
    window.location = '#contactPage';
    updateSelectedFriendView();
    if($('#contactListT').html()==="")
        showContactList();
    else
        updateContactListView();
}