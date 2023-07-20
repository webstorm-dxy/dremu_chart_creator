const { readFile, writeFile } = require("fs/promises");

const args = process.argv.slice(2, 4);

const needUpgrades = {
    version: null,
    major: false,
    minor: false,
    patch: false
};

args.forEach(arg => {
    if (needUpgrades.version) return;
    if (/^\d+\.\d+\.\d+/.test(arg)) return needUpgrades.version = arg;
    if (arg === '-MA' || arg === '--major') return needUpgrades.major = true;
    if (arg === '-MI' || arg === '--minor') return needUpgrades.minor = true;
    if (arg === '-P' || arg === '--patch') return needUpgrades.patch = true;
});

if (!needUpgrades.version && !needUpgrades.major && !needUpgrades.minor && !needUpgrades.patch) return console.warn('Didn\'t need to upgrade version.');

(async () => {
    const packageFilePath = './package.json';
    const tauriConfigFilePath = './src-tauri/tauri.conf.json';
    const packageFile = await readFile(packageFilePath, { encoding: 'utf-8' });
    const tauriConfigFile = await readFile(tauriConfigFilePath, { encoding: 'utf-8' });
    const packageJson = JSON.parse(packageFile);
    const tauriConfigJson = JSON.parse(tauriConfigFile);

    let version = needUpgrades.version;
    if (!version) {
        const oldVersion = packageJson.version;
        if (!oldVersion) return console.error('"package.json" has error.');

        const firstDotIndex = oldVersion.indexOf('.');
        const lastDotIndex = oldVersion.lastIndexOf('.');
        let majorVersion = Number(oldVersion.slice(0, firstDotIndex)) + (needUpgrades.major ? 1 : 0);
        let minorVersion = Number(oldVersion.slice(firstDotIndex + 1, lastDotIndex)) + (needUpgrades.minor ? 1 : 0);
        let patchVersion = Number(oldVersion.slice(lastDotIndex + 1, oldVersion.length)) + (needUpgrades.patch ? 1 : 0);

        version = `${majorVersion}.${minorVersion}.${patchVersion}`;
    }

    packageJson.version = version;
    tauriConfigJson.package.version = version;
    tauriConfigJson.tauri.windows[0].title = `Re: AstEdit - v${version}`;

    writeFile(packageFilePath, JSON.stringify(packageJson, null, 4), { encoding: 'utf-8' });
    writeFile(tauriConfigFilePath, JSON.stringify(tauriConfigJson, null, 4), { encoding: 'utf-8' });

    console.info(`Upgrade version to ${version} is successful`);
})();