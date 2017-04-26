
// grab the mongoose module
var mongoose = require('mongoose');

// define our canvas model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Canvas', {
    name : {type : String, default: ''}
});
