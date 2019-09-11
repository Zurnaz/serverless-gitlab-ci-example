"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const _ = require("lodash");
const request = require("request");
const semver = require("semver");
class IOpipeLayerPlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.hooks = {
            "after:deploy:function:packageFunction": this.cleanup.bind(this),
            "after:package:createDeploymentArtifacts": this.cleanup.bind(this),
            "before:deploy:function:packageFunction": this.run.bind(this),
            "before:package:createDeploymentArtifacts": this.run.bind(this)
        };
    }
    get config() {
        return _.get(this.serverless, "service.custom.iopipe", {});
    }
    get functions() {
        return Object.assign.apply(null, this.serverless.service
            .getAllFunctions()
            .map(func => ({ [func]: this.serverless.service.getFunction(func) })));
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = this.serverless.getVersion();
            if (semver.lt(version, "1.34.0")) {
                this.serverless.cli.log(`Serverless ${version} does not support layers. Please upgrade to >=1.34.0.`);
                return;
            }
            const plugins = _.get(this.serverless, "service.plugins", []);
            this.serverless.cli.log(`Plugins: ${JSON.stringify(plugins)}`);
            // if (
            //   plugins.indexOf("serverless-webpack") >
            //   plugins.indexOf("serverless-iopipe-layers")
            //   
            // ) {
            //   this.serverless.cli.log(
            //     "serverless-iopipe-layers plugin must come after serverless-webpack in serverless.yml; skipping."
            //   );
            //   return;
            // }
            const funcs = this.functions;
            Object.keys(funcs).forEach((funcName) => __awaiter(this, void 0, void 0, function* () {
                const funcDef = funcs[funcName];
                yield this.addLayer(funcName, funcDef);
            }));
        });
    }
    cleanup() {
        this.removeNodeHelper();
    }
    addLayer(funcName, funcDef) {
        return __awaiter(this, void 0, void 0, function* () {
            this.serverless.cli.log(`Adding IOpipe layer to ${funcName}`);
            const region = _.get(this.serverless.service, "provider.region");
            if (!region) {
                this.serverless.cli.log("No AWS region specified for IOpipe layer; skipping.");
                return;
            }
            const { environment = {}, handler, runtime = _.get(this.serverless.service, "provider.runtime"), layers = [], package: pkg = {} } = funcDef;
            if (!this.config.token && !environment.IOPIPE_TOKEN) {
                this.serverless.cli.log(`No IOpipe token specified for "${funcName}"; skipping.`);
                return;
            }
            if (typeof runtime !== "string" ||
                [
                    "nodejs10.x",
                    "nodejs6.10",
                    "nodejs8.10",
                    "python2.7",
                    "python3.6",
                    "python3.7"
                ].indexOf(runtime) === -1) {
                this.serverless.cli.log(`Unsupported runtime "${runtime}" for Iopipe layer; skipping.`);
                return;
            }
            const { exclude = [] } = this.config;
            if (_.isArray(exclude) && exclude.indexOf(funcName) !== -1) {
                this.serverless.cli.log(`Excluded function ${funcName}; skipping`);
                return;
            }
            const layerArn = this.config.layer_arn ? this.config.layer_arn : yield this.getLayerArn(runtime, region);
            const iopipeLayers = layers.filter(layer => typeof layer === "string" && layer.match(layerArn));
            if (iopipeLayers.length) {
                this.serverless.cli.log(`Function "${funcName}" already specifies an IOpipe layer; skipping.`);
            }
            else {
                if (typeof this.config.prepend === "boolean" && this.config.prepend) {
                    layers.unshift(layerArn);
                }
                else {
                    layers.push(layerArn);
                }
                funcDef.layers = layers;
            }
            environment.IOPIPE_HANDLER = handler;
            environment.IOPIPE_DEBUG =
                typeof environment.IOPIPE_DEBUG !== "undefined"
                    ? environment.IOPIPE_DEBUG
                    : this.config.debug || false;
            environment.IOPIPE_TOKEN = environment.IOPIPE_TOKEN
                ? environment.IOPIPE_TOKEN
                : this.config.token;
            funcDef.environment = environment;
            funcDef.handler = this.getHandlerWrapper(runtime, handler);
            funcDef.package = this.updatePackageExcludes(runtime, pkg);
        });
    }
    getLayerArn(runtime, region) {
        return __awaiter(this, void 0, void 0, function* () {
            return util.promisify(request)(`https://${region}.layers.iopipe.com/get-layers?CompatibleRuntime=${runtime}`).then((response) => {
                const awsResp = JSON.parse(response.body);
                return _.get(awsResp, "Layers[0].LatestMatchingVersion.LayerVersionArn");
            });
        });
    }
    getHandlerWrapper(runtime, handler) {
        if (["nodejs6.10", "nodejs8.10"].indexOf(runtime) !== -1 ||
            (runtime === "nodejs10.x" &&
                _.get(this.serverless, "enterpriseEnabled", false))) {
            this.addNodeHelper();
            return "iopipe-wrapper.handler";
        }
        if (runtime === "nodejs10.x") {
            return "/opt/nodejs/node_modules/@iopipe/iopipe.handler";
        }
        if (runtime.match("python")) {
            return "iopipe.handler.wrapper";
        }
        return handler;
    }
    addNodeHelper() {
        const helperPath = path.join(this.serverless.config.servicePath, "iopipe-wrapper.js");
        if (!fs.existsSync(helperPath)) {
            fs.writeFileSync(helperPath, "module.exports = require('@iopipe/iopipe');");
        }
    }
    removeNodeHelper() {
        const helperPath = path.join(this.serverless.config.servicePath, "iopipe-wrapper.js");
        if (fs.existsSync(helperPath)) {
            fs.removeSync(helperPath);
        }
    }
    updatePackageExcludes(runtime, pkg) {
        if (!runtime.match("nodejs")) {
            return pkg;
        }
        const { exclude = [] } = pkg;
        exclude.push("!iopipe-wrapper.js");
        pkg.exclude = exclude;
        return pkg;
    }
}
exports.default = IOpipeLayerPlugin;
module.exports = IOpipeLayerPlugin;
