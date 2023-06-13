const data = require('./apiext/texts/temp/en_US.json');

const fs = require('fs');

let res = {};

for (let file of fs.readdirSync('./target')) fs.unlinkSync(`./target/${file}`);

for (let cat of data) {
    console.log(cat.name);
    res[cat] = [[]];
    let chunkSize = 5;
    for (let text of cat.texts) {
        chunkSize += text.text.length + 3;
        if (chunkSize >= 3000) {
            res[cat].push([]);
            chunkSize = 5 + text.text.length + 3;
        }
        res[cat][res[cat].length - 1].push(text.text);
    }

    let c = 0;
    for (let chunk of res[cat])
        fs.writeFile(
            `./target/${cat.name}-${c++}.json`,
            JSON.stringify(chunk),
            () => {},
        );
}
