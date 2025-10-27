const { program } = require('commander');
const fs = require('fs');
const http = require('http');
const { URL } = require('url');
const { XMLBuilder } = require('fast-xml-parser');

program
  .requiredOption('-i, --input <path>', 'path to input file')
  .requiredOption('-h, --host <address>', 'host address')
  .requiredOption('-p, --port <number>', 'server port')

program.parse();
const options = program.opts();

const origin = `http://${options.host}:${options.port}`

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, origin);
    const params = new URLSearchParams(url.search);

    fs.readFile(options.input, 'utf8', (error, inputData) => {
        if (error) {
            console.error(`Error reading file: ${error}`);
            process.exit(1);
        };

        let data = JSON.parse(inputData);

        if (params.get('normal') === 'true') {
            data = data.filter(item => item.COD_STATE === 1);
        };

        if (params.get('mfo') === 'true') {
            data = data.map(item => ({
                'mfo_code': item.MFO,
                'name': item.SHORTNAME,
                'state_code': item.COD_STATE,
            }));
        } else {
            data = data.map(item => ({
                'name': item.SHORTNAME,
                'state_code': item.COD_STATE,
            }));
        };

        const nestedData = {
            banks: {
                bank: data
            }
        };

        const builder = new XMLBuilder({
            format: true,
            indentBy: '  ',
        });
        const xmlOutput = builder.build(nestedData);

        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(xmlOutput);
    });
});

server.listen(options.port, options.host, () => {
  console.log(
    `Server running at ${origin}/`
  );
});

