var keystone = require('keystone');

exports = module.exports = function (req, res) {

    var engine = require('ejs-locals');
    keystone.init({
        'custom engine': engine,
        'view engine': 'ejs'
    }); 
    
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Init locals
    locals.section = 'myobjects';

    function getVotes(objects_list, next) {

         if (objects_list.length <= 0) {
                next(null);
            }

            var shifted_obj = objects_list.shift();

            locals.data.push(shifted_obj);

            var qv = keystone.list('Vote').model.where('object', shifted_obj._id)
                .populate('object')
                .populate('user')
                .maxTime(6000);

                qv.exec(function (err, result) {

                locals.votes.push(result);

                    if (objects_list.length > 0) {
                        getVotes(objects_list, next);
                    } else {
                        next(null);
                    }
                });

    }

    function getTopCategories (next) {
        var qc = keystone.list('Category').model.where('level', 1);
        qc.exec(function (err, categories) {
            locals.categories = categories;
            next(err);
        });
    }

    function getCategoriesIdsAndUndefined () {
        view.on('init', function (next) {

            var categories_ids = [];

            if(locals.categories.length > 0) {
                for (var j = 0; j < locals.categories.length; j++) {
                    categories_ids.push(locals.categories[j]._id);
                }
            }

            locals.category_req = categories_ids;
            locals.category_req.push(undefined);

            next();

        });
    }

    function getRequestedCategoryNameAndId() {
        view.on('init', function (next) {

            if(typeof(req.query.category) !== "undefined" && req.query.category !== "" && req.query.category !== "All") {
                var category_req_name = req.query.category;

                var qcc = keystone.list('Category').model.findOne({ name: category_req_name });
                qcc.exec(function (err, category) {
                    locals.loc_category_name = category.name;
                    locals.category_req = category._id;
                    next(err);
                });
            } else {
                next();
            }
        });
    }

    function nearbyFilter() {

        locals.long_req = 14.0;
        locals.lat_req = 52.0;
        locals.distance_req = 22000000;

        if(typeof(req.query.location) !== "undefined" && req.query.location !== "") {
            var location_req = req.query.location.split(',');
            locals.long_req = parseFloat(location_req[0]);
            locals.lat_req = parseFloat(location_req[1]);
            locals.distance_req = 21000000;
            if (typeof req.query.nearby !== "undefined" || req.query.nearby === "1") {
                locals.distance_req = 4999;
                locals.nearby = 1;
            }

        }

    }

    function sortParameters() {

        locals.sort_parameters = [['publishedDate', -1]];
        locals.sort_parameters_obj = {publishedDate: -1};

        if(typeof(req.query.filter) !== "undefined" && req.query.filter !== "") {

            var filter_req = req.query.filter;

            if(filter_req.length > 0) {
                if(filter_req.indexOf("nameaz") > -1){
                    locals.sort_parameters.unshift(['name', 1]);
                    locals.sort_parameters_obj.name = 1;
                }else if(filter_req.indexOf("nameza") > -1){
                    locals.sort_parameters.unshift(['name', -1]);
                    locals.sort_parameters_obj.name = -1;
                }
            }

        }

    }

    function respFilter() {

        locals.respgrater = 0;
        locals.resplower = 1000000000;

        locals.respfilter = [
            {'totalVotes': {"$gte": locals.respgrater, "$lte": locals.resplower}}
        ];

        if(typeof(req.query.resp) !== "undefined" && req.query.resp !== "") {
            var resp_req = req.query.resp;



            if(resp_req.indexOf("respnull") > -1){
                locals.resplower = 0;
                locals.resp = -1;
            }else if(resp_req.indexOf("respone") > -1){
                locals.respgrater = 1;
                locals.resplower = 10;
                locals.resp = 1;
            }else if(resp_req.indexOf("respeleven") > -1){
                locals.respgrater = 11;
                locals.resplower = 100;
                locals.resp = 11;
            }else if(resp_req.indexOf("respmore") > -1){
                locals.respgrater = 101;
                locals.resp = 101;
            }

            locals.respfilter = [
                {'totalVotes': {"$gte": locals.respgrater, "$lte": locals.resplower}}
            ];

        } else {
            locals.respfilter.push({'totalVotes': {"$exists": false}});
        }

    }

    function raitingsFilter() {

        locals.raitsfilter = [
            {'raitStatus': {"$gte": 0, "$lte": 100}}
        ];

        if(typeof(req.query.raits) !== "undefined" && req.query.raits !== "") {
            var raits_req = req.query.raits;

            if(raits_req === "raitsnull"){
                locals.raits = 0;
            }else if(raits_req === "goodonly"){
                locals.raits = 1;
            }else if(raits_req === "badonly"){
                locals.raits = 2;
            }else if(raits_req === "goodmore"){
                locals.raits = 11;
            }else if(raits_req === "badmore"){
                locals.raits = 12;
            }else if(raits_req === "equal"){
                locals.raits = 100;
            }

            locals.raitsfilter = [
                {'raitStatus': locals.raits}
            ];

        } else {
            locals.raitsfilter.push({'raitStatus': {"$exists": false}});
        }

    }

    function getRequestedObjectPagesAndRender() {
        view.on('init', function (next) {

            var q = keystone.list('Object').paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10,
                filters: {
                    'owner': locals.user,
                    'category': { "$in": locals.category_req },
                    'loc.geo': {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [locals.long_req, locals.lat_req]
                            },
                            $minDistance: 0,
                            $maxDistance: parseFloat(locals.distance_req)
                        }
                    },
                    '$and': [
                        {'$or': locals.respfilter},
                        {'$or': locals.raitsfilter}
                    ]
                }
            })
            //.where({'owner': locals.user, 'category': { "$in": category_req }})//, 'category': category_req
                .sort(locals.sort_parameters)
                .populate('owner')
                .populate('category');

            q.exec(function (err, results) {
                locals.data = [];
                locals.votes = [];
                locals.current_objects_page =  results.currentPage;
                locals.total_objects_pages =  results.totalPages;
                locals.objects_page_array =  results.pages;
                locals.previous_objects_page_index =  results.previous;
                locals.next_objects_page_index =  results.next;
                locals.first_object_index =  results.first;
                locals.last_object_index =  results.last;
                if (typeof results !== "undefined" && results.results.length > 0) {
                    getVotes(results.results, next, 0, 0);
                } else {
                    next(null);
                }
            });

        });


        view.render('dashboard-new/my-objects.ejs');
    }


    view.on('init', function (next) {

        if(typeof(req.query.mapcoord) !== "undefined" && req.query.mapcoord === "1") {
            locals.mapcoord = 1;
        }

        getTopCategories(next);

    });

    getCategoriesIdsAndUndefined();

    getRequestedCategoryNameAndId();

    nearbyFilter();

    sortParameters();

    respFilter();

    raitingsFilter();

    getRequestedObjectPagesAndRender();


};



