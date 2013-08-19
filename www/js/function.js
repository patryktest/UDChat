var online = 'CHAT_STATUS_ONLINE';
var available = 'CHAT_STATUS_AVAILABLE';
var away = 'CHAT_STATUS_AWAY';
var emergency = 'CHAT_STATUS_EMERGENCY';
var invisible = 'CHAT_STATUS_INVISIBLE';
var offline = 'CHAT_STATUS_OFFLINE';
//var busy = 'CHAT_STATUS_BUSY';

var global_status = available;

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
        
        var hidden = '';
        if(user.friendList[i].newMessages<1)
            hidden = 'hidden';
        
        $('#chatListT').append('<li data-icon="false" id="friend_list_' + user.friendList[i].id + '"><a onclick="openPrivateChat(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '<p class="chat-list-friend-item"><span class="ui-li-message-count '+hidden+' ">' + user.friendList[i].newMessages + '</span><span class="ui-li-message-text">' + message + '</span></p></a><span class="user-status-icon ui-icon-'+user.friendList[i].status+' device-mobile"></span></li>');
    }
    for (var i = 0; i < user.groupList.length; i++) {
        $('#chatListT').append('<li data-icon="false" id="group_list_'+user.groupList[i].groupId+'"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }

}

function showContactList() {
    $('#contactListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        $('#contactListT').append('<li data-icon="false" id="friend_list_' + user.friendList[i].id + '"><a onclick="selectFriend(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '</a><span class="user-status-icon ui-icon-'+user.friendList[i].status+' device-mobile"></span></li>');
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
    $('#contactPage').on( "swipeleft", swipeleftHandler );
     function swipeleftHandler( event ){
        jq.mobile.changePage( "index.html#mainPage", { transition: "slide"} );
     };
    
    addPopupMenu();
});

function addPopupMenu(){
    var html =     '<ul data-role="listview" data-inset="true" style="min-width:210px;" >\n\
                        <li data-role="divider" data-theme="e">Choose status</li>\n\
                        <li data-icon="false"><a onclick="setStatus(available);" href="#" data-rel="back">available</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(away);" href="#" data-rel="back">away</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(emergency);" href="#" data-rel="back">emergency</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(invisible);" href="#" data-rel="back">invisible</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(ofline);" href="#" data-rel="back">ofline</a></li>  \n\
                    </ul>';
    $('#popupMenu').html(html);
}
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
    $('#mainPage .ui-header #statusLinkMainPage').removeClass('ui-' + statusOld);
    $('#mainPage .ui-header #statusLinkMainPage').addClass('ui-' + statusNew);
    
    $('#mainPage .ui-header #statusLinkContatct').removeClass('ui-' + statusOld);
    $('#mainPage .ui-header #statusLinkContatct').addClass('ui-' + statusNew);
    
    $('#mainPage .ui-header #statusLinkChat').removeClass('ui-' + statusOld);
    $('#mainPage .ui-header #statusLinkChat').addClass('ui-' + statusNew);
    
    

}

function updateFriendStatus(id, status) {
    var friend = getFriendById(id);
    if (friend) {
        friend.status = status;
        $('#chatListT #friend_list_' + id + ' span.user-status-icon').removeClass().addClass('user-status-icon ui-icon-'+status+' device-mobile');
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
        
    $('#contactList-selectedFriendT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        for (var j = 0; j < selectedFriend.length; j++) {
            if (user.friendList[i].id === selectedFriend[j]) {
                 $('#contactList-selectedFriendT').append('<li id="friend_list_' + user.friendList[i].id + '" class="ui-btn ui-btn-icon-right ui-li ui-li-has-icon ui-btn-up-d" data-icon="false" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="d">\n\
                 <div class="ui-btn-inner ui-li">\n\
                    <div class="ui-btn-text">\n\
                        <a class="ui-link-inherit" href="" onclick="selectFriend(' + user.friendList[i].id + ');">\n\
                            <img class="ui-li-icon ui-li-thumb" alt="status" src="./img/profil_img.png">\n\
                                ' + user.friendList[i].name + '\n\
                            </a>\n\
                            <span class="user-delet-icon"></span>\n\
                            <span class="user-status-icon ui-icon-'+user.friendList[i].status+' device-mobile"></span>\n\
                    </div>\n\
                </div>\n\
                </li>');
            }
        }
    }
}

function openPGChat(groupName){
    if(selectedFriend.length){
        if(selectedFriend.length<2)
            openPrivateChat(selectedFriend[0]);
        else
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

function updateHistoryTextUndeContact(id, message){
     $('#chatListT #friend_list_'+id+' span.ui-li-message-text').html(message);
}