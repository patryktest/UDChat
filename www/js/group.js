var activeGroupChat;
var openGroupChat;

function setActiveGroupChat(id) {
    activeGroupChat = id;
}

function getActiveGroupChat() {
    return activeGroupChat;
}

function addOpenGroupChat(id){
    openGroupChat.push(id);
}

function closeOpenGroupChat(id){
    for (var i = 0; i < openGroupChat.length; i++) {
        if (openGroupChat[i] === id)
            openGroupChat.splice(i, 1);
    }
}


function getGroupById(id) {
    for (var i = 0; i < user.groupList.length; i++)
    {
        if (user.groupList[i].groupId === id)
            return user.groupList[i];
    }
    return null;
}

function isUserInGroup(idUser,idGroup){
    var group = getGroupById(idGroup);
    if(group!==null){
        var users= group.users;
        for(var i=0;i<users.length;i++){
            console.log('userID: '+idUser+' users in group'+users[i].id);
            if(users[i].id===idUser)
                return true;
        }
        return false; 
    }
    return null;
      
}

