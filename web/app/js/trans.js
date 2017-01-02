var _ = function() {
    var msgid = arguments[0];
    var prelozene = msgid;
    var index = TheTrans_orig.indexOf(msgid);

    if (index > -1)
        prelozene = TheTrans[index];

    for (var i = 1; i < arguments.length; i++) {
        prelozene = prelozene.replace('%' + i, arguments[i]);
    }

    return prelozene;
};
