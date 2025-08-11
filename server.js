const fs = require('fs');
const path = require('path');
const dotenvAbsolutePath = path.join(__dirname, '.env');
require('dotenv').config({ path: dotenvAbsolutePath });
const net = require("node:net");

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const hostname = process.env.APP_HOST || '127.0.0.1';
const port = process.env.APP_PORT || 8080;

const chalk = require('chalk');
const { version } = require("./package.json");

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const devFilePath = path.join(__dirname, 'dev-data.json');

class Server {
    dataObject = null;
    updatePending = false;
    lastOutputMessage = null;

    constructor (app, hostname, port) {
        this.app = app;
        this.hostname = hostname;
        this.port = port;
    }

    /**
     * Check if new release is out
     */
    checkVersion () {
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
                this.outputMessage(chalk.yellow(`An update is available: ${update.name}\nYou are on version ${options.currentVersion}!`));
                this.updatePending = true;
            } else {
                this.outputMessage(chalk.green(`You are up to date.`));
            }
        }).catch(function (error) {
            console.error(chalk.red(`Couldn't connect to github server to check updates.`));
        });

        return this
    }

    /**
     *
     */
    serve () {
        let serveStatic = require('serve-static');
        let portfinder = require('portfinder');
        let localIpV4Address = require("local-ipv4-address");

        localIpV4Address().then((ipAddress) => {
            portfinder.getPort({ port: this.port }, (err, port) => {
                this.app.use(serveStatic(__dirname + "/dist"));
                this.app.listen(port, () => {
                    require('child_process').exec(`start http://${this.hostname}:${port}`);

                    this.outputMessage(`*********************************************`);
                    this.outputMessage(`** Server running at http://${this.hostname}:${port}/`);
                    this.outputMessage(`** LAN access: http://${ipAddress}:${port}/`);
                    this.outputMessage(`*********************************************`);

                    this.checkPortChange(port)
                });
            });
        });

        return this
    }

    /**
     * Notify user if the port has changed
     */
    checkPortChange (port) {
        if (port !== parseInt(this.port)) {
            this.outputMessage(chalk.yellow(`Port ${this.port} is already in use. Using port ${port} instead.`));
            this.outputMessage(chalk.yellow(`Update the relevant port settings in the '\\extensions\\mycu_external_app\\ui\\config.lua' file.`));
            this.outputMessage();
        }
    }

    /**
     *
     */
    setApi () {
        /**
         * Handle data consumed by components
         */
        this.app.get('/api/data', (request, response) => {
            if (process.env.ENV === 'development' && fs.existsSync(devFilePath)){
                this.dataObject = require(devFilePath);
            }

            if (this.dataObject) {
                this.dataObject.updatePending = this.updatePending;
            }

            response.json(this.dataObject);
        });

        /**
         * Handle incoming data from X4
         */
        this.app.post('/api/data', (request, response) => {
            this.dataObject = request.body;

            if (process.env.ENV === 'development') {
                if (!fs.existsSync(devFilePath) && this.dataObject !== null) {
                    fs.writeFileSync(devFilePath, JSON.stringify(this.dataObject, null, 2));
                    this.outputMessage(chalk.green(`Development data file created at ${devFilePath}`));
                }
            }

            response.send('ok');
        });

        return this
    }

    /**
     * Output console messages in non-spammer style
     * @param message
     */
    outputMessage (message = '') {
        if (this.lastOutputMessage !== message) {
            console.log(message)
            this.lastOutputMessage = message;
        }

        return this
    }
}

const server = new Server(app, hostname, port)
server.outputMessage(chalk.green(`X4 External App Server v${version}`))
    .serve()
    .setApi()
    .checkVersion()
    .outputMessage()
