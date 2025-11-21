export interface CreateSpecFormData {
	productContext: string;
	keyScenarios: string;
	technicalConstraints: string;
	relatedFiles: string;
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

export type CreateSpecExtensionMessage =
	| { type: "create-spec/init"; payload: CreateSpecInitPayload }
	| { type: "create-spec/submit:success" }
	| { type: "create-spec/submit:error"; payload: { message: string } }
	| { type: "create-spec/confirm-close"; payload: { shouldClose: boolean } }
	| { type: "create-spec/focus" };

export interface CreateSpecFieldErrors {
	productContext?: string;
}
