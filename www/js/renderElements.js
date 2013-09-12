/*
 * render list of recent conversations
 */
function renderRecentConversations() {
    //$('#contactback').removeClass('hidden');
    var element = $('#chatListT');
    element.text('');
    var message = '';
    
    for (var i = 0; i < user.friendList.length; i++) {
        if(user.friendList[i].recent){
            message = '';
            if (user.friendList[i].history.length)
                message = user.friendList[i].history[user.friendList[i].history.length - 1].message;
            if (user.friendList[i].newMessages>0)
                message = 'new message';

            element.append(itemTemplate('friend_list_',user.friendList[i].id,user.friendList[i].startChat,user.friendList[i].name,user.friendList[i].newMessages,user.friendList[i].status,message));
            
        }
        
    }
    for (var i = 0; i < user.groupList.length; i++) {
        message = '';
        element.append(itemTemplate('group_list_',user.groupList[i].groupId,user.groupList[i].startGroupChat,user.groupList[i].displayGroupName,user.groupList[i].newMessages,null,message));
    }
    
    if ((element).hasClass('ui-listview')){
        element.listview('refresh');
        element.listview();
    }

}

/*
 *  render contact list friends + group
 */
function renderContactList() {
    element = $('#contactListT');
    element.text('');
 
    var contactList = [];
    for (var i = 0; i < user.friendList.length; i++) {
        contactList.push({id: user.friendList[i].id, name: user.friendList[i].name, group:0, status: user.friendList[i].status, fun:user.friendList[i].selectFriend});
    }
    for (var i = 0; i < user.groupList.length; i++) {
        contactList.push({id: user.groupList[i].groupId, name: user.groupList[i].displayGroupName, group:1,fun: user.groupList[i].startGroupChat});
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
    var letterDivider = "";
    for (var i=0;i<contactList.length;i++){
        if(contactList[i].name[0]!==letterDivider)
            element.append('<li data-icon="false" id="letterDivider">'+contactList[i].name[0]+'</li>');
        if(!contactList[i].group)
            element.append(itemTemplate('friend_list_',contactList[i].id,contactList[i].fun,contactList[i].name,null,contactList[i].status,null));
        else
            element.append(itemTemplate('group_list_',contactList[i].id,contactList[i].fun,contactList[i].name,null,null,null));
        letterDivider = contactList[i].name[0];
        
    }
    if ((element).hasClass('ui-listview')) {
        element.listview();
        element.listview('refresh');
    };
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


function renderPrivateChatWindow(id) {
    
    var friend = user.getFriendById(id);
    var time = '',date = '', mess = '', name = '',status = '',statusElement ='';
    var lastSender = '';
    var lastDate = '';
    var lastSendTime = '';
    var htmlString;
    
    if (friend !== null) {
        $('#chatPageTitle').html(friend.name);
        var element_chatHistory = $('#chatHistory');
        element_chatHistory.html('');
    
        var friendHistoryLength = friend.history.length;
        var i = 0;
        var userIsSender = false;
        numberMessageItemGroup=0;
        if(friendHistoryLength>4)
            i = friendHistoryLength-4;
            
        for (i; i < friendHistoryLength; i++) {
            
            if (friend.history[i].senderId === user.id) {
                name = user.name;
                userIsSender = true;
            }
            else {
                name = friend.name;
                userIsSender = false;
            }

            mess = friend.history[i].message;
            status = friend.history[i].status;
            statusElement = friend.history[i].statusElement;
            var newDate = new Date(friend.history[i].timeId);
            time = newDate.getUTCFullYear()+':'+newDate.getUTCDate()+':'+newDate.getUTCMonth()+':'+newDate.getUTCHours()+':'+newDate.getUTCMinutes();
            date = newDate.getUTCDate()+'.'+newDate.getUTCMonth()+'.'+newDate.getUTCFullYear();
            if(lastDate === date){
                date = "";
            }
            else{
                lastDate = date;
            }
                
            
            if (lastSender !== name) {
                numberMessageItemGroup++;
                var element = messageTemplate(userIsSender,mess,statusElement,(newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date,numberMessageItemGroup);
                element_chatHistory.append(element);    
            }
            else {
                if(userIsSender){
                    htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
                    
                }
                else{
                    htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
                }
                element = $('#chatHistory li').last();
                element.append(htmlString);
                if(lastSendTime === time)
                    element.find('.ui-li-message-time').last().remove();
                //htmlString += '<p class="ui-li-message-time ui-li-desc">' + (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date +' '+status+'</p>';
                var element2 = document.createElement('p');
                element2.setAttribute('class','ui-li-message-time ui-li-desc');
                element2.innerHTML = (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date;
                element2.appendChild(statusElement);
                element.append(element2);
                
                    
                
            }
            lastSender = name;
            lastSendTime = time;
        }

       if (element_chatHistory.hasClass('ui-listview')) {
            element_chatHistory.listview();
            element_chatHistory.listview('refresh');
        };
        $('#chatPageTemplate').on('pageshow',function(){
            $.mobile.silentScroll($('#chatHistory').height());
            $('.block-input-send').css({width:($(document).width()-$('.block-button-send .ui-btn').width()-50)+'px'});
        });
    } 
}

function renderGroupChatWindow(id) {
    
    var element_groupChatHistory = $('#groupChatHistory');
    element_groupChatHistory.html('');
    var time = '', mess = '', name = '', date = '';
    var group = user.getGroupById(id);


    if (group !== null) {
        $('#groupChatPageT').html(group.displayGroupName);
        var history = group.history;
        var lastSender = '';
        var lastSendTime = '';
        var lastDate = '';
        var status = '';
        var htmlString;
        var userIsSender = false;
        numberMessageItemGroup=0;
        for (var i = 0; i < history.length; i++) {
            if (history[i].senderId === user.id){
                name = user.name;
                userIsSender = true;
            }
            else{
                name = getFriendName(history[i].senderId);
                userIsSender = false;
            }

            mess = history[i].message;
            
            
            
            var newDate = new Date(history[i].timeId);
            time = newDate.getUTCFullYear()+':'+newDate.getUTCDate()+':'+newDate.getUTCMonth()+':'+newDate.getUTCHours()+':'+newDate.getUTCMinutes();
            date = newDate.getUTCDate()+'.'+newDate.getUTCMonth()+'.'+newDate.getUTCFullYear();
            if(lastDate === date){
                date = "";
            }
            else{
                lastDate = date;
            }

            if (lastSender !== name) {
                numberMessageItemGroup++;
                element_groupChatHistory.append(messageTemplate(userIsSender, mess, status, (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date,numberMessageItemGroup));
            }
            else {
                if(history[i].senderId === user.id){
                    htmlString = '<p class="ui-li-message-left ui-li-desc">' + mess + '</p>';
                }
                else{
                    htmlString = '<p class="ui-li-message-right ui-li-desc">' + mess + '</p>';
                }                
                var element = $('#groupChatHistory li').last();
                if(lastSendTime === time)
                    element.find('.ui-li-message-time').last().remove();
                htmlString += '<p class="ui-li-message-time ui-li-desc">' + (newDate.getHours()<10?'0':'')+newDate.getHours()+':'+(newDate.getMinutes()<10?'0':'')+newDate.getMinutes() + ' '+date +'</p>';
                
                    
                element.append(htmlString);
            }
            lastSender = name;
            lastSendTime = time;

        }
    }
    
    if (element_groupChatHistory.hasClass('ui-listview')) {
        element_groupChatHistory.listview();
        element_groupChatHistory.listview('refresh');
    };
    $('#groupChatPageTemplate').on('pageshow',function(){
        $.mobile.silentScroll($('#groupChatHistory').height());
        $('.block-input-send').css({width:($(document).width()-$('.block-button-send .ui-btn').width()-50)+'px'});
    });
    
}

function renderGroupMenu(group){
    var element = $('#groupMenuConnections');
    var html = '';
    for(var i=0;i<group.users.length;i++){
        html +='\
                <li data-icon="false" id="friend_list_' + group.users[i].id + '">\n\
                    <a onclick="selectFriend(' + group.users[i].id + ');" href="">\n\
                        <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + group.users[i].name + '\
                    </a>\n\
                </li>\n\
               ';
    }
    element.html(html);
    if ((element).hasClass('ui-listview')){
        element.listview('refresh');
        element.listview();
    }
    $('#groupMenuPageTemplate').on('pageshow',function(){
       $('#groupChatMenuBtn_manage').css({width:($(document).width()-30)+'px'});
       $('#groupChatMenuBtn_rename').css({width:($(document).width()-30)+'px'});
       $('#groupChatMenuBtn_leave').css({width:($(document).width()-30)+'px'});
       $('#groupChatMenuBtn_close').css({width:($(document).width()-30)+'px'});
       if(group.isgroupLeader){
           $('#groupChatMenuBtn_leave').hide();
           $('#groupChatMenuBtn_close').show();
       }
       else{
           $('#groupChatMenuBtn_leave').show();
           $('#groupChatMenuBtn_close').hide();
       }
           
       
    });
}

function renderPopupGroupMenu(content,left_btn,right_btn, add_function){
    $('#popupGroupMenu p').html('<span class="ui-btn-inner"><span class="ui-btn-text">'+content+'</span></span>');
    $('#popupGroupMenu a.left_btn').html('<span class="ui-btn-inner"><span class="ui-btn-text">'+left_btn+'</span></span>');
    $('#popupGroupMenu a.right_btn').html('<span class="ui-btn-inner"><span class="ui-btn-text">'+right_btn+'</span></span>');
    $('#popupGroupMenu a.right_btn').attr('onclick', add_function)
    
    
    
}

function viewUpdateFriendStatus(friend){
    $('#chatListT #friend_list_' + friend.id + ' span.user-status-icon').removeClass().addClass('user-status-icon ui-icon-' + friend.status + ' device-mobile');
}


function itemTemplate(id_string,id,fun,name,countNewMessage,status,message){
    var hidden = '';
    if (countNewMessage < 1)
        hidden = 'hidden';
    var temp = '<li data-icon="false" id="'+ id_string + id + '">\n\
                <a onclick="' + fun + ';" href="">\n\
                    <img  src="./img/profil_img.png" alt="status" class="ui-li-icon">' + name;
   if(countNewMessage !== null )
       temp +=   '<p class="chat-list-friend-item">\n\
                        <span class="ui-li-message-count ' + hidden + ' ">' +countNewMessage + '</span>\n\
                        <span class="ui-li-message-text">' + message + '</span>\n\
                    </p>';
    temp += '</a>';
    if(status !== null)
        temp += '<span class="user-status-icon ui-icon-' + status + ' device-mobile"></span>\n';
    temp += '</li>';
    return temp;
}

function messageTemplate(userIsSender, message, status, date, num){
    var color = 'light';
    if(num%2) color = 'dark';
    else color = 'light';
    var element = document.createElement('li');
    element.setAttribute('class','ui-li ui-li-static ui-btn-up-d '+color); //('ui-li ui-li-static ui-btn-up-d '+color);
    //var temp = '<li class="ui-li ui-li-static ui-btn-up-d '+color+'">';
    if(userIsSender){
        temp = '<p class="ui-li-right ui-li-desc"><img  src="./img/profil_img.png" alt="status" class="ui-li-profil-icon"></p>';
        temp += '<p class="ui-li-message-left ui-li-desc">' + message + '</p>';
    }
    else{
        temp = '<p class="ui-li-left ui-li-desc"><img  src="./img/profil_img.png" alt="status" class="ui-li-profil-icon"></p>';
        temp += '<p class="ui-li-message-right ui-li-desc">' + message + '</p>';
    }          
    
    element.innerHTML =temp;
    var elementP = document.createElement('p');
    elementP.setAttribute('class','ui-li-message-time ui-li-desc');
    elementP.innerHTML = date;
    elementP.appendChild(status)
    element.appendChild(elementP);
    //temp += '</li>';
    
    return element;
}

