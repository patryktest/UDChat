var selectedFriend = [];

/*
 * Create new friend createFriend(id,name,newMessage,status)
 * return object friend
 */

function Friend(id, name, newMessages, status, history, recent) {
    var historyA = new Array();
    for (var i = 0; i < history.length; i++)
        historyA.push(new Message(id, history[i].date, history[i].groupId, history[i].message, history[i].receiverId, history[i].senderId, history[i].status, history[i].time, history[i].timeId, history[i].timestamp));

    this.id = id;
    this.name = name;
    this.newMessages = newMessages;
    this.status = status;
    this.history = historyA;
    this.incognito = false;
    this.recent = recent;

    this.updateHistory = updateHistoryF;
    this.addToHistory = addToHistoryF;
    this.updateStatus = updateStatusF;
    this.startChat = 'commandOpenPrivateChat(' + this.id + ')';
    this.selectFriend = 'selectFriend(' + this.id + ')';
    this.updateMessageStatus = updateMessageStatusF;

    function updateHistoryF(history) {
        var historyA = new Array();
        for (var i = 0; i < history.length; i++)
            historyA.push(new Message(id, history[i].date, history[i].groupId, history[i].message, history[i].receiverId, history[i].senderId, history[i].status, history[i].time, history[i].timeId, history[i].timestamp));
        this.history = historyA;
    }

    function addToHistoryF(history) {
        this.history.push(new Message(id, history.date, history.groupId, history.message, history.receiverId, history.senderId, history.status, history.time, history.timeId, history.timestamp));
    }

    function updateStatusF(status) {
        this.status = status;
    }

    function openPrivateChatF() {
        openPrivateChat(this.id);
    }
    
    function updateMessageStatusF(userId,timeId,status){
        for(var i=0;i<this.history.length;i++){
            if(this.history[i].timeId === timeId){
                this.history[i].updateStatus(userId,status);
            }
                
        }
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

function addToSelectedFriend(id) {
    selectedFriend.push(id);
}
function removeFromSelectedFriend(id) {
    for (var i = 0; i < selectedFriend.length; i++) {
        if (selectedFriend[i] === id)
            selectedFriend.splice(i, 1);
    }
}
function isSelectedFriend(id) {
    for (var i = 0; i < selectedFriend.length; i++) {
        if (selectedFriend[i] === id)
            return true;
    }
    return false;
}
function getSelectedFriend() {
    return selectedFriend;
}
function clearSelectedFriend() {
    selectedFriend = [];
}

function selectFriend(id) {
    if (isSelectedFriend(id)) {
        removeFromSelectedFriend(id);
        updateContactListSelectFriend(id, 'remove');
    }
    else {
        addToSelectedFriend(id);
        updateContactListSelectFriend(id, 'add');
    }
    updateSelectedFriendView();

}