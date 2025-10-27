const { program } = require('commander');
const fs = require('fs');
const http = require('http');

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
});

server.listen(options.port, options.host, () => {
	console.log(
		`Server running at ${origin}/`
	);
});
