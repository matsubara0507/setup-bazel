import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as fs from 'fs';

export function findBazelVersion(baseInstallDir: string, version: string) {
  if (!baseInstallDir) {
    throw new Error('baseInstallDir parameter is required');
  }
  if (!version) {
    throw new Error('versionSpec parameter is required');
  }

  switch (process.platform) {
    case 'linux':
      _findBazelVersionForLinux(baseInstallDir, version);
      break;
    default:
      throw new Error(`unsupported OS: ${process.platform}`);
  }
}

async function _findBazelVersionForLinux(
  baseInstallDir: string,
  version: string
) {
  var tmpOutput = baseInstallDir + '/bazel.deb';
  var debUrl = `https://github.com/bazelbuild/bazel/releases/download/${version}/bazel_${version}-linux-x86_64.deb`;
  await exec.exec(`wget -O ${tmpOutput} ${debUrl}`);
  if (fs.existsSync(tmpOutput)) {
    await exec.exec(`sudo dpkg -i ${tmpOutput}`);
  } else {
    throw new Error(`cannot download bazel ${version}`);
  }
  await io.rmRF(tmpOutput);
}
