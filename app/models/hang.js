// MODEL TODO
var mongoose = require('mongoose');


var hangSchema = new mongoose.Schema({
    description: String
});

var Hang = {

    model: mongoose.model('Hang', hangSchema),

    create: function(req, res) {
        Hang.model.create({
            description: req.body.description
        }, function() {
            res.sendStatus(200);
        });
    },

    findAll: function(req, res) {
        Hang.model.find(function(err, data) {
            res.send(data);
        });
    },

    update: function(req, res) {
        Hang.model.findByIdAndUpdate(req.params.id, {
            description: req.body.description
        }, function() {
            res.sendStatus(200);
        });
    },

    delete: function(req, res) {
        Hang.model.findByIdAndRemove(req.params.id, function() {
            res.sendStatus(200);
        });
    }
};

module.exports = Hang;
