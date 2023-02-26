#!/usr/bin/env node
'use strict'

const argv = require('yargs')
    .usage('Export markdown file to another file format\n\nUsage: $0 <inpath> [options]')
    .help('help').alias('help', 'h')
    .version('version', '1.0.0').alias('version', 'V')
    .options({
        input: {
            alias: 'i',
            description: '<filepath> Input file path',
            requiresArg: true,
            required: true
        },
        output: {
            alias: 'o',
            description: '<filepath> Output file path',
            requiresArg: true,
            required: false
        },
        format: {
            alias: 'f',
            description: '<format> Output format, html, pdf, png or jpeg',
            requiresArg: true,
            required: false,
            default: 'html'
        }
    })
    .argv
const fs = require('fs');
const mume = require('@shd101wyy/mume');
const path = require('path');

async function main() {
    await mume.init();
    const engine = new mume.MarkdownEngine({
        filePath: argv.input,
        config: {
            previewTheme: "github-light.css",
            // revealjsTheme: "white.css"
            codeBlockTheme: "default.css",
            printBackground: true,
            enableScriptExecution: true, // <= for running code chunks
        },
    });
    let format = argv.format.toLowerCase()
    let converted = false;
    if (format === 'html') {
        await engine.htmlExport({ offline: true, runAllCodeChunks: true });
        converted = true;
    } else if (format === 'pdf') {
        await engine.chromeExport({ fileType: 'pdf', runAllCodeChunks: true });
        converted = true;
    } else if (format === 'png') {
        await engine.chromeExport({ fileType: 'png', runAllCodeChunks: true });
        converted = true;
    } else if (format === 'jpeg') {
        await engine.chromeExport({ fileType: 'jpeg', runAllCodeChunks: true });
        converted = true;
    } else {
        console.info(`Format ${argv.format} is not supported.`);
    }
    if (converted) {
        let extname = path.extname(argv.input)
        let generated = argv.input.replace(new RegExp(extname + "$"), `.${format}`);
        if (argv.output && fs.existsSync(generated)) {
            fs.renameSync(generated, argv.output);
        }
    }
    return process.exit();
}

main();
