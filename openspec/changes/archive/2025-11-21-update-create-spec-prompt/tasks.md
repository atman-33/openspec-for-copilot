# Tasks

- [x] Verify existence of `.github/prompts/openspec-proposal.prompt.md` <!-- id: 0 -->
- [x] Implement reading of `.github/prompts/openspec-proposal.prompt.md` in `CreateSpecInputController` <!-- id: 1 -->
- [x] Update `handleSubmit` in `CreateSpecInputController` to use the file content + user input <!-- id: 2 -->
- [x] Remove usage of `promptLoader.renderPrompt("create-spec")` if no longer needed (or keep as fallback?) -> User said "The content of ... as is", implying replacement. <!-- id: 3 -->
- [x] Validate the change by triggering "Create Spec" and checking the sent prompt <!-- id: 4 -->
- [x] Add separator text between prompt template and user input <!-- id: 5 -->
(Validated via static analysis and build check)
