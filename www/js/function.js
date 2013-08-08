var away = 'CHAT_STATUS_AWAY';
var dnd = 'CHAT_STATUS_DND';
var busy = 'CHAT_STATUS_BUSY';
var available = 'CHAT_STATUS_AVAILABLE';
var ofline = 'CHAT_STATUS_OFFLINE';
var online = 'CHAT_STATUS_ONLINE';

var global_status = online;

/*function showConversation() {
 messageArrayText.text('');
 for (var i = 0; i < user.friendList.length; i++) {
 if (user.friendList[i].id === actualOpeningChat) {
 for (var j = 0; j < user.friendList[i].history.length; j++)
 messageArrayText.prepend('<li class="ui-li ui-li-static ui-btn-up-c">' + user.friendList[i].history[j].senderId + ':' + user.friendList[i].history[j].message + '</li>');
 
 }
 }
 
 }*/


function ShowChatList() {
    $('#chatListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].history.length)
            var message = user.friendList[i].history[user.friendList[i].history.length - 1].message;
        else
            message = 'no history';
        $('#chatListT').append('<li data-icon="false" id="friend_list_' + user.friendList[i].id + '"><a onclick="openPrivateChat(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '<p class="chat-list-friend-item"><span class="ui-li-message-count">' + user.friendList[i].newMessages + '</span><span class="ui-li-message-text">' + message + '</span></p></a><span class="user-status-icon ui-'+user.friendList[i].status+'">&#xEA01;</span></li>');
    }
    for (var i = 0; i < user.groupList.length; i++) {
        $('#chatListT').append('<li data-icon="false" id="group_list_'+user.groupList[i].groupId+'"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }

}

function showContactList() {
    $('#contactListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        $('#contactListT').append('<li data-icon="false" id="friend_list_' + user.friendList[i].id + '"><a onclick="selectFriend(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '</a><span class="user-status-icon ui-'+user.friendList[i].status+'">&#xEA01;</span></li>');
    }
    for (var i = 0; i < user.groupList.length; i++) {
        $('#contactListT').append('<li data-icon="false" id="group_list_'+user.groupList[i].groupId+'"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
}

function ShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li data-icon="false"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
    $('#groupListT').append('<li data-icon="false"><a onclick="onOpenPageCreatingGroupChat();" href=""><h2>+++</h2></a></li>');
}



$(function() {

    if (user)
        window.location = '#loginPage';

    $('#inputPrivateMessage').keydown(function(e) {
        if (e.keyCode === 13) {
            console.log(e.keyCode);
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            //connection.send(msg);
            sendPrivateMessage(msg);
        }
        ;
    });

    $('#groupInputPrivateMessage').keydown(function(e) {
        if (e.keyCode === 13) {
            console.log(e.keyCode);
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            //connection.send(msg);
            sendGroupMessage(getActiveGroupChat(), msg);
        }
        ;
    });
});

function setUserStatus(stat) {
    user.status = stat;
}


function loadGroupChat(id) {
    $("html, body").animate({scrollTop: $(document).height()}, 1000);
    $('.block-input-send').css({width: ($(document).width() - $('.block-button-send').width() - 50) + 'px'});
    $('#groupChatHistory').html('');
    var time = '', mess = '', name = '', date = '';
    var lastSender = '';
    var lastSendTime = '';
    var group = getGroupById(id);

    if (group !== null) {

        var history = group.history;
        var lastSender = '';
        var lastSendTime = '';
        for (var i = 0; i < history.length; i++) {
            if (history[i].senderId === user.id)
                name = user.name;
            else
                name = getFriendName(history[i].senderId);

            mess = history[i].message;
            time = history[i].time;
            date = history[i].date;

            if (lastSender !== name || lastSendTime !== date) {
                if (i === 0)
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-c ui-first-child">';
                if (i === history.length - 1)
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-c ui-last-child">';
                else
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-c">';
                htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time + '/' + date + '</strong></p>';
                htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
                htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
                htmlString += '</li>';
                $('#groupChatHistory').append(htmlString);
            }
            else {
                htmlString = '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
                $('#groupChatHistory li').last().append(htmlString);
            }
            lastSender = name;
            lastSendTime = date;

        }
    }
}

function addMessageToActiveGroupChat(id) {
    var group = getGroupById(id);
    if (group !== null) {
        var history = group.history;
        var time = '', mess = '', name = '', date = '';

        var lastMessage = history[history.length - 1];
        var lastestMessage = "";
        if(history.length>1)
            lastestMessage = history[history.length - 2];

        if (lastMessage.senderId === user.id) {
            name = user.name;
        }
        else {
            name = getFriendName(lastMessage.senderId);
        }
        mess = lastMessage.message;
        time = lastMessage.time;
        date = lastMessage.date;
        
        if (lastestMessage.senderId !== lastMessage.senderId) {
            htmlString = '<li class="ui-li ui-li-static ui-btn-up-c">';
            htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time + '/ ' + date + '</strong></p>';
            htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
            htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';

            htmlString += '</li>';
            $('#groupChatHistory').append(htmlString);
        }
        else {
            htmlString = '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
            $('#groupChatHistory li').last().append(htmlString);
        }
        $("html, body").animate({scrollTop: $(document).height()}, 100);
    }
}

function updateStatusIcon(statusNew, statusOld) {
    console.log('change status icon');
    $('#mainPage .ui-header #statusLink span.ui-icon').removeClass('ui-icon-' + statusOld);
    $('#mainPage .ui-header #statusLink span.ui-icon').addClass('ui-icon-' + statusNew);

}

function updateFriendStatus(id, status) {
    var friend = getFriendById(id);
    if (friend) {
        friend.status = status;
        $('#chatListT #friend_list_' + id + ' span.ui-icon').removeClass().addClass('ui-icon ui-icon-'+status+' ui-icon-shadow');
    }
    else
        console.log('friend status: user not exist');

}

function selectFriend(id) {
    if (isSelectedFriend(id)) {
        removeFromSelectedFriend(id);
        $('#contactListT #friend_list_' + id).removeClass('ui-selectedFriend');
    }
    else {
        addToSelectedFriend(id);
        $('#contactListT #friend_list_' + id).addClass('ui-selectedFriend');
    }
    updateSelectedFriendView();

}
function updateContactListView(){
    for(var i=0;i<user.friendList.length;i++)
        $('#contactListT #friend_list_' + user.friendList[i].id).removeClass('ui-selectedFriend');
}
function updateSelectedFriendView() {
    if(selectedFriend.length)
        $('#contactPageSmallMenu').css({display:'block'});
    else
        $('#contactPageSmallMenu').css({display:'none'});
    if(selectedFriend.length>1){
        $('#groupName').css({display:'block'});
        $('#smallMenu .ui-btn-text').text('start Group chat');
    }
    else{
        $('#groupName').css({display:'none'});
        $('#smallMenu .ui-btn-text').text('start chat');
    }
        
    $('#contactList-selectedFriendT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        for (var j = 0; j < selectedFriend.length; j++) {
            if (user.friendList[i].id === selectedFriend[j]) {
                $('#contactList-selectedFriendT').append('<li data-icon="' + user.friendList[i].status + '" id="friend_list_' + user.friendList[i].id + '" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-icon ui-first-child ui-btn-up-c" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="c">\n\
                \n\<div class="ui-btn-inner ui-li"><div class="ui-btn-text">\n\
                <a class="ui-link-inherit" onclick="selectFriend(' + user.friendList[i].id + ');" href="">\n\
                <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '</a></div></div></li>');
            }
        }
    }
}

function openPGChat(groupName){
    if(selectedFriend.length){
        /*if(selectedFriend.length<2)
            openPrivateChat(selectedFriend[0]);
        else*/
            openGroupChat(groupName);
            
    }
}

/*
 * add friends to group
 */
function onGroupCreate(){
    for(var i=0;i<selectedFriend.length;i++)
        addUserToGroup(selectedFriend[i],getActiveGroupChat());
    onOpenGroupChatWindow(getActiveGroupChat());
    clearSelectedFriend();
}

function removeGroupFromContactList(id){
    $('#contactListT #group_list_'+id).remove();
}

function removeGroupFromMainList(id){
    $('#chatListT #group_list_'+id).remove();
}

function addGroupToContactList(group){
    $('#contactListT').append('\n\
        <li id="group_list_'+group.groupId+'" class="ui-btn ui-btn-icon-right ui-li ui-last-child ui-btn-up-c" data-icon="false" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="c">\n\
            <div class="ui-btn-inner ui-li">\n\
                <div class="ui-btn-text">\n\
                    <a class="ui-link-inherit" href="" onclick="onOpenGroupChatWindow(' + group.groupId + ')">\n\
                        <h2 class="ui-li-heading">' + group.groupName + '</h2>\n\
                        Leader: ' + group.groupLeader.name + '\n\
                    </a>\n\
                </div>\n\
            </div>\n\
        </li>\n\
    ');
}
function addGroupToMainList(group){
    $('#chatListT').append('\n\
        <li id="group_list_'+group.groupId+'" class="ui-btn ui-btn-icon-right ui-li ui-last-child ui-btn-up-c" data-icon="false" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="c">\n\
            <div class="ui-btn-inner ui-li">\n\
                <div class="ui-btn-text">\n\
                    <a class="ui-link-inherit" href="" onclick="onOpenGroupChatWindow(' + group.groupId + ')">\n\
                        <h2 class="ui-li-heading">' + group.groupName + '</h2>\n\
                        Leader: ' + group.groupLeader.name + '\n\
                    </a>\n\
                </div>\n\
            </div>\n\
        </li>\n\
    ');
}

function onAddToFriendGroup(){
    console.log('friend create group');
}