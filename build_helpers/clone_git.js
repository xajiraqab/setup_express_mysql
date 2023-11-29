import simpleGit from "simple-git"

// Replace 'repositoryUrl' with the URL of the GitHub repository you want to clone
const repositoryUrl = 'https://github.com/xajiraqab/fastapi_rest_server';

// Replace 'destinationPath' with the desired local directory where you want to clone the repository
const destinationPath = '/clonded';

const personalAccessToken = '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';

// Set the GIT_ASKPASS environment variable to provide the PAT for authentication
process.env.GIT_ASKPASS = `${personalAccessToken}`;


// Clone the repository
simpleGit().clone(repositoryUrl, destinationPath, (error) => {
  if (error) {
    console.error(`Failed to clone repository: ${error}`);
    return;
  }

  console.log('Repository cloned successfully.');
});