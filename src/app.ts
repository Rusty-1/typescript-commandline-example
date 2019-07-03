import {Command} from "commander";
import simpleGit from "simple-git/promise";
import {IGitVersionDto} from "./types/version.types";
// import { DefaultLogFields } from "simple-git/typings/response";
// import {StorageServiceClient} from "azure-storage";

const program = new Command();

const TARGETS = {
    Development : {
        ConnectString: "XXXX",
    },
};

program
    .version("0.1.0")
    .option("-d --debug", "Enable debug logging")
    .option("-s --subscription");

program
    .command("list <target>")
    .description("List contents of deployment")
    .action((target) => {
        // return ListContents(TARGETS[target].ConnectString);
    });

program
    .command("deploy <target>")
    .description("Deploy to the target")
    .action( (target) => {
        if(program.debug) {
            console.debug(`Deploying to ${target}`);
        }
    });

program
    .command("version")
    .action(async () => {
        const lastCommitLogEntry = await GetVersion();

        console.debug(`Git commit: hash=[${lastCommitLogEntry.hash}] date=[${lastCommitLogEntry.date}] ref=[${lastCommitLogEntry.ref}]`);
    });

const GetVersion = (async (): Promise<IGitVersionDto> => {
    const git = simpleGit();
    return await git.log().then((x) => {
        return {
            date: x.latest.date.substr(0, 10),
            hash: x.latest.hash.substr(0, 8),
            ref: x.latest.refs,
        };
    });
});

program.parse(process.argv);
