function responseLogin(json) {
    friendList = new Array();
    for (var i = 0; i < json.friendList.length; i++) {
        friendList.push(createFriend(json.friendList[i].id, json.friendList[i].name, json.friendList[i].newMessages, json.friendList[i].status));
    }
    /*for(var i=0;i<json.groupList;i++){
     friendList.push(createGroup());
     }*/

    user = {
        id: json.user.id,
        name: json.user.name,
        friendList: friendList,
        groupList: '',
        status: 0

    };
    console.log("responseLogin OK ");
}

function responseLogout(json) {
    console.log('responseLogout: OK');
}

function responseFriendListUpdate() {

}
function responseGroupClose() {

}
function responseGroupInfo() {

}
function responseGroupJoin() {

}
function responseGroupLeave() {

}
function responseGroupMessage() {

}
function responsePrivateHistory(json) {
    console.log('responsePrivateHistory: OK');
    for (var i = 0; i < user.friendList.length; i++) {
        if (user.friendList[i].id === actualOpeningChat)
            user.friendList[i].history = json.history;
    }
    console.log(user.friendList);
    showConversation();
}
function responsePrivateMessage(json) {
    console.log('responsePrivateMessage: OK');
    if (user.id === json.data.receiverId) {
        for (var i = 0; i < user.friendList.length; i++) {
            if (user.friendList[i].id === json.data.senderId)
                user.friendList[i].history.push(json.data);
        }
    }
    if (user.id === json.data.senderId) {
        for (var i = 0; i < user.friendList.length; i++) {
            if (user.friendList[i].id === json.data.receiverId)
                user.friendList[i].history.push(json.data);
        }
    }
    
    showConversation();

}

function responseStatusUpdate(json) {
    if (json.result === 0)
        console.log('responseStatusUpdate OK');
    else
        console.log('responseStatusUpdate ERR result: ' + json.result);


}