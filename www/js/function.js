/*function ShowUserGroupList() {
    $('#groupListT').text('');
    for (var i = 0; i < user.groupList.length; i++) {
        $('#groupListT').append('<li data-icon="false"><a onclick="onOpenGroupChatWindow(' + user.groupList[i].groupId + ')" href=""><h2>' + user.groupList[i].groupName + '</h2> Leader: ' + user.groupList[i].groupLeader.name + '</a></li>');
    }
    $('#groupListT').append('<li data-icon="false"><a onclick="onOpenPageCreatingGroupChat();" href=""><h2>+++</h2></a></li>');
}*/

$(function() {
    
    connect();
    
    if (user)
        window.location = '#loginPage';

    $('#inputPrivateMessage').keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
           
            commandSendPrivateMessage(msg);
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








function updateStatusIcon(statusNew, statusOld) {
    //console.log('change status icon');
    $('#mainPage .ui-header #statusLinkMainPage').removeClass('ui-' + statusOld);
    $('#mainPage .ui-header #statusLinkMainPage').addClass('ui-' + statusNew);

    $('#mainPage .ui-header #statusLinkContatct').removeClass('ui-' + statusOld);
    $('#mainPage .ui-header #statusLinkContatct').addClass('ui-' + statusNew);

    $('#mainPage .ui-header #statusLinkChat').removeClass('ui-' + statusOld);
    $('#mainPage .ui-header #statusLinkChat').addClass('ui-' + statusNew);



}




function updateContactListView() {
    for (var i = 0; i < user.friendList.length; i++)
        $('#contactListT #friend_list_' + user.friendList[i].id).removeClass('ui-selectedFriend');
}

function isGroupUserInSelectFriend(user){
    for (var i = 0; i < selectedFriend.length; i++){
        if(user.id === selectedFriend[i])
            return true;
    }
    return false;
}


/*
 * add friends to group
 */








