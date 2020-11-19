import * as core from '@actions/core';
import {findBazelVersion} from './installer';
import {defaultVersion} from './default';

// ghc and cabal are installed directly to /opt so use that directlly instead of
// copying over to the toolcache dir.
const baseInstallDir = '/opt';

async function run() {
  try {
    let bazelVersion = core.getInput('bazel-version');
    if (!bazelVersion) {
      bazelVersion = defaultVersion;
    }
    findBazelVersion(baseInstallDir, bazelVersion);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
