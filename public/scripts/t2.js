const translate = require('google-translate-api-x');
const fs = require('fs');

async function run() {
    let files = fs.readdirSync(`../target`);
    let idx = 0;

    async function t2() {
        if (idx >= files.length) return;
        console.log(`Translating ${files[idx]}`);

        let data = require(`../target/${files[idx]}`);
        try {
            const res = await translate(data, { from: 'ja', to: 'en' });
            console.log('Done! Saving...');
            fs.writeFileSync(
                `./out/${files[idx]}`,
                JSON.stringify(res),
                () => {},
            );
            fs.unlink(`../target/${files[idx]}`, () => {});

            console.log(`Completed ${files[idx++]}`);
            setTimeout(() => {
                t2();
            }, 1000);
        } catch (err) {
            console.log(err);
            setTimeout(() => {
                t2();
            }, 1000);
            return;
        }
    }

    t2();
}

run();
