import {info, warning} from '@actions/core';
import {PullRequestInfo} from '../pullrequestinfo';
import {GithubRebase} from './githubRebase';

/**
 * Uses [github-rebase](https://github.com/tibdex/github-rebase)
 * to rebase pull requests.
 */
export class Rebaser {
    private githubRebase: GithubRebase;

    constructor(githubRebase: GithubRebase) {
        this.githubRebase = githubRebase;
    }

    public async rebasePullRequests(pullRequests: PullRequestInfo[], baseBranch?: string): Promise<void> {
        for (const pullRequest of pullRequests) {
            await this.rebase(pullRequest, baseBranch);
        }
    }

    private async rebase(pullRequest: PullRequestInfo, baseBranch?: string) {
        info(`Rebasing pull request ${JSON.stringify(pullRequest)}`);
        try {
            await this.githubRebase.rebasePullRequest(
                pullRequest.ownerName,
                pullRequest.number,
                pullRequest.repoName,
                baseBranch,
            );

            info(`${JSON.stringify(pullRequest)} was successfully rebased.`);
        } catch (e) {
            if (String(e).includes('Rebase aborted because the head branch changed')) {
                warning(`Rebase aborted because the head branch changed for ${JSON.stringify(pullRequest)}`);
                return;
            }
            throw new Error(`Error while rebasing for ${JSON.stringify(pullRequest)}: ${String(e)}`);
        }
    }
}
