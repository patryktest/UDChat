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
    window.location = '#mainPage';
    
}

function onOpenPageCreatingGroupChat(){
    window.location = '#createGroupPage';
}
function onSetupGroup(){
    uploadSetupGroupContent();
    window.location = '#addUserGroupPage';
}

function onOpenGroupChatWindow(id){
    setActiveGroupChat(id);
    loadGroupChat(id);
    //updateRightMenu();
    //updateRightMenu();
    window.location = '#groupChatPageTemplate';
}
function onCloseGroupChatWindow(){
    //ShowUserGroupList();
    window.location = '#mainPage';
}

function onOpenContactList(){
    window.location = '#contactPage';
    showContactList();
}