const fs = require('fs');
const fetch = require('node-fetch');

const username = 'OleksandrBazhyn';
const year = new Date().getFullYear();

async function getCommitsCount() {
  const url = `https://api.github.com/search/commits?q=author:${username}+committer-date:${year}-01-01..${year}-12-31&per_page=1`;
  const headers = { Accept: 'application/vnd.github.cloak-preview' };
  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error('GitHub API error (commits):', response.status);
    return 0;
  }

  const data = await response.json();
  console.log(`Commits found: ${data.total_count}`);
  return data.total_count || 0;
}

async function getReposCount() {
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error('GitHub API error (repos):', response.status);
    return 0;
  }

  const data = await response.json();
  console.log(`Public repos: ${data.public_repos}`);
  return data.public_repos || 0;
}

async function updateReadme() {
  const commits = await getCommitsCount();
  const repos = await getReposCount();

  const readmePath = './README.md';
  let content = fs.readFileSync(readmePath, 'utf-8');

  const commitsRegex = /\*\*More than [^*]+ commits in \d{4}\*\*/;
  const commitsReplacement = `**More than ${commits} commits in ${year}**`;

  if (commitsRegex.test(content)) {
    content = content.replace(commitsRegex, commitsReplacement);
    console.log(`Updated commits count: ${commitsReplacement}`);
  } else {
    console.log('No matching commits line found.');
  }

  const reposRegex = /\*\*[^*]+ public repositories\*\*/;
  const reposReplacement = `**${repos} public repositories**`;

  if (reposRegex.test(content)) {
    content = content.replace(reposRegex, reposReplacement);
    console.log(`Updated repos count: ${reposReplacement}`);
  } else {
    console.log('No matching repos line found.');
  }

  fs.writeFileSync(readmePath, content, 'utf-8');
  console.log('README.md updated!');
}

updateReadme();
