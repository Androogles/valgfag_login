const path = require('path');


module.exports = (app) => {
    // ====================   Admin Index   ====================
    app.get('/admin/index', (req, res) => {
        (async () => {
            try {
                res.render('pages/admin_index', {
                    "title": "Home",
                    "page": "admin_index",
                    "session": req.session,
                });

            } catch (error) {
                console.log(error);
            }
        })();
    });
}