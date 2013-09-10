
function updateRecentContactMessage(id, message) {
    $('#chatListT #friend_list_' + id + ' span.ui-li-message-text').html(message);
}

function addRecentNotification(data) {
    if (user.id === data.receiverId) {
        var friend = user.getFriendById(data.senderId);
        if (friend !== null) {
            friend.newMessages++;
            $('#chatListT #friend_list_' + data.senderId + ' span.ui-li-message-count').removeClass('hidden');
            $('#chatListT #friend_list_' + data.senderId + ' span.ui-li-message-count').html(friend.newMessages);
            updateRecentContactMessage(data.senderId, "new message");
        }

    }
}

function clearRecentNotification(friend) {
        $('#chatListT #friend_list_' + friend.id + ' span.ui-li-message-count').addClass('hidden');
        $('#chatListT #friend_list_' + friend.id + ' span.ui-li-message-count').html(friend.newMessages);
}

function updatePrivateChatWindow(id) {
    var friend = user.getFriendById(id);
    var time = '', mess = '', name = '';
    var userIsSender = false;
    var htmlString;
    

    if (friend !== null) {
        var lastMessage = friend.history[friend.history.length - 1];
        var lastestMessage = friend.history[friend.history.length - 2];

        if (lastMessage.senderId === user.id) {
            name = user.name;
            userIsSender = true;
        }
        else {
            name = friend.name;
            userIsSender = false;
        }
        mess = lastMessage.message;

        var newDate = new Date(lastMessage.timeId);
        var lastDate = new Date(lastestMessage.timeId);
        time = newDate.getUTCFullYear()+':'+newDate.getUTCDate()+':'+newDate.getUTCMonth()+':'+newDate.getUTCHours()+':'+newDate.getUTCMinutes();
        var date = newDate.getUTCDate()+'.'+newDate.getUTCMonth()+'.'+newDate.getUTCFullYear();
        var oldTime = lastDate.getUTCFullYear()+':'+lastDate.getUTCDate()+':'+lastDate.getUTCMonth()+':'+lastDate.getUTCHours()+':'+lastDate.getUTCMinutes();
        var oldDate = lastDate.getUTCDate()+'.'+lastDate.getUTCMonth()+'.'+lastDate.getUTCFullYear();
        if(oldDate === date)
            date ="";
            
        if (lastestMessage.senderId !== lastMessage.senderId) {
            
            $('#chatHistory').append(messageTemplate(userIsSender,mess,(newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date));
        }
        else {
            if (userIsSender) {
                htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
            }
            else {
                htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
            }            
            var element = $('#chatHistory li').last();
            if(oldTime === time)
                element.find('.ui-li-message-time').last().remove();
            htmlString += '<p class="ui-li-message-time ui-li-desc">' + (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date +'</p>';


            element.append(htmlString);
        }
        $("html, body").animate({scrollTop: $(document).height()}, 100);
    }
}

function addMessageToActiveGroupChat(id) {
    var group = getGroupById(id);
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
        time = newDate.getUTCFullYear()+':'+newDate.getUTCDate()+':'+newDate.getUTCMonth()+':'+newDate.getUTCHours()+':'+newDate.getUTCMinutes();
        date = newDate.getUTCDate()+'.'+newDate.getUTCMonth()+'.'+newDate.getUTCFullYear();
        oldTime = lastDate.getUTCFullYear()+':'+lastDate.getUTCDate()+':'+lastDate.getUTCMonth()+':'+lastDate.getUTCHours()+':'+lastDate.getUTCMinutes();
        oldDate = lastDate.getUTCDate()+'.'+lastDate.getUTCMonth()+'.'+lastDate.getUTCFullYear();
        
        if(oldDate === date)
            date ="";
        
        if (lastestMessage.senderId !== lastMessage.senderId) {
            $('#groupChatHistory').append(messageTemplate(userIsSender,mess,(newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date ));
        }
        else {
            if (userIsSender) {
                htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
            }
            else {
                htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
            }            
            var element = $('#groupChatHistory li').last();
            if(oldTime === time)
                element.find('.ui-li-message-time').last().remove();
            htmlString += '<p class="ui-li-message-time ui-li-desc">' + (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date +'</p>';


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
    message = 'new message';
    $('#chatListT').listview();
    $('#chatListT').append('\n\
        <li id="group_list_' + group.groupId + '" data-icon="false">\n\
            <a href="" onclick="onOpenGroupChatWindow(' + group.groupId + ')">\n\
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

function updateRecentConversationGroupName(group){
    $('#group_list_'+group.groupId+' .name').html(group.displayGroupName);
}
function updateContactListGroupName(group){
    $('#group_list_'+group.groupId+' .name').html(group.displayGroupName);
}

function updtateGroupChatWindowName(group){
    $('#groupChatPageTemplate #groupChatPageT').html(group.displayGroupName);
}