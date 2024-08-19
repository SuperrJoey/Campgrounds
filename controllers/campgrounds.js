const Scene = require('../models/scene')

module.exports.index = async (req, res) => {
    const campgrounds = await Scene.find({})
    res.render('campgrounds/index', {campgrounds})
 }

 module.exports.rendernewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = (async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Scene(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`);

})

module.exports.showCampground = (async (req, res) => {
    const campground = await Scene.findById(req.params.id).populate({
        path: 'reviews',
    populate: {
        path: 'author'
    }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground});
})

module.exports.renderEditForm = (async (req, res) => {
    const { id } = req.params;
    const campground = await Scene.findById(id)
        if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
        if(!campground.author.equals(req.user._id)){
            req.flash('error', 'You do not have permission to do that');
            req.redirect(`/campgrounds/${id}`);
        }
        res.render('campgrounds/edit', { campground });
})

module.exports.updateCampground = (async (req, res) => {
    const { id } = req.params;
    const campground = await Scene.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        req.redirect(`/campgrounds/${id}`);
    }
    const camp = await Scene.findByIdAndUpdate(req.params.id, {...req.body.campground});   
    //"..req.body.campground" basically this means we are creating a shallow copy of the 'campground' object from the req.body
    //useful when updating a document in a mongoDB databse using mongoose, as it allows to pass the updated properties directly from the req body
    
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteCampground = (async (req, res) => {
    const { id } = req.params;
    await Scene.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})