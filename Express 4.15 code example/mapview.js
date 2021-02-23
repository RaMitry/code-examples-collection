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
    locals.section = 'mapview';


    function distanceFilter(next) {

        locals.long_req = 14.0;
        locals.lat_req = 52.0;
        locals.distance_req = 21000000;

        if(typeof(req.query.location) !== "undefined" && req.query.location !== "") {
            var location_req = req.query.location.split(',');
            locals.long_req = parseFloat(location_req[0]);
            locals.lat_req = parseFloat(location_req[1]);
            locals.distance_req = 10000;

            next();
        } else {
            next();
        }

    }

    function sessionVars(){

        if(typeof(req.query.placename) !== "undefined" && req.query.placename !== "") {

            req.session.placename = req.query.placename;
            locals.placename = req.query.placename;
        } else if (typeof(req.session.placename) !== "undefined" && req.session.placename !== "") {

            locals.placename = req.session.placename;
        }

    }


    view.on('init', function (next) {

        if(typeof(req.query.mapcoord) !== "undefined" && req.query.mapcoord === "1") {
            locals.mapcoord = 1;
        }

        distanceFilter(next);

    });


    sessionVars();

    view.render('dashboard-new/static-pages/mapview.ejs');

};