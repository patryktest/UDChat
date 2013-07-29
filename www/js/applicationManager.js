/*
 * After login response open main chat page with friend list and group list
 */
function onUserLogin() {
    $('#usernameT').text(user.name);
    window.location = '#mainPage';
    ShowUserFriendList();
    ShowUserGroupList();
}

function onLogout(){
    user = {};
    window.location = '#loginPage';
}

function onGoToMainPage(){
    
    window.location = '#mainPage';
}

function onOpenPrivateChatWindow(id){
    loadPrivateChat(id);
    //updateRightMenu();
    //updateRightMenu();
    window.location = '#chatPageTemplate';
}

function onClosePrivateChatWindow(){
    closePrivateChatWindow();
    window.location = '#mainPage';
    
}