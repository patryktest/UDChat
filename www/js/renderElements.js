/*
 * render list of recent conversations
 */
function renderRecentConversations(element) {
    element.text('');
    element.listview();
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].history.length)
            var message = user.friendList[i].history[user.friendList[i].history.length - 1].message;
        else
            message = 'new message';

        var hidden = '';
        if (user.friendList[i].newMessages < 1)
            hidden = 'hidden';

        element.append('<li data-icon="false" id="friend_list_' + user.friendList[i].id + '"><a onclick="openPrivateChat(' + user.friendList[i].id + ');" href="">\n\
        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + user.friendList[i].name + '<p class="chat-list-friend-item"><span class="ui-li-message-count ' + hidden + ' ">' + user.friendList[i].newMessages + '</span><span class="ui-li-message-text">' + message + '</span></p></a><span class="user-status-icon ui-icon-' + user.friendList[i].status + ' device-mobile"></span></li>');
    }
    for (var i = 0; i < user.groupList.length; i++) {
        element.append('<li data-icon="false" id="group_list_' + user.groupList[i].groupId + '"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><strong>' + user.groupList[i].groupName + '</strong></a></li>');
    }
    element.listview('refresh');

}

/*
 *  render contact list friends + group
 */
function renderContactList(element) {
    element.text('');
    
    element.listview();
    
    var contactList = [];
    for (var i = 0; i < user.friendList.length; i++) {
        contactList.push({id: user.friendList[i].id, name: user.friendList[i].name, group:0, status: user.friendList[i].status});
    }
    for (var i = 0; i < user.groupList.length; i++) {
        contactList.push({id: user.groupList[i].groupId, name: user.groupList[i].groupName, group:1});
    }
    contactList.sort(function(a,b){
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();
        if(nameA<nameB)
            return -1;
        if(nameA>nameB)
            return 1;
        return 0;
    });
    letterDivider = "";
    for (var i=0;i<contactList.length;i++){
        if(contactList[i].name[0]!==letterDivider)
            element.append('<li data-icon="false" id="letterDivider">'+contactList[i].name[0]+'</li>');
        if(!contactList[i].group)
            element.append('\
                <li data-icon="false" id="friend_list_' + contactList[i].id + '">\n\
                    <a onclick="selectFriend(' + contactList[i].id + ');" href="">\n\
                        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + contactList[i].name + '\
                    </a>\n\
                    <span class="user-status-icon ui-icon-' + contactList[i].status + ' device-mobile"></span>\n\
                </li>\n\
            ');
        else
            element.append('\
                <li data-icon="false" id="group_list_' + contactList[i].id + '">\n\
                    <a onclick="onOpenGroupChatWindow(' + contactList[i].id + ')" href="">\n\
                        <strong>' + contactList[i].name + '</strong>\n\
                    </a>\n\
                </li>\n\
            ');
        letterDivider = contactList[i].name[0];
        
    }
   element.listview('refresh');
   $( 'body' ).trigger( 'FilterInputCreated' );
}

/*
 * render popups menu for main, contact and chat page
 */

function renderPopupMenu() {
    var html = '<ul data-role="listview" data-inset="true" style="min-width:210px;" >\n\
                        <li data-role="divider" data-theme="e">Choose status</li>\n\
                        <li data-icon="false"><a onclick="setStatus(available);" href="#" data-rel="back">available</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(away);" href="#" data-rel="back">away</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(emergency);" href="#" data-rel="back">emergency</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(invisible);" href="#" data-rel="back">invisible</a></li>\n\
                        <li data-icon="false"><a onclick="setStatus(ofline);" href="#" data-rel="back">ofline</a></li>  \n\
                    </ul>';
    $('#popupMenu').html(html);
    $('#popupMenu2').html(html);
    $('#popupMenu3').html(html);
}