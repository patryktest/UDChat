var actualOpeningChat = "";
var openConversation = [];

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


function addNotificationToPrivateChat(data){
    if (user.id === data.receiverId) {
        var friend = getFriendById(data.senderId);
        if(friend!== null){
            friend.newMessages++;
            $('#chatListT #friend_list_'+data.senderId+' span.ui-li-message-count').removeClass('hidden');
            $('#chatListT #friend_list_'+data.senderId+' span.ui-li-message-count').html(friend.newMessages);
            updateHistoryTextUndeContact(data.senderId,"new message");
        }
            
    }
}

function clearNotificationToPrivateChat(id){
    var friend = getFriendById(id);
    if(friend!== null){
        friend.newMessages = 0;
        $('#chatListT #friend_list_'+id+' span.ui-li-message-count').addClass('hidden');
        $('#chatListT #friend_list_'+id+' span.ui-li-message-count').html(friend.newMessages);
    }
}

function loadPrivateChat(id) {
    console.log($('.block-button-send .ui-btn').width());
    var friend = getFriendById(id);
    var time = '', mess = '', name = '';
    var lastSender = '';
    var lastSendTime = '';

    $('#chatPageTitle').html(friend.name);
    $('#chatHistory').html('');
    if (friend !== null) {
        friendHistoryLength = friend.history.length;
        var i = 0;
        //if(friendHistoryLength>4)
        //    i = friendHistoryLength-4;
            
        for (i; i < friend.history.length; i++) {
            if (friend.history[i].senderId === user.id) {
                name = user.name;
            }
            else {
                name = friend.name;
            }

            mess = friend.history[i].message;
            date = friend.history[i].date;
            time = friend.history[i].time;
            
            if (lastSender !== name || lastSendTime !== time) {
                if (i === 0)
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-d ui-first-child">';
                if (i === friend.history.length - 1)
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-d ui-last-child">';
                else
                    htmlString = '<li class="ui-li ui-li-static ui-btn-up-d">';
                if(friend.history[i].senderId === user.id){
                    htmlString += '<p class="ui-li-right ui-li-desc"><img  src="./img/profil_img.png" alt="status" class="ui-li-profil-icon"></p>';
                    htmlString += '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
                }
                else{
                    htmlString += '<p class="ui-li-left ui-li-desc"><img  src="./img/profil_img.png" alt="status" class="ui-li-profil-icon"></p>';
                    htmlString += '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
                }          
                htmlString += '<p class="ui-li-message-time ui-li-desc">' + time + '</p>';
                htmlString += '</li>';
                $('#chatHistory').append(htmlString);
            }
            else {
                if(friend.history[i].senderId === user.id){
                    htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
                }
                else{
                    htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
                }
                $('#chatHistory li').last().append(htmlString);
            }
            lastSender = name;
            lastSendTime = time;


        }

    }    
    $('#chatPageTemplate').on('pageshow',function(){
        $.mobile.silentScroll($('#chatHistory').height());
        //console.log($('.block-button-send .ui-btn').width());
        $('.block-input-send').css({width:($(document).width()-$('.block-button-send .ui-btn').width()-50)+'px'});
    });
}

function showMessageInActivePrivateConversation(id){
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
        date = lastMessage.date;
        time = lastMessage.time;

        if (lastestMessage.senderId !== lastMessage.senderId) {
            htmlString = '<li class="ui-li ui-li-static ui-btn-up-d">';
            
            if(lastMessage.senderId === user.id){
                    htmlString += '<p class="ui-li-right ui-li-desc"><img  src="./img/profil_img.png" alt="status" class="ui-li-profil-icon"></p>';
                    htmlString += '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
                }
                else{
                    htmlString += '<p class="ui-li-left ui-li-desc"><img  src="./img/profil_img.png" alt="status" class="ui-li-profil-icon"></p>';
                    htmlString += '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
                }  
            htmlString += '<p class="ui-li-message-time ui-li-desc">' + time + '</p>';
            /*htmlString += '<p class="ui-li-left ui-li-desc">' + name + '</p>';
            htmlString += '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
*/
            htmlString += '</li>';
            $('#chatHistory').append(htmlString);
        }
        else {
            if(lastMessage.senderId === user.id){
                    htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
                }
                else{
                    htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
                }
                htmlString += '<p class="ui-li-message-time ui-li-desc">' + time + '</p>';
            //htmlString = '<p class="ui-li-message ui-li-desc">' + mess + '</p>';
            $('#chatHistory li').last().append(htmlString);
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 100);
    }
}

function closePrivateChatWindow(){
    closeConverastion(getActiveConverastion());
    
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