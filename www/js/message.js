function Message(id,date, groupId,message, receiverId,senderId,status,time,timeId,timestamp){
    var userS = '';
    if(id===receiverId)
        userS = 'my_';
    var statusE = document.createElement('span');
    statusE.setAttribute('class',userS+'message_status_'+status);
    
    this.date = date;
    this.groupId = groupId;
    this.message = message;
    this.receiverId = receiverId;
    this.senderId = senderId;
    this.status = status;
    this.statusElement = statusE;
    this.time = time;
    this.timeId = timeId;
    this.timestamp = timestamp;
    this.updateStatus = updateStatusF;
    
    function updateStatusF(userId,status){
        var userS = '';
        if(userId===receiverId)
            userS = 'my_';
        this.status = status;
        this.statusElement.setAttribute('class',userS+'message_status_'+status);
    }
    
    
}