export interface CreateSteeringFormData {
	summary: string;
	audience: string;
	keyPractices: string;
	antiPatterns: string;
}

export interface CreateSteeringDraftState {
	formData: CreateSteeringFormData;
	lastUpdated: number;
}

export interface CreateSteeringInitPayload {
	shouldFocusPrimaryField: boolean;
	draft?: CreateSteeringDraftState;
}

export type CreateSteeringExtensionMessage =
	| { type: "create-steering/init"; payload: CreateSteeringInitPayload }
	| { type: "create-steering/submit:success" }
	| { type: "create-steering/submit:error"; payload: { message: string } }
	| { type: "create-steering/confirm-close"; payload: { shouldClose: boolean } }
	| { type: "create-steering/focus" };

export interface CreateSteeringFieldErrors {
	summary?: string;
}

export interface CreateSteeringSubmitMessage {
	type: "create-steering/submit";
	payload: CreateSteeringFormData;
}

export interface CreateSteeringAutosaveMessage {
	type: "create-steering/autosave";
	payload: CreateSteeringFormData;
}

export interface CreateSteeringCloseAttemptMessage {
	type: "create-steering/close-attempt";
	payload: { hasDirtyChanges: boolean };
}

export interface CreateSteeringCancelMessage {
	type: "create-steering/cancel";
}

export interface CreateSteeringReadyMessage {
	type: "create-steering/ready";
}

export type CreateSteeringWebviewMessage =
	| CreateSteeringSubmitMessage
	| CreateSteeringAutosaveMessage
	| CreateSteeringCloseAttemptMessage
	| CreateSteeringCancelMessage
	| CreateSteeringReadyMessage;
