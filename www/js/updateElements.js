
function updateRecentContactMessage(id, command, message) {
    switch (command) {
        case 'friend':
            $('#chatListT #friend_list_' + id + ' span.ui-li-message-text').html(message);
            break;
        case 'group':
            $('#chatListT #group_list_' + id + ' span.ui-li-message-text').html(message);
            break;
    }

}

function addRecentNotification(command, data) {
    switch (command) {
        case 'friend':
            var friend = user.getFriendById(data.senderId);
            if (friend !== null) {
                $('#chatListT #friend_list_' + friend.id + ' span.ui-li-message-count').removeClass('hidden');
                $('#chatListT #friend_list_' + friend.id + ' span.ui-li-message-count').html(friend.newMessages);
                updateRecentContactMessage(friend.id, command, "new message");
            }
            break;
        case 'group':
            var group = user.getGroupById(data.groupId);
            if (group !== null) {
                $('#chatListT #group_list_' + group.id + ' span.ui-li-message-count').removeClass('hidden');
                $('#chatListT #group_list_' + group.id + ' span.ui-li-message-count').html(group.newMessages);
                updateRecentContactMessage(group.id, command, "new message");
            }
            break;



    }
}

function clearRecentNotification(command, item) {
    switch (command) {
        case 'friend':
            $('#chatListT #friend_list_' + item.id + ' span.ui-li-message-count').addClass('hidden');
            $('#chatListT #friend_list_' + item.id + ' span.ui-li-message-count').html(item.newMessages);
            break;
        case 'group':
            $('#chatListT #group_list_' + item.groupId + ' span.ui-li-message-count').addClass('hidden');
            $('#chatListT #group_list_' + item.groupId + ' span.ui-li-message-count').html(item.newMessages);
            break;


    }

}

