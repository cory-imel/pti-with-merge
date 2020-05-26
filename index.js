// const pdf2img = require('pdf2img');
const Pdf2Img = require('pdf2img-promises');
const mi      = require('./lib/merge_images');

const args = process.argv.slice(2);
const input   = args[0];
const outputdir = args[1];
const outputname = args[2];


let converter = new Pdf2Img();

// The event emitter is emitting to the file name
converter.on(input, (msg) => {
    console.log('Received: ', msg);
});

converter.setOptions({
    type: 'png',                                // png or jpg, default jpg
    size: 1024,                                 // default 1024
    density: 600,                               // default 600
    quality: 100,                               // default 100
    outputdir: outputdir,                       // output folder, default null (if null given, then it will create folder name same as file name)
    outputname: outputname,                      // output file name, dafault null (if null given, then it will create image name same as input name)
    page: null                                  // convert selected page, default null (if null given, then it will convert all pages)
});

//reads the full pdf and creates a new png for each page
converter.convert(input)
    .then(info => {
        console.log(info);
        //calls the file merging code
        mi.merge(outputdir, outputname)
            .then(newFiles => {
                console.log(newFiles)
            })
            .catch(err => {
                console.error(err);
            });
    });