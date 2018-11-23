const todo = {
    owner: '',
    startTime: new Date(),
    endTime: new Date(),
    title: '',
    body: '',
    list: [ {title: '', finish: false} ],
    modifiedTime: new Date(),
    share: [],
    deleted: false,
    finish: false,
}

function Todo ( obj ) {
    if ( !(!!obj.owner && !!obj.title) ) {
        throw new Error('信息不全')
    }
    this.owner = obj.owner;
    this.startTime = obj.startTime ? obj.startTime : null;
    this.endTime = obj.endTime ? obj.endTime : null;
    this.title = obj.title;
    this.body = obj.body === undefined ? '' : obj.body;
    this.list = obj.list === undefined ? [] : obj.list;
    this.modifiedTime = new Date();
    this.deleted = obj.deleted === undefined ? false : obj.deleted;
    this.share = obj.share === undefined ? [] : obj.share;
    this.finish = obj.finish === undefined ? false : obj.deleted;
}


module.exports = { Todo }
