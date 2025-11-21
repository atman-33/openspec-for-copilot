export interface CreateSpecFormData {
	summary: string;
	productContext: string;
	technicalConstraints: string;
	openQuestions: string;
}

export interface CreateSpecDraftState {
	formData: CreateSpecFormData;
	lastUpdated: number;
}

export interface CreateSpecInitPayload {
	shouldFocusPrimaryField: boolean;
	draft?: CreateSpecDraftState;
}

export interface CreateSpecSubmitSuccessMessage {
	type: "create-spec/submit:success";
}

export interface CreateSpecSubmitErrorMessage {
	type: "create-spec/submit:error";
	payload: { message: string };
}

export interface CreateSpecConfirmCloseMessage {
	type: "create-spec/confirm-close";
	payload: { shouldClose: boolean };
}

export interface CreateSpecFocusMessage {
	type: "create-spec/focus";
}

export interface CreateSpecInitMessage {
	type: "create-spec/init";
	payload: CreateSpecInitPayload;
}

export type CreateSpecExtensionMessage =
	| CreateSpecInitMessage
	| CreateSpecSubmitSuccessMessage
	| CreateSpecSubmitErrorMessage
	| CreateSpecConfirmCloseMessage
	| CreateSpecFocusMessage;

export interface CreateSpecSubmitMessage {
	type: "create-spec/submit";
	payload: CreateSpecFormData;
}

export interface CreateSpecAutosaveMessage {
	type: "create-spec/autosave";
	payload: CreateSpecFormData;
}

export interface CreateSpecCloseAttemptMessage {
	type: "create-spec/close-attempt";
	payload: { hasDirtyChanges: boolean };
}

export interface CreateSpecCancelMessage {
	type: "create-spec/cancel";
}

export interface CreateSpecReadyMessage {
	type: "create-spec/ready";
}

export type CreateSpecWebviewMessage =
	| CreateSpecSubmitMessage
	| CreateSpecAutosaveMessage
	| CreateSpecCloseAttemptMessage
	| CreateSpecCancelMessage
	| CreateSpecReadyMessage;
