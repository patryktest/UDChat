var away = 'CHAT_STATUS_AWAY';
var dnd = 'CHAT_STATUS_DND';
var busy = 'CHAT_STATUS_BUSY';
var available = 'CHAT_STATUS_AVAILABLE';
var ofline = 'CHAT_STATUS_OFFLINE';

var global_status = '';

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
        history: '',
        incognito: false
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
function getFriendName(id) {
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === id)
            return user.friendList[i].name;
    }
    return null;
}

function ShowUserFriendList() {
    $('#friendListT').text('');
    for (var i = 0; i < user.friendList.length; i++) {
        $('#friendListT').append('<li data-icon="false"><a onclick="openPrivateChat(' + user.friendList[i].id + ');" href="">\n\
        <img src="./img/' + user.friendList[i].status + '.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '<span class="ui-li-count">' + user.friendList[i].newMessages + '</span></a></li>');
    }
}

function ShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li data-icon="false"><a href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader + '</a></li>');
    }
    $('#groupListT').append('<li data-icon="false"><a onclick="openGroupChat(\'test G1\');" href=""><h2>+++</h2></a></li>');
}

function loadPrivateChat(id) {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    $('.block-input-send').css({width:($(document).width()-$('.block-button-send').width()-50)+'px'});
    var friend = getFriendById(id);
    var time = '', mess = '', name = '';
    var lastSender = '';
    var lastSendTime = '';

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
            if (lastSender !== name || lastSendTime !== time) {
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
                htmlString = '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
                $('#chatHistory li').last().append(htmlString);
            }
            lastSender = name;
            lastSendTime = time;


        }

    }
}

function closePrivateChatWindow(){
    closeConverastion(getActiveConverastion());
    
}

function addMessageToActiveConversation(id) {
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

        if (lastestMessage.senderId !== lastMessage.senderId) {
            htmlString = '<li class="ui-li ui-li-static ui-btn-up-c">';
            htmlString += '<p class="ui-li-aside ui-li-desc"><strong>' + time + '</strong></p>';
            htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
            htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';

            htmlString += '</li>';
            $('#chatHistory').append(htmlString);
        }
        else {
            htmlString = '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
            $('#chatHistory li').last().append(htmlString);
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 100);
    }
}

function addNewConversation(id) {
    openConversation.push(id);
}

function closeConverastion(id) {
    for (var i = 0; i < openConversation.length; i++) {
        if (openConversation[i] === id)
            openConversation.splice(i, 1);
    }
}

function findConverasation(id) {
    for (var i = 0; i < openConversation.length; i++) {
        if (openConversation[i] === id)
            return true;
    }
    return false;
}

function setActiveConverastion(id) {
    actualOpeningChat = id;
}

function getActiveConverastion() {
    return actualOpeningChat;
}

function updateRightMenu() {
    var htmlString = '<li data-icon="delete" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-d">\n\
                        <div class="ui-btn-inner ui-li">\n\
                            <div class="ui-btn-text">\n\
                                <a data-rel="close" href="#" class="ui-link-inherit"></a>\n\
                            </div>\n\
                            <span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span>\n\
                        </div>\n\
                    </li>\n\
                    <li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">\n\
                        <div class="ui-btn-inner ui-li">\n\
                            <div class="ui-btn-text">\n\
                                <a onclick="closePrivateChat('+getActiveConverastion()+');" href="#" class="ui-link-inherit">Close this conversation</a>\n\
                            </div>\n\
                        </div>\n\
                    </li>';

    for (var i = 0; i < openConversation.length; i++) {
        if (openConversation[i] !== getActiveConverastion())
            htmlString += '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">\n\
                        <div class="ui-btn-inner ui-li">\n\
                            <div class="ui-btn-text">\n\
                                <a href="#" class="ui-link-inherit">swtich to ' + getFriendName(openConversation[i]) + '</a>\n\
                            </div>\n\
                        </div>\n\
                      </li>';

    }
    $('#right-panel ul').html(htmlString);
}

$(function() {

    

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
});

function setUserStatus(stat){
    user.status = stat;
}