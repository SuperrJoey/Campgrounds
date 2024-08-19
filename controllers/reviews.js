const Scene = require('../models/scene');
const Review = require('../models/review');

module.exports.newReview = (async (req, res) => {
    const campground = await Scene.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
}) 

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Scene.findByIdAndUpdate(id, {$pull : { reviews: reviewId}});
    //$pull is a mongodb operator that removes elements from an array that match a specified condition
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}