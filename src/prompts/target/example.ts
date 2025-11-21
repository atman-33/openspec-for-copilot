// Auto-generated from src/prompts/example.md
// DO NOT EDIT MANUALLY

export const frontmatter = {
  "id": "example",
  "name": "Example Prompt",
  "version": "1.0.0",
  "description": "An example prompt to demonstrate the prompt loader system",
  "variables": {
    "name": {
      "type": "string",
      "required": true,
      "description": "The name to greet"
    }
  }
};

export const content = "Hello {{name}}!\n\nThis is an example prompt template.\nYou can use Handlebars syntax for variables.\n";

export default {
  frontmatter,
  content
};
