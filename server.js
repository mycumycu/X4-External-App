const fs = require('fs');
const path = require('path');
const dotenvAbsolutePath = path.join(__dirname, '.env');
require('dotenv').config({ path: dotenvAbsolutePath });
const net = require("node:net");

let express = require('express');
let app = express();

const hostname = process.env.APP_HOST || '127.0.0.1';
const port = process.env.APP_PORT || 8080;

const chalk = require('chalk');
const { version } = require("./package.json");

class Server {
    dataObject = {};
    updatePending = false;
    lastOutputMessage = null;
    invalidDataStreamTimeout = null;

    constructor(app, hostname, port) {
        this.app = app;
        this.hostname = hostname;
        this.port = port;
    }

    /**
     * Check if new release is out
     */
    async checkVersion() {
        const versionCheck = require('github-version-checker');
        const { version } = require('./package.json');

        const options = {
            token: '',
            repo: 'X4-External-App',
            owner: 'mycumycu',
            currentVersion: version,
        };

        await versionCheck(options, null).then((update) => {
            if (update) { // update is null if there is no update available, so check here
                this.outputMessage(chalk.yellow(`An update is available: ${update.name}\nYou are on version ${options.currentVersion}!`));
                this.updatePending = true;
            } else {
                this.outputMessage(chalk.green(`You are up to date.`));
            }
        }).catch(function (error) {
            console.error(chalk.red(`Couldn't connect to github server to check updates.`));
        });
    }

    /**
     *
     */
    async serve() {

        let serveStatic = require('serve-static');
        let portfinder = require('portfinder');
        let localIpV4Address = require("local-ipv4-address");

        await localIpV4Address().then((ipAddress) => {
            portfinder.getPort({ port: this.port }, (err, port) => {
                this.app.use(serveStatic(__dirname + "/dist"));
                this.app.listen(port, () => {
                    require('child_process').exec(`start http://${this.hostname}:${port}`);
                    this.outputMessage(`*********************************************`);
                    this.outputMessage(`** Server running at http://${this.hostname}:${port}/`);
                    this.outputMessage(`** LAN access: http://${ipAddress}:${port}/`);
                    this.outputMessage(`*********************************************`);
                });
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
        this.outputMessage(`Connecting to pipe ${process.env.PIPE_NAME}...`);
        const stream = net
          .createConnection(process.env.PIPE_NAME)
          .on("error", () => {
            this.dataObject = null;
            this.outputMessage("Disconnected from pipe. Retrying...");
            setTimeout(() => {
              return this.readFromPipe();
            }, 2000);
          });
    
        stream.on("connect", function () {
          console.log("Connected");
        });
    
        //stream.setEncoding('utf8');
        stream
          .on("data", (d) => {
            try {
              let buffer = Buffer.from(d);
              this.dataObject = JSON.parse(buffer.toString());
              this.outputMessage("Correct data stream received.");
              this.endInvalidStreamTimer();
            } catch (e) {
              this.outputMessage("Invalid data stream format.");
              this.startInvalidStreamTimer();
            }
    
            if (d.toString().trim() === "[stdin end]") {
              return process.nextTick(() => {
                console.log(process.argv.slice(2));
              });
            }
            process.argv.push(d.toString());
          })
          .on("end", () => {
            this.dataObject = null;
            this.outputMessage("Disconnected from pipe. Retrying...");
            this.readFromPipe();
          });
    
        setInterval(() => {
          if (stream) {
            stream.write("\n");
          }
        }, 20);
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

                try {
                    //data = data.replace(/\\/g, '')
                    this.dataObject = JSON.parse(data);
                    this.outputMessage(`${chalk.yellowBright('Development mode')} - reading data from file successful`);
                    this.endInvalidStreamTimer();
                } catch (e) {
                    this.outputMessage('Invalid data stream format.');
                    this.startInvalidStreamTimer()
                }
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

    /**
     * Show "there's no water" message if there's incorrect data for long enough
     */
    startInvalidStreamTimer() {
        if (!this.invalidDataStreamTimeout) {
            this.invalidDataStreamTimeout = setTimeout(() => {
                this.dataObject = null;
            }, 10000)
        }
    }

    /**
     *
     */
    endInvalidStreamTimer() {
        clearTimeout(this.invalidDataStreamTimeout);
        this.invalidDataStreamTimeout = null;
    }

    /**
     * @returns {Promise<void>}
     */
    async start() {
        this.outputMessage(chalk.green(`X4 External App Server v${version}`));
        await this.serve()
        await this.checkVersion();
        this.setApi();
        this.outputMessage('');
        this.dataFeed();
    }
}

let server = new Server(app, hostname, port);
server.start()