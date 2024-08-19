const mongoose = require('mongoose');
const { descriptors } = require('../seeds/seedHelpers');
const Schema = mongoose.Schema;


const RapSceneSchema = new Schema({
    Title: String,
    image: String,
    Location: String,
    price: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//this middleware deletes the reviews incase we delete the campground. 
//this type of middleware is called query middleware
RapSceneSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Scene', RapSceneSchema);