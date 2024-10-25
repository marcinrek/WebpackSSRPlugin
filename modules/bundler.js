const fs = require('fs')
const path = require('path');
const chalk = require('chalk');
const esbuild = require('esbuild');

/**
 * Bundle SSR build
 * @description Build SSR bundle if it is required, if not just return the bundle file path
 * @param {string} filePath entry file to bundle
 * @param {boolean} buildRequired flag is the build required
 * @returns {string} bundle file path
 */
const evaluateModule = async (filePath, buildRequired, metaDisplay, metaFile, bundleFormat) => {
    // Define the output file name - mjs for esm and js for commonjs
    const bundleFileName = filePath.split('/')[filePath.split('/').length - 1].replace(/\.(js|jsx)$/, `${bundleFormat === 'esm' ? '.bundle.mjs' : '.bundle.js'}`);
    const metaFileName = metaFile && filePath.split('/')[filePath.split('/').length - 1].replace(/\.(js|jsx)$/, '.bundle.meta.json');
    const outfilePath = filePath.split('/').slice(0, -1).join('/');

    if (buildRequired) {
        let result = await esbuild.build({
            entryPoints: [filePath],
            platform: 'node',
            target: 'node18',
            bundle: true,
            minify: false,
            metafile: metaDisplay || metaFile,
            outfile: `${outfilePath}/${bundleFileName}`,
            format: bundleFormat
        });

        // Display stats
        metaDisplay && console.log(await esbuild.analyzeMetafile(result.metafile))

        // Store stats to file
        metaFile && fs.writeFileSync(`${outfilePath}/${metaFileName}`, JSON.stringify(result.metafile))
    }

    if (buildRequired) {
        console.log(chalk.magenta(`[SSRWebpackPlugin] ESBUILD Rebuild file: ${chalk.cyanBright(filePath)} => ${chalk.cyan(path.join(path.dirname(filePath), bundleFileName))}`));
    } else {
        console.log(
            chalk.magenta(`[SSRWebpackPlugin] ESBUILD Rebuild not required for: ${chalk.cyanBright(filePath)} => ${chalk.cyan(path.join(path.dirname(filePath), bundleFileName))}`),
        );
    }
    return path.join(path.dirname(filePath), bundleFileName);
};

module.exports = {
    evaluateModule,
};
