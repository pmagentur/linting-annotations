# linting-annotations-action

Github action to add annotations on a pull request without the limitation of github actions.
It adds the annotations via the P&M code-checker-bot

##  Usage

Annotations must be an array of 

```javascript
{path: string, startLine: string|int, endline: string|int, annotationsLevel: failure|warning|notice, message: string}
```

Example usage as a step in a workflow file
```yml
- name: Add Annotations
  uses: pmagentur/linting-annotations@master
  if: failure() && steps.linter.outputs.annotations != ''
  with:
    checkName: 'Java Linting'
    commitSha: ${{ github.event.pull_request.head.sha }}
    annotations: ${{ steps.linter.outputs.annotations }}
```
