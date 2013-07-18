function onUserLogin() {
    $('#usernameT').text(user.name);
    window.location = '#mainPage';
    onShowUserFriendList();
    onShowUserGroupList();
}

function onShowUserFriendList() {
    $('#friendListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        $('#friendListT').append('<li class="ui-li ui-li-static ui-btn-up-c"><a href="">' + user.friendList[i].name + '<span class="ui-li-count">'+user.friendList[i].newMessages+'</span></a></li>');
    }
}

function onShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li class="ui-li ui-li-static ui-btn-up-c"><a href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: '+user.groupList[i].groupLeader+'</a></li>');
    }
}

function onLogout(){
    user = {};
    window.location = '#loginPage';
}