import path from "path";
import yargs from "yargs";

export const parseArgs = () => {
  return yargs(process.argv.slice(2))
    .scriptName("lambdadyn")
    .usage('\nlambdadyn [args | --help]')
    .options('config', {
      describe: 'Path to config.json file.',
      type: 'string',
      default: path.join(__dirname, "config.json")
    })
    .help()
    .parse();
};