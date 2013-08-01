/*
 * Create new friend createFriend(id,name,newMessage,status)
 * return object friend
 */
function createFriend(id, name, newMessages, status) {
    var friend = {
        id: id,
        name: name,
        newMessages: newMessages,
        status: status,
        history: [],
        incognito: false
    };
    return friend;
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