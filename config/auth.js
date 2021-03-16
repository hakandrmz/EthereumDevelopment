module.exports = {
    ensureAuthenticated: function (req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg','Oylama Sayfasını görmeniz için giriş yapmanız gerekmektedir');
        res.redirect('/users/login');
    }
}