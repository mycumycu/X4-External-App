const fs = require('fs');
const path = require('path');
const dotenvAbsolutePath = path.join(__dirname, '.env');
require('dotenv').config({ path: dotenvAbsolutePath });

let express = require('express');
let app = express();

const hostname = process.env.APP_HOST || '127.0.0.1';
const port = process.env.APP_PORT || 8080;


class Server {
    dataObject = {};
    updatePending = false;
    lastOutputMessage = null;

    constructor(app, hostname, port) {
        this.app = app;
        this.hostname = hostname;
        this.port = port;
    }

    /**
     * Check if new release is out
     */
    checkVersion() {
        const versionCheck = require('github-version-checker');
        const { version } = require('./package.json');

        const options = {
            token: '',
            repo: 'X4-External-App',
            owner: 'mycumycu',
            currentVersion: version,
        };

        versionCheck(options, null).then((update) => {
            if (update) { // update is null if there is no update available, so check here
                console.log("An update is available! " + update.name);
                console.log("You are on version " + options.currentVersion + "!");
                this.updatePending = true;
            } else {
                console.log("You are up to date.");
            }
        }).catch(function (error) {
            console.error(error);
        });

        this.outputMessage(`X4 External App Server v${version}`);
    }

    /**
     *
     */
    serve() {
        let serveStatic = require('serve-static');
        let portfinder = require('portfinder');
        portfinder.getPort({ port: this.port }, (err, port) => {
            this.app.use(serveStatic(__dirname + "/dist"));
            this.app.listen(port, this.hostname, () => {
                require('child_process').exec(`start http://${this.hostname}:${port}`);
                console.log(`Server running at http://${this.hostname}:${port}/`);
            });


        });
    }

    /**
     * Read from a named pipe or file
     */
    dataFeed() {
        process.env.DATA_SOURCE === 'pipe' ? this.readFromPipe() : this.readFromFile();
    }

    /**
     *
     */
    readFromPipe() {
        try {
            const fd = fs.openSync(process.env.PIPE_NAME, 'r+')

            const stream = fs.createReadStream(null, { fd })
            //stream.setEncoding('utf8');
            stream.on('data', (d) => {
                try {
                    let buffer = Buffer.from(d);
                    this.dataObject = JSON.parse(buffer.toString());
                    this.outputMessage('Correct data stream received.');
                } catch (e) {
                    this.dataObject = null;
                    this.outputMessage('Invalid data stream format.');
                }

                if (d.toString().trim() === '[stdin end]') {
                    return process.nextTick(() => {
                        console.log(process.argv.slice(2))
                    })
                }
                process.argv.push(d.toString())
            }).on('error', () => {
                this.dataObject = null;
                this.outputMessage('Disconnected from pipe. Retrying...')
                this.readFromPipe();

            })
        } catch (e) {
            this.dataObject = null;
            this.outputMessage('Pipe data stream not yet ready. Retrying... ');
            setTimeout(() => {
                this.readFromPipe();
            }, 2000)
        }
    }

    /**
     * Development method
     */
    readFromFile() {
        const chokidar = require('chokidar')

        chokidar.watch(process.env.DEV_FILE_PATH).on('all', (event, path) => {
            fs.readFile(process.env.DEV_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }

                data = data.replace(/\\/g, '')
                this.dataObject = JSON.parse(data);
                console.log('Development mode - reading data from file successful');
            });
        })
    }

    /**
     *
     */
    setApi() {
        this.app.get('/api/data', (req, res) => {
            if (this.dataObject) {
                this.dataObject.updatePending = this.updatePending;
            }
            res.json(this.dataObject);
        });
    }

    /**
     * Output console messages in non-spammer style
     * @param message
     */
    outputMessage(message) {
        if (this.lastOutputMessage !== message) {
            console.log(message)
            this.lastOutputMessage = message;
        }
    }
}

let server = new Server(app, hostname, port);
server.checkVersion();
server.dataFeed();
server.setApi();
server.serve();