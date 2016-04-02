// ROUTES TODOS
var Hang = require('../models/hang.js');
module.exports = function(app) {

    app.get('/hang', Hang.findAll);
    app.post('/hang', Hang.create);
    app.put('/hang/:id', Hang.update);
    app.delete('/hang/:id', Hang.delete);

};
