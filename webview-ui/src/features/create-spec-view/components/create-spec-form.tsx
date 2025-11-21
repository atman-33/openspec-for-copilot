import { TextareaPanel } from "@/components/textarea-panel";
import type { ChangeEvent, FormEvent, MutableRefObject } from "react";
import type { CreateSpecFieldErrors, CreateSpecFormData } from "../types";

const PRODUCT_CONTEXT_HELPER_ID = "create-spec-product-context-helper";

interface CreateSpecFormProps {
	formData: CreateSpecFormData;
	fieldErrors: CreateSpecFieldErrors;
	isSubmitting: boolean;
	autosaveStatus: string;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onFieldChange: (
		field: keyof CreateSpecFormData
	) => (event: ChangeEvent<HTMLTextAreaElement>) => void;
	productContextRef: MutableRefObject<HTMLTextAreaElement | null>;
	keyScenariosRef: MutableRefObject<HTMLTextAreaElement | null>;
	technicalConstraintsRef: MutableRefObject<HTMLTextAreaElement | null>;
	relatedFilesRef: MutableRefObject<HTMLTextAreaElement | null>;
	openQuestionsRef: MutableRefObject<HTMLTextAreaElement | null>;
	formId: string;
}

export const CreateSpecForm = ({
	formData,
	fieldErrors,
	isSubmitting,
	autosaveStatus,
	onSubmit,
	onFieldChange,
	productContextRef,
	keyScenariosRef,
	technicalConstraintsRef,
	relatedFilesRef,
	openQuestionsRef,
	formId,
}: CreateSpecFormProps) => (
	<form
		aria-busy={isSubmitting}
		className="flex flex-1 flex-col gap-6"
		id={formId}
		noValidate
		onSubmit={onSubmit}
	>
		<section className="flex flex-1 flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label
					className="font-medium text-[color:var(--vscode-foreground)] text-sm"
					htmlFor="create-spec-product-context"
				>
					Product Context{" "}
					<span className="text-[color:var(--vscode-errorForeground)]">*</span>
				</label>
				<TextareaPanel
					containerClassName="shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
					disabled={isSubmitting}
					onChange={onFieldChange("productContext")}
					placeholder="Describe the goal, background, and what you want to achieve…"
					rows={4}
					textareaClassName="min-h-[6rem] max-h-[60vh] overflow-y-auto text-sm leading-6"
					textareaProps={{
						id: "create-spec-product-context",
						name: "productContext",
						"aria-required": true,
						"aria-invalid": fieldErrors.productContext ? true : undefined,
						"aria-describedby": fieldErrors.productContext
							? PRODUCT_CONTEXT_HELPER_ID
							: undefined,
					}}
					textareaRef={productContextRef}
					value={formData.productContext}
				>
					{fieldErrors.productContext ? (
						<div
							className="flex items-center justify-end px-3 py-2 text-[color:var(--vscode-descriptionForeground,rgba(255,255,255,0.6))] text-xs"
							id={PRODUCT_CONTEXT_HELPER_ID}
						>
							<span className="text-[color:var(--vscode-errorForeground)]">
								{fieldErrors.productContext}
							</span>
						</div>
					) : null}
				</TextareaPanel>
			</div>

			<div className="flex flex-col gap-2">
				<label
					className="font-medium text-[color:var(--vscode-foreground)] text-sm"
					htmlFor="create-spec-key-scenarios"
				>
					Key Scenarios
				</label>
				<TextareaPanel
					disabled={isSubmitting}
					onChange={onFieldChange("keyScenarios")}
					placeholder="e.g. When user clicks save, then a notification appears..."
					rows={4}
					textareaClassName="min-h-[6rem] max-h-[60vh] overflow-y-auto text-sm leading-6"
					textareaProps={{
						id: "create-spec-key-scenarios",
						name: "keyScenarios",
					}}
					textareaRef={keyScenariosRef}
					value={formData.keyScenarios}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label
					className="font-medium text-[color:var(--vscode-foreground)] text-sm"
					htmlFor="create-spec-technical-constraints"
				>
					Technical Constraints
				</label>
				<TextareaPanel
					disabled={isSubmitting}
					onChange={onFieldChange("technicalConstraints")}
					placeholder="Libraries, patterns, or existing systems to consider…"
					rows={3}
					textareaClassName="min-h-[5rem] max-h-[60vh] overflow-y-auto text-sm leading-6"
					textareaProps={{
						id: "create-spec-technical-constraints",
						name: "technicalConstraints",
					}}
					textareaRef={technicalConstraintsRef}
					value={formData.technicalConstraints}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label
					className="font-medium text-[color:var(--vscode-foreground)] text-sm"
					htmlFor="create-spec-related-files"
				>
					Related Files
				</label>
				<TextareaPanel
					disabled={isSubmitting}
					onChange={onFieldChange("relatedFiles")}
					placeholder="src/utils/auth.ts, src/components/Login.tsx..."
					rows={2}
					textareaClassName="min-h-[4rem] max-h-[60vh] overflow-y-auto text-sm leading-6"
					textareaProps={{
						id: "create-spec-related-files",
						name: "relatedFiles",
					}}
					textareaRef={relatedFilesRef}
					value={formData.relatedFiles}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label
					className="font-medium text-[color:var(--vscode-foreground)] text-sm"
					htmlFor="create-spec-open-questions"
				>
					Open Questions
				</label>
				<TextareaPanel
					disabled={isSubmitting}
					onChange={onFieldChange("openQuestions")}
					placeholder="Any uncertainties or risks?"
					rows={2}
					textareaClassName="min-h-[4rem] max-h-[60vh] overflow-y-auto text-sm leading-6"
					textareaProps={{
						id: "create-spec-open-questions",
						name: "openQuestions",
					}}
					textareaRef={openQuestionsRef}
					value={formData.openQuestions}
				/>
			</div>
		</section>

		<footer className="flex flex-col gap-3 border-[color:color-mix(in_srgb,var(--vscode-foreground)_12%,transparent)] border-t pt-4">
			<div className="flex flex-wrap items-center justify-between gap-3 text-[color:var(--vscode-descriptionForeground,rgba(255,255,255,0.6))] text-xs">
				<span>{autosaveStatus}</span>
			</div>
		</footer>
	</form>
);
