const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require("fast-csv");
const md5 = require('md5');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/', function (req, res, next) {
    //console.log(req);
    // console.log(req.files.csv);
    //console.log(req.files);
    console.log(req.files.csv);
    let filename = md5(req.files.csv + new Date() + '.csv');
    let file = req.files.csv;
    let path = __dirname + '/../tmp/csv/' + filename;
    //console.log(path);
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            res.json({});
        } else {
            let array = [];
            fs.createReadStream(path)
                .pipe(csv())
                .on("data", function (data) {
                    // console.log(data);
                    // console.log('====');
                    if (array.length < 1000 ){
                        for(let i = 0; i < data.length; i++){
                            let regex = /^[\w.+\-]+@gmail\.com$/i;
                             if(data[i].match(regex) ){
                                array.push(data[i]);
                                break;
                              }
                        }
                    }else {
                        console.log(array);
                        array = [];
                    }
                })
                .on("end", function (e_data) {
                    console.log(array);
                    console.log(e_data);
                    console.log("done");
                });
        }
    });
});


module.exports = router;
