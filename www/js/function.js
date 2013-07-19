function showConversation() {
    messageArrayText.text('');
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === actualOpeningChat) {
            for (var j = 0; j < user.friendList[i].history.length; j++)
                messageArrayText.prepend('<li class="ui-li ui-li-static ui-btn-up-c">' + user.friendList[i].history[j].senderId + ':' + user.friendList[i].history[j].message + '</li>');

        }
    }

}
/*
 * Create new friend createFriend(id,name,newMessage,status)
 * return object friend
 */
function createFriend(id, name, newMessages, status) {
    var friend = {
        id: id,
        name: name,
        newMessages: newMessages,
        status: status,
        history: ''
    };
    return friend;
}

function getFriendById(id) {
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === id)
            return user.friendList[i];
    }
    return null;
}

function ShowUserFriendList() {
    $('#friendListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        $('#friendListT').append('<li data-icon="false"><a onclick="openPrivateChat(' + user.friendList[i].id + ');" href="">' + user.friendList[i].name + '<span class="ui-li-count">' + user.friendList[i].newMessages + '</span></a></li>');
    }
}

function ShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li data-icon="false"><a href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader + '</a></li>');
    }
}

function loadPrivateChat(id) {
    var friend = getFriendById(id);
    var time = '', mess = '', name = '';
    var lastSender = '';

    $('#chatHistory').html('');
    if (friend !== null) {
        for (var i = 0; i < friend.history.length; i++) {
            if (friend.history[i].senderId === user.id) {
                name = user.name;
            }
            else {
                name = friend.name;
            }

            mess = friend.history[i].message;
            time = friend.history[i].date;
            if (lastSender !== name) {
                if (i === 0)
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-c ui-first-child">';
                if (i === friend.history.length - 1)
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-c ui-last-child">';
                else
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-c">';
                htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time + '</strong></p>';
                htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
                htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
                htmlString += '</li>';
                $('#chatHistory').append(htmlString);
            }
            else {
                htmlString = '<p class="ui-li-aside ui-li-desc"><strong>' + time + '</strong></p>';
                htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
                $('#chatHistory li').last().append(htmlString);
            }
            lastSender = name;


        }

    }
}

function addMessageToPrivateChat(id) {
    var friend = getFriendById(id);
    var time = '', mess = '', name = '';

    if (friend !== null) {
        var lastMessage = friend.history[friend.history.length - 1];
        var lastestMessage = friend.history[friend.history.length - 2];

        if (lastMessage.senderId === user.id) {
            name = user.name;
        }
        else {
            name = friend.name;
        }
        mess = lastMessage.message;
        time = lastMessage.date;
        
        if (lastestMessage.senderId!== lastMessage.senderId) {
            htmlString = '<li class="ui-li ui-li-static ui-btn-up-c">';
            htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time + '</strong></p>';
            htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
            htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';

            htmlString += '</li>';
            $('#chatHistory').append(htmlString);
        }
        else {
            htmlString = '<p class="ui-li-aside ui-li-desc"><strong>' + time + '</strong></p>';
            htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
            $('#chatHistory li').last().append(htmlString);
        }
    }
}