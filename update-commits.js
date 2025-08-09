const fs = require('fs');
const fetch = require('node-fetch');

const username = 'OleksandrBazhyn';
const year = new Date().getFullYear();

async function getCommitsCount() {
  const url = `https://api.github.com/search/commits?q=author:${username}+committer-date:${year}-01-01..${year}-12-31&per_page=1`;
  const headers = { Accept: 'application/vnd.github.cloak-preview' };
  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error('GitHub API error:', response.status);
    return 0;
  }

  const data = await response.json();
  return data.total_count || 0;
}

async function updateReadme() {
  const commits = await getCommitsCount();
  const readmePath = './README.md';
  let content = fs.readFileSync(readmePath, 'utf-8');

  const regex = /\*\*More than \d+ commits in \d{4}\*\*/;
  const replacement = `**More than ${commits} commits in ${year}**`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(readmePath, content, 'utf-8');
    console.log(`README.md updated: ${replacement}`);
  } else {
    console.log('No matching line found for update.');
  }
}

updateReadme();
