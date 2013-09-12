var activeGroupChat;
var openGroupChat;

function Group(groupId,groupLeader,groupName,groupStream,groupStreamStatu,history,limit,ongoingVideo,users){
    this.displayGroupName = groupName;
    this.groupId = groupId;
    this.groupName = groupName;
    this.groupLeader = groupLeader;
    this.groupStream = groupStream;
    this.groupStreamStatus = groupStreamStatu;
    this.history = history;
    this.limit = limit;
    this.ongoingVideo = ongoingVideo;
    this.users = users;
    this.newMessages = 0;
    this.startGroupChat = 'onOpenGroupChatWindow(' + this.groupId + ')';
    this.checkUpdateGroupName = checkUpdateGroupNameF;
    this.isgroupLeader = isgroupLeaderF;
    this.addSelectedFriend = addSelectedFriendF;
    this.removeUser = removeUserF;
    this.update = updateF;
    this.hasUser = hasUserF;

    this.checkUpdateGroupName();
    
    function checkUpdateGroupNameF(){
        if(this.groupName===this.groupLeader.name)
            this.displayGroupName = this.groupLeader.name+ ' + '+ (this.users.length-1);
        updateRecentConversationGroupName(this);
        if(this.groupId === getActiveGroupChat()){
            updtateGroupChatWindowName(this);
        }
    }
    
    function isgroupLeaderF(){
        if(this.groupLeader.id===user.id)
            return true;
        return false;
    }
    
    function addSelectedFriendF(user){
        this.users.push(user);
        this.checkUpdateGroupName();
    }
    
    function removeUserF(idUser){
        var users= this.users;
        for(var i=0;i<users.length;i++){
            if(users[i].id===idUser){
                users.splice(i,1);
                this.checkUpdateGroupName();
                return true;
            }
        }         
        return false;   
    }
    function updateF(groupId,groupLeader,groupName,groupStream,groupStreamStatu,history,limit,ongoingVideo,users){
        var nameChanged = false;
        if(this.groupName !== groupName)
            nameChanged = true;
        this.displayGroupName = groupName;
        this.groupId = groupId;
        this.groupName = groupName;
        this.groupLeader = groupLeader;
        this.groupStream = groupStream;
        this.groupStreamStatus = groupStreamStatu;
        this.history = history;
        this.limit = limit;
        this.ongoingVideo = ongoingVideo;
        this.users = users;
        this.newMessages = 0;
        this.checkUpdateGroupName();
        return nameChanged;
    }
    
    function hasUserF(idUser){
        var users= this.users;
        for(var i=0;i<users.length;i++){
            if(users[i].id===idUser){
                return true;
            }
        }         
        return false; 
    }
}

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







