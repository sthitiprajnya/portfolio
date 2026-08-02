#!/usr/bin/env bash
set -euo pipefail

# Close all open PRs in the repository this runs in.
# Uses GITHUB_TOKEN provided by Actions.

repo="$GITHUB_REPOSITORY"
token="$GITHUB_TOKEN"

if [ -z "${repo:-}" ] || [ -z "${token:-}" ]; then
  echo "GITHUB_REPOSITORY and GITHUB_TOKEN must be set"
  exit 1
fi

page=1
while true; do
  echo "Fetching open PRs page $page..."
  res=$(curl -s -H "Authorization: token $token" "https://api.github.com/repos/$repo/pulls?state=open&per_page=100&page=$page")
  # Extract PR numbers
  pr_numbers=$(echo "$res" | jq -r '.[].number')
  if [ -z "$pr_numbers" ]; then
    echo "No more PRs."
    break
  fi

  for n in $pr_numbers; do
    echo "Closing PR #$n"
    # Post a comment explaining the automated close
    curl -s -X POST -H "Authorization: token $token" -H "Content-Type: application/json" \
      -d '{"body":"This pull request is being closed by repository automation per owner request."}' \
      "https://api.github.com/repos/$repo/issues/$n/comments" >/dev/null

    # Close the PR via the issues API
    curl -s -X PATCH -H "Authorization: token $token" -H "Content-Type: application/json" \
      -d '{"state":"closed"}' "https://api.github.com/repos/$repo/issues/$n" >/dev/null

    echo "  -> Closed #$n"
  done

  page=$((page+1))
done

echo "All done."
