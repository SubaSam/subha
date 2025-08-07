export default function extractPipeline(rawResponse: string): string {
  // Step 1: Extract the content inside triple backticks
  const match = rawResponse.match(/```[\s\S]*?\n([\s\S]*?)```/);
  const codeInsideBackticks = match ? match[1].trim() : '';

  // Step 2: Try to parse it as JSON
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(codeInsideBackticks);
  } catch {
    // Not JSON? Just return raw content (Case 1 - raw YAML or Groovy)
    return codeInsideBackticks;
  }

  // Step 3: Handle known keys from JSON cases
  let pipelineString = '';
  if (parsedJson.content) {
    pipelineString = parsedJson.content;
  } else if (parsedJson.converted_pipeline) {
    pipelineString = parsedJson.converted_pipeline;
  } else {
    console.warn('No known pipeline field (content or converted_pipeline) found.');
    return '';
  }

  // Step 4: Unescape stringified pipeline (common in JSON values)
  const cleanedPipeline = pipelineString
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

  return cleanedPipeline.trim();
}
