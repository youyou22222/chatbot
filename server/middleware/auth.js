exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');  // Redirect to login page if not authenticated

    }
};
