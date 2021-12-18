const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        // Link expired
        if(!file) {
            return res.render('download', { error: 'Link has been expired.'});
        } 
        const size=(file.size)/1000;
        console.log(size);
        return res.render('download', { 
            uuid: file.uuid, 
            fileName: file.filename, 
            fileSize: size, 
            downloadLink: `/files/download/${file.uuid}` });
    } catch(err) {
        return res.render('download', { error: 'Something went wrong.'});
    }
});


module.exports = router;