function updatePrivateChatWindow(id) {
    var friend = user.getFriendById(id);
    var time = '', mess = '', name = '',status = '';
    var userIsSender = false;
    var htmlString;

    if (friend !== null) {
        var lastMessage = friend.history[friend.history.length - 1];
        var lastestMessage = '';
        if (friend.history.length > 2)
            lastestMessage = friend.history[friend.history.length - 2];

        if (lastMessage.senderId === user.id) {
            name = user.name;
            userIsSender = true;
        }
        else {
            name = friend.name;
            userIsSender = false;
        }
        mess = lastMessage.message;
        status = lastMessage.status;
        var statusElement = lastMessage.statusElement;

        var newDate = new Date(lastMessage.timeId);
        var lastDate = new Date(lastestMessage.timeId);
        time = newDate.getUTCFullYear() + ':' + newDate.getUTCDate() + ':' + newDate.getUTCMonth() + ':' + newDate.getUTCHours() + ':' + newDate.getUTCMinutes();
        var date = newDate.getUTCDate() + '.' + newDate.getUTCMonth() + '.' + newDate.getUTCFullYear();
        var oldTime = lastDate.getUTCFullYear() + ':' + lastDate.getUTCDate() + ':' + lastDate.getUTCMonth() + ':' + lastDate.getUTCHours() + ':' + lastDate.getUTCMinutes();
        var oldDate = lastDate.getUTCDate() + '.' + lastDate.getUTCMonth() + '.' + lastDate.getUTCFullYear();
        if (oldDate === date)
            date = "";

        if (lastestMessage.senderId !== lastMessage.senderId) {
            numberMessageItemGroup++;
            $('#chatHistory').append(messageTemplate(userIsSender, mess, statusElement, (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date, numberMessageItemGroup));
        }
        else {
            if (userIsSender) {
                htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
            }
            else {
                htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
            }
            var element = $('#chatHistory li').last();
            element.append(htmlString);
            if (oldTime === time)
                element.find('.ui-li-message-time').last().remove();
            
            //htmlString += '<p class="ui-li-message-time ui-li-desc">' + (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date + ' '+status+'</p>';

            var element2 = document.createElement('p');
            element2.setAttribute('class','ui-li-message-time ui-li-desc');
            element2.innerHTML = (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date;
            element2.appendChild(statusElement);
            element.append(element2);
        }
        $("html, body").animate({scrollTop: $(document).height()}, 100);
    }
}

function addMessageToActiveGroupChat(group) {
    if (group !== null) {
        var history = group.history;
        var time = '', mess = '', name = '', date = '';
        var userIsSender = false;
        var htmlString;

        var lastMessage = history[history.length - 1];
        var lastestMessage = "";
        if (history.length > 1)
            lastestMessage = history[history.length - 2];

        if (lastMessage.senderId === user.id) {
            name = user.name;
            userIsSender = true;
        }
        else {
            name = getFriendName(lastMessage.senderId);
            userIsSender = false;
        }


        var newDate = new Date(lastMessage.timeId);
        var lastDate = new Date(lastestMessage.timeId);
        time = newDate.getUTCFullYear() + ':' + newDate.getUTCDate() + ':' + newDate.getUTCMonth() + ':' + newDate.getUTCHours() + ':' + newDate.getUTCMinutes();
        date = newDate.getUTCDate() + '.' + newDate.getUTCMonth() + '.' + newDate.getUTCFullYear();
        oldTime = lastDate.getUTCFullYear() + ':' + lastDate.getUTCDate() + ':' + lastDate.getUTCMonth() + ':' + lastDate.getUTCHours() + ':' + lastDate.getUTCMinutes();
        oldDate = lastDate.getUTCDate() + '.' + lastDate.getUTCMonth() + '.' + lastDate.getUTCFullYear();

        if (oldDate === date)
            date = "";

        if (lastestMessage.senderId !== lastMessage.senderId) {
            numberMessageItemGroup++;
            $('#groupChatHistory').append(messageTemplate(userIsSender, lastMessage.message, '', (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date, numberMessageItemGroup));
        }
        else {
            if (userIsSender) {
                htmlString = '<p class="ui-li-message-left ui-li-desc">' + lastMessage.message + '</p>';
            }
            else {
                htmlString = '<p class="ui-li-message-right ui-li-desc">' + lastMessage.message + '</p>';
            }
            var element = $('#groupChatHistory li').last();
            if (oldTime === time)
                element.find('.ui-li-message-time').last().remove();
            htmlString += '<p class="ui-li-message-time ui-li-desc">' + (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes() + ' ' + date + '</p>';


            element.append(htmlString);
        }
        $("html, body").animate({scrollTop: $(document).height()}, 100);
    }
}

/*function updateContactList(group) {
 $('#contactListT').listview();
 $('#contactListT').append('\n\
 <li id="group_list_' + group.groupId + '" data-icon="false">\n\
 <a href="" onclick="onOpenGroupChatWindow(' + group.groupId + ')"><strong>' + group.groupName + '</strong></a>\n\
 </li>\n\
 ');
 $('#contactListT').listview('refresh');
 }*/
function updateRecentConversations(group) {
    message = '';
    $('#chatListT').listview();
    $('#chatListT').append('\n\
        <li id="group_list_' + group.groupId + '" data-icon="false">\n\
            <a href="" onclick="' + group.startGroupChat + '">\n\
                <img  src="./img/profil_img.png" alt="status" class="ui-li-icon"><strong class="name">' + group.displayGroupName + '</strong>\n\
                 <p class="chat-list-group-item">\n\
                    <span class="ui-li-message-count hidden"></span>\n\
                    <span class="ui-li-message-text">' + message + '</span>\n\
                </p>\n\
            </a>\n\
        </li>\n\
    ');
    $('#chatListT').listview('refresh');
}

function updateRecentConversationGroupName(group) {
    $('#group_list_' + group.groupId + ' .name').html(group.displayGroupName);
}
function updateContactListGroupName(group) {
    $('#group_list_' + group.groupId + ' .name').html(group.displayGroupName);
}

function updtateGroupChatWindowName(group) {
    $('#groupChatPageTemplate #groupChatPageT').html(group.displayGroupName);
}

function updateContactListSelectFriend(id, command) {
    switch (command) {
        case 'add':
            $('#contactListT #friend_list_' + id).addClass('ui-selectedFriend');
            break;
        case 'remove':
            $('#contactListT #friend_list_' + id).removeClass('ui-selectedFriend');
            break;
    }


}

function updateSelectedFriendView() {
    if (mannage_group_conntact) {
        $('#contactT').html('Manage Group');
        $('.manageGroupMembers').removeClass('hidden');
        $('.btn_openPrivateGroupChat').addClass('hidden');
    } else {
        $('#contactT').html('Connections');
        $('.manageGroupMembers').addClass('hidden');
        $('.btn_openPrivateGroupChat').removeClass('hidden');
    }
        if (selectedFriend.length)
            $('#contactPageSmallMenu').css({display: 'block'});
        else
            $('#contactPageSmallMenu').css({display: 'none'});
    
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
                            <span class="user-status-icon ui-icon-' + user.friendList[i].status + ' device-mobile"></span>\n\
                    </div>\n\
                </div>\n\
                </li>');
            }
        }
    }

}

function removeGroupFromContactList(id) {
    $('#contactListT #group_list_' + id).remove();
}

function removeGroupFromMainList(id) {
    $('#chatListT #group_list_' + id).remove();
}