import { Octokit } from '@octokit/core';

interface Email {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}
class GitHubClient {
    private octokit: Octokit;

    constructor(private token: string) {
        this.octokit = new Octokit({ auth: this.token });
    }

    async getPrimaryEmail() {
        try {
            const response = await this.octokit.request('GET /user/emails', {
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            const email = response.data.find((email: Email) => email.primary);

            return email;
        } catch (error: any) {
            console.error('Error retrieving user:', error.message);
            throw error;
        }
    }
}

export default GitHubClient;
