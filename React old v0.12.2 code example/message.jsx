var ReactHelloSimple = React.createClass({

    confirmMessage: function(e){// you can switch this off by replacing its call to the call to replyMessage function
        dMI.confirmMes.confirmWind(this.props.name, 'index?', e);
        dMI.hideButton(0);
        dMI.apply();
    },

    preReplyCheck: function(e){///!! This_function is not used.

    var source = this.props.value.data.source;
    var parent = $(e.target).parent().hasClass('white_btn') ? $(e.target).parent().parent().parent().parent() : $(e.target).parent().parent().parent();
    if(typeof parent[0] === "undefined" || parent[0] == "" || parent[0] == null || typeof parent[0][Object.keys(parent[0])[0]] != "number"){
        parent = e;
    }

    if(source === "vk.com"){

        var fulltext;        

        if(this.props.value.data.enclosure.length == 0) {
            fulltext = this.props.value.full_text;
        } else {
            fulltext = "enclosure_t";
        }

        var alert_message = new Array();
        var res_text = "";
        var res_author_name = "";
        var post_author_name = this.props.value.data.author_name;


        if(post_author_name.slice(-1) !== " "){
            post_author_name += " ";
        }

        $.ajax({
            url: site_url + 'ajax_ws/check_post',
            type: 'POST',
            data: {"url": this.props.value.data.url, "full_text": fulltext, "author_name": post_author_name},
            dataType: 'JSON',
            async: false,
            global: true,
            beforeSend: function () {
            },
            success: function (answ) {
                alert_message = answ.data.alert_message;
                res_text = answ.data.res_text;
                res_author_name = answ.data.res_author_name;
            }
        });

        var confirm_message = "";
        var confirm_message_arr = new Array();

        if(alert_message != null && alert_message.length > 0) {

            if(alert_message.indexOf("post_removed") !== -1) {
                confirm_message = 'You have selected already deleted message. You can either skip it, change message status to "Closed" or move it to "Trash".';
                this.confirmMessage(confirm_message, alert_message, res_text);
            }else{
                if(alert_message.indexOf("post_changed") !== -1 && res_text != ""){
                    confirm_message_arr.push('You have selected message which was updated to: "' + res_text + '". \n');
                }

                if(alert_message.indexOf("author_name_changed") !== -1 && res_author_name != ""){
                    res_author_name = res_author_name.slice(0, -1);
                    confirm_message_arr.push('You have selected message which author\'s name was changed to: "' + res_author_name + '". \n');
                }

                if(confirm_message_arr.length > 0){
                    var conf_arr_message = "";
                    for(var i = 0; i < confirm_message_arr.length; i++){
                        conf_arr_message += confirm_message_arr[i];
                    }
                    conf_arr_message += 'Click "Reply" to proceed or "Cancel" to skip this message.';
                    this.confirmMessage(conf_arr_message, alert_message, res_text, res_author_name, parent);
                } else {
                    this.replyMessage(e);
                }
            }

        } else {
            this.replyMessage(e);
        }

    } else {
        this.replyMessage(e);
    }

    },

    replyMessage: function(e){
        dMI.replyMessage(this.props.name, 'index?', e);
        dMI.hideButton(0);
        dMI.apply();
        $("#expand_dialog").dialog('close');
    },
    likePost: function(e){
        var default_profile = parseInt(dMI.dictionary.default_profile);
        if(!isNaN(default_profile) && default_profile > 0) {
            dMI.likePost(this.props.name, 'index?', e, default_profile);
            dMI.apply();
        } else {
        dMI.likePost(this.props.name, 'index?', e);
        dMI.apply();
        }

    },
    render: function() {
        var clearStyle = {
            clear: 'both',
            float: 'none'
        };
        var value = this.props.name;

        var currentMsg = '';
        if (value.data && value.data.status) {
            currentMsg =
            dMI.messages[dMI.msg_type[value.data.status - 1]].data.msgs_general.curent_msg == value.data.sf_id ||
            dMI.messages[dMI.msg_type[value.data.status - 1]].data.msgs_general.curent_msg == value.data.inbox_id ? ' curent_msg' : '';
        }    

        var isOwnMsg = ' ' + dMI.checkOwnMessages(value.data.author_url);
        var sentiments = value.data.sentiment.map(function(sentiment) {
            return <div><img src={"../../images/objects_logo/" + (dMI.dictionary.objects_logo[dMI.splitSentiment(sentiment, 0)] ? (dMI.dictionary.objects_logo[dMI.splitSentiment(sentiment, 0)].mini_logo || 'empty_logo.png') : 'empty_logo.png')} />
                <span className={dMI.splitSentiment(sentiment, 1)}></span></div>;
        });
        var flags = value.data.country.map(function(flag) {
            if(flag !== "g_undefined"){
                return <img className="flag" src={"../../images/geo_flags/" + flag + ".png"} title={dMI.dictionary.objects_name[flag]}/>;
            }
        });
        var region = <span className="region" dangerouslySetInnerHTML={{__html: ((value.data.region[0] != 'g_undefined') ? dMI.dictionary.objects_name[value.data.region[0]] : '')}}></span>;
        var geo = value.data.country && value.data.country != 'g_undefined' ? <div className="geo">{[flags[0],region]}</div> : '';
        var splitedCats = value.data.categories.length > 7 ? dMI.getCats(value.data.categories) : value.data.categories;
        var categories = <div className="categorys">
            {[
                splitedCats.map(function(category, indx) {
                    return value.data.categories[indx] ? <div>
                        <span>{dMI.dictionary.objects_name[value.data.categories[indx]]}</span>
                    </div> : ''
                }),
                (value.data.categories.length > 7 ? <div>
                    <span>...</span>
                </div> : '')
            ]}
        </div>;
        var buttons =
            [(value.data.source != "www.instagram.com" ?
                <button type="button" className={"white_btn reply btn btn-primary"} onClick={this.likePost}>
                    <i className="icon-thumbs-up" aria-hidden="true"></i>Like
                </button> : ''),
                <button type="button" className={"white_btn reply btn btn-primary"} onClick={this.confirmMessage}>
                    <i className="icon-share-alt" aria-hidden="true"></i>Reply
                </button>
            ];
        var enclosure = value.data.enclosure ? value.data.enclosure.map(function(enclosure){ return <a target="_blank" href={enclosure}><img src={enclosure} /></a> }) : '';
        return <div className={"stream_msg " + value.class + isOwnMsg + currentMsg }>
            {currentMsg != '' ? <a className="scroll_here" name="curent_msg" xmlns="http://www.w3.org/1999/html"></a> : ''}
        <div className="drag" style={{display: 'none'}}></div>
            <div className="images">
                <div className="avatar">
                    <a target="_blank" href={value.data.author_url}>
                        <img className={value.data.inbox_id === 0 || value.data.inbox_id > 0 || (value.data.inbox_id != false && value.data.inbox_id != null) ? 'from_private' : ''} src={(value.ava || dMI.dictionary.avatars[value.data.author_url] || 'http://www4.informio.biz/images/ava_40x40/custom.png')}/>
                    </a>
                    <span className={"from_private " + (value.data.inbox_id === 0 || value.data.inbox_id > 0 || (value.data.inbox_id != false && value.data.inbox_id != null) ? '' : 'invisible')}></span>
                </div>
                <div className="objects">
                    {sentiments}
                </div>
            </div>
            <div className="msg">
                <div className="msg_right">
                    <div className={"owner " + ((value.data.owner != false && (value.parentID_mongo != 0 || !(dMI.checkInvisibleOwner(value.data.status) !== -1))) ? '' : ' ')}>
                        <img className={value.data.owner ? '' : 'invisible'} src={value.data.owner ? (dMI.users.usersObject.users[value.data.owner] ? dMI.users.usersObject.users[value.data.owner].user_avatar : dMI.getBaseUrlNoAva) : ''}
                            title={dMI.users.usersObject.users[value.data.owner] ? (dMI.users.usersObject.users[value.data.owner].user_name + ' ' + dMI.users.usersObject.users[value.data.owner].user_last_name) : ''} />
                        <span></span>
                    </div>
                    <a target="_blank" href={value.data.url}>
                        <div className={"date " + dMI.getMessageTimes['expired'](value.data.time, '7200', value.data.status)} title={dMI.getMessageTimes['time'](value.data.time)}>
                            {dMI.getMessageTimes['preciseDiff'](value.data.time)}
                        </div>
                    </a>
                </div>
                <div className="msg_top">
                    <div className="source"><img title={value.data.source} src={value.sourceIcon} /></div>
                    <div className="author_name">
                        <a target="_blank" href={value.data.author_url} >
                {value.data.author_name}
                        </a>
                    </div>
                    {geo}
                </div>
                <a className={"title " + (value.data.doc_type.length && (dMI.checkDocType(dMI.dictionary.doc_types, value.data.doc_type) != -1) ? '' : 'invisible')}
                    href={value.data.url} target="_blank" dangerouslySetInnerHTML={{__html: value.title}}></a>
                <div className="full_text" dangerouslySetInnerHTML={{__html: dMI.dictionary.sources[value.data.source] == 'tw' ? value.title : value.full_text}}></div>
                <div className="enclosure">
                    {enclosure}
                </div>
                {categories}
            </div>
            <div className={"buttons"}>
                <div>
                    {buttons}
                </div>
            </div>
            <div style={clearStyle}></div>
        </div>;
    }
});

window.HelloMessageGroup = React.createClass({
    render: function() {
        var nodes = this.props.value.map(function(element) {
        if (element.child && element.child.length > 0) {
        var msg = <ReactHelloSimple name={element}></ReactHelloSimple>;
        return <div>{msg}<HelloMessageGroup value={element.child}></HelloMessageGroup></div>;
        } else {
        return <ReactHelloSimple name={element}></ReactHelloSimple>;
        }
    });
    return <div>{nodes}</div>;
    }
});