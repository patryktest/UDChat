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
        if(user.friendList[i].history.length)
            var message = user.friendList[i].history[user.friendList[i].history.length-1].message;
        else
            message = 'no history';
        $('#chatListT').append('<li data-icon="'+user.friendList[i].status+'" id="friend_list_'+user.friendList[i].id+'"><a onclick="openPrivateChat(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '<p class="chat-list-friend-item"><span class="ui-li-message-count">' + user.friendList[i].newMessages + '</span><span class="ui-li-message-text">'+message+'</span></p></a></li>');
    }
    for (var i = 0; i < user.groupList.length; i++) {
        $('#chatListT').append('<li data-icon="false"><a onclick="onOpenGroupChatWindow('+user.groupList[i].groupId+')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
    
}

function showContactList(){
    $('#contactListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        $('#contactListT').append('<li data-icon="'+user.friendList[i].status+'" id="friend_list_'+user.friendList[i].id+'"><a onclick="selectFriend(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '</a></li>');
    }
    for (var i = 0; i < user.groupList.length; i++) {
        $('#contactListT').append('<li data-icon="false"><a onclick="onOpenGroupChatWindow('+user.groupList[i].groupId+')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
}

function ShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li data-icon="false"><a onclick="onOpenGroupChatWindow('+user.groupList[i].groupId+')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
    $('#groupListT').append('<li data-icon="false"><a onclick="onOpenPageCreatingGroupChat();" href=""><h2>+++</h2></a></li>');
}



$(function() {

    if(user)window.location = '#loginPage';

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
            sendGroupMessage(getActiveGroupChat(),msg);
        }
        ;
    });
});

function setUserStatus(stat){
    user.status = stat;
}

function uploadSetupGroupContent(){
    $('#friendListGroupT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        if(isUserInGroup(user.friendList[i].id,getActiveGroupChat())===false){
            $('#friendListGroupT').append('<li data-icon="false"><a onclick="addUserToGroup(' + user.friendList[i].id + ','+getActiveGroupChat()+');" href="">\n\
            <img src="./img/' + user.friendList[i].status + '.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '</a></li>');
        }
        
    }
}

function loadGroupChat(id) {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    $('.block-input-send').css({width:($(document).width()-$('.block-button-send').width()-50)+'px'});
    $('#groupChatHistory').html('');
    var time = '', mess = '', name = '',date='';
    var lastSender = '';
    var lastSendTime = '';
    var group = getGroupById(id);
    
    if(group!== null){
        
        var history = group.history;
        var lastSender = '';
        var lastSendTime = '';
        for (var i = 0; i < history.length; i++) {
            if(history[i].senderId===user.id)
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
                htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time +'/'+ date +'</strong></p>';
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
    if(group!==null){
        var history = group.history;
        var time = '', mess = '', name = '',date='';
        
        var lastMessage = history[history.length - 1];
        var lastestMessage = history[history.length - 2];

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
            htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time +'/ '+ date+ '</strong></p>';
            htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
            htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';

            htmlString += '</li>';
            $('#groupChatHistory').append(htmlString);
        }
        else {
            htmlString = '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
            $('#groupChatHistory li').last().append(htmlString);
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 100);
    }
}

function updateStatusIcon(statusNew, statusOld){
    console.log('change status icon');
    $('#mainPage .ui-header #statusLink span.ui-icon').removeClass('ui-icon-'+statusOld);
    $('#mainPage .ui-header #statusLink span.ui-icon').addClass('ui-icon-'+statusNew);
    
}

function updateFriendStatus(id,status){
    var friend = getFriendById(id);
    if(friend){
        friend.status = status;
        $('#friendListT #friend_list_'+id+' img.ui-li-icon').attr('src','./img/'+status+'.png');
    }
    else
        console.log('friend status: user not exist');
    
}

function selectFriend(id){
    if(isSelectedFriend(id)){
        removeFromSelectedFriend(id);
        $('#contactListT #friend_list_'+id).removeClass('ui-selectedFriend');
    }
    else{
        addToSelectedFriend(id);
        $('#contactListT #friend_list_'+id).addClass('ui-selectedFriend');
    }
    updateSelectedFriendView();
        
}

function updateSelectedFriendView(){
    $('#contactList-selectedFriendT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
     $('#contactList-selectedFriendT').append('<li data-icon="'+user.friendList[i].status+'" id="friend_list_'+user.friendList[i].id+' class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-icon ui-first-child ui-btn-up-c"" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="c">\n\
        \n\<div class="ui-btn-inner ui-li"><div class="ui-btn-text">\n\
        <a onclick="selectFriend(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '</a></div></div></li>');
    }
}