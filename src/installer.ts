import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as fs from 'fs';

export function installBazelWithVersion(
  baseInstallDir: string,
  version: string
) {
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
    default:
      throw new Error(`unsupported OS: ${process.platform}`);
  }
}

async function _installBazelWithVersionForLinux(
  baseInstallDir: string,
  version: string
) {
  var tmpOutput = baseInstallDir + '/bazel.deb';
  var debUrl = `https://github.com/bazelbuild/bazel/releases/download/${version}/bazel_${version}-linux-x86_64.deb`;
  await exec.exec(`wget -O ${tmpOutput} ${debUrl}`);
  if (fs.existsSync(tmpOutput)) {
    await exec.exec(`sudo dpkg -i ${tmpOutput}`);
    await io.rmRF(tmpOutput);
  } else {
    throw new Error(`cannot download bazel ${version}`);
  }
}

async function _installBazelWithVersionForMac(
  baseInstallDir: string,
  version: string
) {
  var tmpOutput = 'bazel-installer.sh';
  var installerUrl = `https://github.com/bazelbuild/bazel/releases/download/${version}/bazel-${version}-installer-darwin-x86_64.sh`;
  await exec.exec(`curl -o ${tmpOutput} -fL ${installerUrl}`);
  if (fs.existsSync(tmpOutput)) {
    await exec.exec(`chmod +x ${tmpOutput}`);
    await exec.exec(`./${tmpOutput}`);
  } else {
    throw new Error(`cannot download bazel ${version}`);
  }
}
