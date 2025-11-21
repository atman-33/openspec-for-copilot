---
id: example
name: Example Prompt
version: 1.0.0
description: An example prompt to demonstrate the prompt loader system
variables:
  name:
    type: string
    required: true
    description: The name to greet
---
Hello {{name}}!

This is an example prompt template.
You can use Handlebars syntax for variables.
