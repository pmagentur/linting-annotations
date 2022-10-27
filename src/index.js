const core = require('@actions/core');
const github = require('@actions/github');
const httpClient = require('@actions/http-client');

const apiHost = 'https://pm-code-check.pm-projects.de/';
const apiAnnotationEndpoint = 'pm-checks/annotations/create';

const requestParams = {
    'owner': core.getInput('repoOwner') || github.context.repo.owner,
    'repo_name': core.getInput('repoName') || github.context.repo.repo,
    'head_sha': core.getInput('commitSha'),
    'check_name': core.getInput('checkName')
};

/**
 * @param annotation
 * @return {{path, annotation_level: string, start_line: number, message, end_line: number}}
 */
const convertAnnotation = (annotation) => {
    return {
        'path': annotation.path,
        'start_line': parseInt(annotation.startLine),
        'end_line': parseInt(annotation.startLine), // Use startLine as endLine because github does not support multiline annotations
        'annotation_level': annotation.annotationLevel,
        'message': annotation.message
    };
};

/**
 * @param {{path, annotation_level: string, start_line: number, message, end_line: number}} annotations
 * @return {Promise<void>}
 */
const createAnnotation = async (annotations) => {
    const params = new URLSearchParams(requestParams).toString();

    const client = new httpClient.HttpClient();
    await client.postJson(apiHost + apiAnnotationEndpoint + `?${params}`, annotations);
}

async function main() {
    const stringAnnotations = core.getInput('annotations');
    if (!stringAnnotations) {
        core.warning('No annotations provided');
        return;
    }

    const annotations = JSON.parse(stringAnnotations);
    if (annotations.length === 0) {
        core.info('No annotations to process');
        return;
    }

   await createAnnotation(annotations.map(convertAnnotation));
}

main().catch((error) => core.setFailed(error.message));

