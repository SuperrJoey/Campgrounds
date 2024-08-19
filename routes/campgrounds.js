const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const Scene = require('../models/scene');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCamp, isAuthor } = require('../middleware');

router.get('/', catchAsync(campgrounds.index));

//isLoggedIn is a middleware exported from middleware.js
router.get('/new', isLoggedIn, campgrounds.rendernewForm)

router.post('/', validateCamp, catchAsync(campgrounds.createCampground));

router.get('/:id', isLoggedIn, catchAsync(campgrounds.createCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, 
    catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.updateCampground));

router.delete('/campgrounds/:id', catchAsync(campgrounds.deleteCampground));

module.exports = router;