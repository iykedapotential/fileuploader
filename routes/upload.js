var express = require('express');
var router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    busboy = require('connect-busboy');

router.use(busboy({
    highWaterMark: 2 * 1024 * 1024,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}));

/* POST image listing. */
router.post('/', function(req, res) {
    try {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log("Uploading: " + filename, "FileType: "+ mimetype);
            console.log(req.files);
            fstream = fs.createWriteStream(path.join(__dirname, '../uploads/' + filename));
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("files saved");
                var file = path.join(__dirname, '../uploads/'+ filename);
                res.status(200).json({status: "success", url: file});
            });
        });
    }
    catch(err) {
        res.status(500).send('Something broke!');
    }

});

module.exports = router;
