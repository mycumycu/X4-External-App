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

const isPackaged = !!process.pkg;
const runtimeDir = isPackaged ? path.dirname(process.execPath) : __dirname;
const devFilePath = path.join(runtimeDir, 'dev-data.json');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

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
        }).catch(function () {
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
                this.app.use(serveStatic(path.join(__dirname, 'dist'), {
                    etag: false,
                    lastModified: false,
                    cacheControl: false,
                    maxAge: 0,
                    setHeaders: (res) => {
                        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', '0');
                        res.setHeader('Surrogate-Control', 'no-store');
                    }
                }));
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
            if (!isPackaged && fs.existsSync(devFilePath)) {
                try {
                    // In local env - load from file
                    const raw = fs.readFileSync(devFilePath, 'utf8');
                    this.dataObject = JSON.parse(raw);
                } catch (e) {
                    console.error(chalk.red(`Failed to load ${devFilePath}:`), e);
                }
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

            if (!isPackaged) {
                try {
                    if (!fs.existsSync(devFilePath) && this.dataObject != null) {
                        // In local env: create dev-data.json
                        fs.writeFileSync(devFilePath, JSON.stringify(this.dataObject, null, 2));
                        this.outputMessage(chalk.green(`Development data file created at ${devFilePath}`));
                    }
                } catch (e) {
                    console.error(chalk.red(`Failed to write ${devFilePath}:`), e);
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
