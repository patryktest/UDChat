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
    /*htmlString = '<div data-role="page" id="chatPage_'+id+'">';
    htmlString += $('#chatPageTemplate').html();
    htmlString += '</div>';
    $('#body').append(htmlString);*/
    
    loadPrivateChat(id);
    window.location = '#chatPageTemplate';
    
    
}