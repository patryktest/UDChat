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