/*function ShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li data-icon="false"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
    $('#groupListT').append('<li data-icon="false"><a onclick="onOpenPageCreatingGroupChat();" href=""><h2>+++</h2></a></li>');
}*/

$(function() {

    connect();
    background();
    
    if (user)
        window.location = '#loginPage';

    $('#inputPrivateMessage').keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
           
            sendPrivateMessage(msg);
        }
        ;
    });

    $('#inputGroupMessage').keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            
            sendGroupMessage(getActiveGroupChat(), msg);
        }
        ;
    });
    
    
    
    monitor_events();
    renderPopupMenu();
    
    //$('#contactback').addClass('hidden');
});

function monitor_events() {
    $("body").on("FilterInputCreated", function(event){
    
        $('#contactPage form input').keyup(function(e){
            hideLetterDividers();
            if($('#contactPage form input').val()==="")
                showLetterDividers();
        });
        $('#contactPage form a').click(function(e){
            showLetterDividers();
        });
        
    });
}

function hideLetterDividers(){
    $('#contactListT #letterDivider').css({display:'none'});
}
function showLetterDividers(){
    $('#contactListT #letterDivider').css({display:'block'});
}

function setUserStatus(stat) {
    user.status = stat;
}






function updateStatusIcon(statusNew, statusOld) {
    //console.log('change status icon');
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
        $('#chatListT #friend_list_' + id + ' span.user-status-icon').removeClass().addClass('user-status-icon ui-icon-' + status + ' device-mobile');
    }
    else{
        //console.log('friend status: user not exist');
    }
        

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
function updateContactListView() {
    for (var i = 0; i < user.friendList.length; i++)
        $('#contactListT #friend_list_' + user.friendList[i].id).removeClass('ui-selectedFriend');
}
function updateSelectedFriendView() {
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

function openPGChat(groupName) {
    if (selectedFriend.length) {
        if (selectedFriend.length < 2)
            openPrivateChat(selectedFriend[0]);
        else
            openGroupChat(groupName);

    }
}

/*
 * add friends to group
 */
function onGroupCreate() {
    for (var i = 0; i < selectedFriend.length; i++)
        addUserToGroup(selectedFriend[i], getActiveGroupChat());
    onOpenGroupChatWindow(getActiveGroupChat());
    clearSelectedFriend();
}

function removeGroupFromContactList(id) {
    $('#contactListT #group_list_' + id).remove();
}

function removeGroupFromMainList(id) {
    $('#chatListT #group_list_' + id).remove();
}



function onAddToFriendGroup() {
   // console.log('friend create group');
}

