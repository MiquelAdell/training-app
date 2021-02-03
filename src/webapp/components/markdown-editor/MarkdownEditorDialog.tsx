import { ConfirmationDialog } from "d2-ui-components";
import React, { ReactNode, useCallback, useState } from "react";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";
import { MarkdownEditor } from "./MarkdownEditor";

export interface MarkdownEditorDialogProps {
    title?: string;
    initialValue: string;
    onCancel: () => void;
    onSave: (value: string) => void;
    markdownPreview?: (markdown: string) => ReactNode;
}

export const MarkdownEditorDialog: React.FC<MarkdownEditorDialogProps> = ({
    title = i18n.t("Edit markdown"),
    initialValue,
    onCancel,
    onSave,
    markdownPreview,
}) => {
    const {usecases} = useAppContext();
    const [value, onChange] = useState<string>(initialValue);
    const onFinish = useCallback(() => {
        onSave(value);
    }, [onSave, value]);
    


    const onUpload = useCallback(async (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: "image/jpeg" });
        const file = new File([blob], "image.png", { type: blob.type });

        // TODO: Call a usecase here
        const response = await usecases.content.uploadFile(file);
        console.log("upload", response);
        return response.toString();

    }, []);

    return (
        <ConfirmationDialog
            title={title}
            isOpen={true}
            maxWidth={"lg"}
            fullWidth={true}
            onCancel={onCancel}
            onSave={onFinish}
            saveText={i18n.t("Save")}
        >
            <MarkdownEditor
                value={value}
                onChange={onChange}
                markdownPreview={markdownPreview}
                onUpload={onUpload}
            />
        </ConfirmationDialog>
    );
};
