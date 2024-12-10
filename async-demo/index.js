// console.log('Before');
// getUser(1, getRepositories);
// console.log('After');

// function getRepositories(user) {
//     // console.log('User', user);
//     getRepositories(user.username, displayRepos)
// }

// function getCommits(repos) {
//     // console.log('Repos', repos);
//     getCommits(repos, displayCommits)
// }

// getUser(1).then(user => getRepositories(user.username))
//     .then(repos => getCommits(repos[0]))
//     .then(commits => console.log('Commits', commits))
//     .catch(err => console.log('Error', err.message));

async function displayCommits() {
    try {

        const user = await getUser(1);
        const repos = await getRepositories(user.username);
        const commits = await getCommits(repos[0]);
        console.log(commits);
    }
    catch (err) {
        console.log('Error', err.message);
    }
}

displayCommits();


// function displayCommits(commit) {
//     console.log(commit);
// }

function getUser(id) {
    return new Promise((resolve, reject) => {
        console.log('Reading from db...');
        setTimeout(() => {
            resolve({ id: id, githubname: 'mosh' });
        }, 2000);
    })
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        console.log('Reading from github...');
        setTimeout(() => {
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    })
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        console.log('Reading all commits...');
        setTimeout(() => {
            resolve(['commit1', 'commit2', 'commit3']);
            // resolve(); // void func return ntg
            // reject(new Error('doesnot'));
        }, 2000);
    })
}