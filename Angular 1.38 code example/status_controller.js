angular.module('myApp',[]);    

function StatusFactory($http, ObjectToParamService, MessageDataService, MessagesFactory) {
    var statusObject = {};
    statusObject.setStatus = function(msg, old_status, new_status) {
        var move_from = old_status;
        msg.data.status = new_status;
        if(new_status == 1){
            msg.data.owner = 0;
            var move_to_tab_content_id = 'new_';
        }else if(new_status == 2){
            var move_to_tab_content_id = 'open';
        }else if(new_status == 3){
            var move_to_tab_content_id = 'pending';
        }else{
            var move_to_tab_content_id = 'closed';
        }

        if(old_status == 1){
            var tab_id = 'new';
        }else if(old_status  == 2){
            var tab_id = 'open';
        }else if(old_status  == 3){
            var tab_id = 'pending';
        }else{
            var tab_id = 'closed';
        }
        $("body").append('<div class="block_over"><img style="top: 50%;position: absolute;left: 50%;" class="loader_big" src="http://dashboard.semanticforce.net/images/loader_big.gif" /></div>');
        $http.post(site_url+'ajax_ws/update_msg', ObjectToParamService.convertObjectToParam(msg.data)).success(function (data) {
            if(data.status == 'success'){
                var message = msg;
                var added_msg = angular.copy(msg);
                added_msg.class = "";
                added_msg.parentID_mongo = 0;
                added_msg.data.parentRootID_mongo = msg.data.parentRootID_mongo;
                added_msg.data.mongo_id = msg.data.mongo_id;
                added_msg.data.status = msg.data.status;
                added_msg.path = MessagesFactory.calcParentPath(move_to_tab_content_id);
                MessagesFactory.recalcMsgPathAndStatus(added_msg, msg.data.status, added_msg.path);
                MessageDataService.messagesData[MessageDataService.messageTypes[msg.data.status-1]].data.msgs_in_json[MessageDataService.messageTypes[msg.data.status-1]].unshift(added_msg);
                _.remove(MessageDataService.messagesData[tab_id].data.msgs_in_json[tab_id], function (inner, indx) {
                    return inner.path.toString() == message.path.toString();
                });
                if (!(message.class.indexOf('child') != -1)) {
                    MessageDataService.messagesData[MessageDataService.messageTypes[move_from-1]].data.msgs[MessageDataService.messageTypes[move_from-1]]--;
                    MessageDataService.messagesData[MessageDataService.messageTypes[move_from-1]].data.msgs_for_user[MessageDataService.messageTypes[move_from-1]][message.data.owner]--;
                }
                MessageDataService.messagesData[MessageDataService.messageTypes[msg.data.status-1]].data.msgs[MessageDataService.messageTypes[msg.data.status-1]]++;
                if(move_to_tab_content_id != 'new_'){
                    MessageDataService.messagesData[MessageDataService.messageTypes[msg.data.status-1]].data.msgs_for_user[MessageDataService.messageTypes[msg.data.status-1]][message.data.owner]++;
                }
                $("body .block_over").remove();
            } else {
                $("body .block_over").remove();
            }
        });
    };
    return statusObject;
}

    
angular
    .module('myApp')    
    .factory('StatusFactory', StatusFactory)	
    .config([ '$locationProvider', '$httpProvider', '$rootScopeProvider', function ($locationProvider, $httpProvider, $rootScopeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $rootScopeProvider.digestTtl(Infinity);
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);