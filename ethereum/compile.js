const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//delete the build
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
//get contracts content
const campaignPath = path.resolve(__dirname,'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts
//recreate the build folder
fs.ensureDirSync(buildPath);
//loop and output the data
for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    );
}