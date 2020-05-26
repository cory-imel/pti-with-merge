"use strict";

const gm   = require('gm');
const fs   = require('fs');
const util = require('util');


class Merge {
    
    static async merge(filepath, name) {
        try{
            console.log("Reading files");
            let files = fs.readdirSync(filepath);
            return await this.write_files(files, filepath, name)
        } catch (e) {
            throw new Error(e);
        }
        
    }
    
    //writes the new combined png files
    static async write_files(files, filepath, name) {
    return new Promise((resolve, reject) => {
        try {
            //the template filename from the third parameter
            let prefix = name;
            //this assumes that page 1 is the front of a single page
            let front = 1;
            // this assumes page 2 is the back
            let back = 2;
            //used to create new filenames
            let i = 0;
            let newFiles = [];
            while (back < files.length) {
                // if temp was the third parameter this is looking for "temp_1.pdf" as the first page
                let frontFile = files[files.indexOf(prefix + "_" + front + ".png")];
                // if temp was the third parameter this is looking for "temp_2.pdf" as the second page
                let backFile = files[files.indexOf(prefix + "_" + back + ".png")];
                //this is the new file name
                newFiles.push(filepath + "/" + prefix + "_combined_" + i + ".png");
                // setting up for the append
                let img = gm(filepath + "/" + frontFile);
                img.append(filepath + "/" + backFile);
                img.write(filepath + "/" + prefix + "_combined_" + i + ".png", function (err) {
                    if (err) console.log(err);
                    //deleteing the old files
                    fs.unlinkSync(filepath + "/" + frontFile);
                    fs.unlinkSync(filepath + "/" + backFile);
                    console.log("Deleted " + frontFile + " & " + backFile);
                });
                //moving to the next two pages
                front = front + 2;
                back = back + 2;
                i = i + 1;
            }
            resolve(newFiles)
        } catch (e) {
            reject("Wasn\'t able to write the output file. " + e)
        }
    })
    }
}

module.exports = Merge;
