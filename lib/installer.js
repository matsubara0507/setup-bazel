"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBazelWithVersion = void 0;
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const fs = __importStar(require("fs"));
function installBazelWithVersion(baseInstallDir, version) {
    if (!baseInstallDir) {
        throw new Error('baseInstallDir parameter is required');
    }
    if (!version) {
        throw new Error('versionSpec parameter is required');
    }
    switch (process.platform) {
        case 'linux':
            _installBazelWithVersionForLinux(baseInstallDir, version);
            break;
        case 'darwin':
            _installBazelWithVersionForMac(baseInstallDir, version);
            break;
        default:
            throw new Error(`unsupported OS: ${process.platform}`);
    }
}
exports.installBazelWithVersion = installBazelWithVersion;
function _installBazelWithVersionForLinux(baseInstallDir, version) {
    return __awaiter(this, void 0, void 0, function* () {
        var tmpOutput = baseInstallDir + '/bazel.deb';
        var debUrl = `https://github.com/bazelbuild/bazel/releases/download/${version}/bazel_${version}-linux-x86_64.deb`;
        yield exec.exec(`wget -O ${tmpOutput} ${debUrl}`);
        if (fs.existsSync(tmpOutput)) {
            yield exec.exec(`sudo dpkg -i ${tmpOutput}`);
            yield io.rmRF(tmpOutput);
        }
        else {
            throw new Error(`cannot download bazel ${version}`);
        }
    });
}
function _installBazelWithVersionForMac(baseInstallDir, version) {
    return __awaiter(this, void 0, void 0, function* () {
        var tmpOutput = 'bazel-installer.sh';
        var installerUrl = `https://github.com/bazelbuild/bazel/releases/download/${version}/bazel-${version}-installer-darwin-x86_64.sh`;
        yield exec.exec(`curl -o ${tmpOutput} -fL ${installerUrl}`);
        if (fs.existsSync(tmpOutput)) {
            yield exec.exec(`chmod +x ${tmpOutput}`);
            yield exec.exec(`./${tmpOutput}`);
        }
        else {
            throw new Error(`cannot download bazel ${version}`);
        }
    });
}
