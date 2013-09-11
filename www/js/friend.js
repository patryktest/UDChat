var selectedFriend=[];

/*
 * Create new friend createFriend(id,name,newMessage,status)
 * return object friend
 */

function Friend(id, name, newMessages, status, history, recent){
    this.id= id;
    this.name= name;
    this.newMessages= newMessages;
    this.status= status;
    this.history= history;
    this.incognito= false;
    this.recent = recent;
    
    this.updateHistory = updateHistoryF;
    this.addToHistory = addToHistoryF;
    this.updateStatus = updateStatusF;
    this.startChat = 'commandOpenPrivateChat('+this.id+')';
    this.selectFriend = 'selectFriend('+this.id+')';
    
    function updateHistoryF(data){
        this.history = data;
    }
    
    function addToHistoryF(data){
        this.history.push(data);
    }
    
    function updateStatusF(status) {
        this.status = status;    
    }
    
    function openPrivateChatF(){
        openPrivateChat(this.id);
    }
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

function addToSelectedFriend(id){
    selectedFriend.push(id);
}
function removeFromSelectedFriend(id){
    for(var i=0;i<selectedFriend.length;i++){
        if (selectedFriend[i] === id)
            selectedFriend.splice(i, 1);
    }
}
function isSelectedFriend(id){
    for(var i=0;i<selectedFriend.length;i++){
        if (selectedFriend[i] === id)
            return true;
    }
    return false;
}
function getSelectedFriend(){
    return selectedFriend;
}
function clearSelectedFriend(){
    selectedFriend = [];
}

function selectFriend(id) {
    if (isSelectedFriend(id)) {
        removeFromSelectedFriend(id);
        updateContactListSelectFriend(id,'remove');
    }
    else {
        addToSelectedFriend(id);
        updateContactListSelectFriend(id,'add');
    }
    updateSelectedFriendView();

}