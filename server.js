import express from 'express';
import path from 'path';
import { existsSync, createReadStream, createWriteStream } from 'fs';

const DATA_FOLDER = './counts';
const open_files = {};

// https://stackoverflow.com/a/41439945/4415398
const countFileLines = filePath => new Promise((resolve, reject) => {
    if (!existsSync(filePath)) {
        resolve(0)
    } else {
        let lineCount = 0;
        createReadStream(filePath)
            .on("data", buffer => {
                let idx = -1;
                lineCount--; // Because the loop will run once for idx=-1
                do {
                    idx = buffer.indexOf(10, idx+1);
                    lineCount++;
                } while (idx !== -1);
            })
            .on("end", () => resolve(lineCount))
            .on("error", reject);
    }
});

const ensure_open_file = async name => {
    if (!open_files[name]) {
        const filepath = path.join(DATA_FOLDER, name)
        const f = createWriteStream(filepath, {flags:'a'})
        const count = await countFileLines(filepath)
        open_files[name] = {f, count}
    }
    return open_files[name]
};

const app = express();

app.use(express.static('dist'))

app.get('/api/counter/:name', async (req, res) => {
    const ctx = await ensure_open_file(req.params.name)
    res.send(JSON.stringify({
        [req.params.name]: ctx.count
    }));
});

app.post('/api/counter/:name', async (req, res) => {
    const ctx = await ensure_open_file(req.params.name)
    ctx.f.write((new Date()).getTime() + "\n")
    ctx.count += 1;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        [req.params.name]: ctx.count
    }));
})

app.listen(50000, () =>
    console.log('Example app listening on port 50000!'),
);