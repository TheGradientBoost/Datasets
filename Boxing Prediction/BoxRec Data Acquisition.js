const boxrec = require("boxrec").Boxrec;
const fastcsv = require('fast-csv');
const fs = require('fs');
//this it to login to your boxrec account
async function getCookieJar(){
    try {
        const cookieJar = await boxrec.login('***','***');
        return cookieJar;
    } catch (e) {
        console.log("Login error: " + e);
    }
};
async function writeData() {
    const csv = require('csv-parser')
    const results = [];
    // insert file directory with list of boxers
    // fs.createReadStream('')
        .pipe(csv())
        .on('data',(data)=> results.push(data))
        .on('end', async () => {
          const cookieJar = await getCookieJar();
          const promises = [];
          results.forEach((data) => {
            promises.push(boxrec.getPersonById(cookieJar,data.id));
          })
          const fighters = await Promise.all(promises); 
          fighters.forEach((fighter) => {
              let data = '';
              for (const key in fighter.output) {
                  if (Array.isArray(fighter.output[key])) {
                      data += JSON.stringify(fighter.output[key]) + ',';
                  } else if (typeof fighter.output[key] === 'object') {
                      data += JSON.stringify(fighter.output[key]) + ',';
                  } else {
                      data += fighter.output[key] + ',';
                  }
              }
              data = data.replace(/(^,)|(,$)/g, "");
              data += '\n';
              //location of output - where are you saving this
              // fs.appendFile('',data, (err) => {
                  if (err) throw err;
              });
          });
        });
    };
try {
    writeData();
} catch (error) {
    console.log("Error in writeData: " + error);
}