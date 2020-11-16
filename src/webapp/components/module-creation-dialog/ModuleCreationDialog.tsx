import TextField from "@material-ui/core/TextField";
import { ConfirmationDialog } from "d2-ui-components";
import _ from "lodash";
import React, { useCallback, useState } from "react";
import { TrainingModuleBuilder } from "../../../domain/entities/TrainingModule";
import i18n from "../../../locales";
import { Dictionary } from "../../../types/utils";
import { useAppContext } from "../../contexts/app-context";

export interface ModuleCreationDialogProps {
    builder?: TrainingModuleBuilder;
    onClose: () => void;
}

const defaultBuilder: TrainingModuleBuilder = {
    id: "",
    name: "",
    description: "",
    title: "",
};

export const ModuleCreationDialog: React.FC<ModuleCreationDialogProps> = ({
    builder: editBuilder = defaultBuilder,
    onClose,
}) => {
    const { usecases } = useAppContext();

    const [errors, setErrors] = useState<Dictionary<string | undefined>>({});
    const [builder, setBuilder] = useState<TrainingModuleBuilder>(editBuilder);

    const onChangeField = useCallback(
        (field: keyof TrainingModuleBuilder) => {
            return (event: React.ChangeEvent<{ value: unknown }>) => {
                setBuilder(builder => {
                    return { ...builder, [field]: event.target.value as string };
                });
                setErrors(errors => ({
                    ...errors,
                    [field]: !event.target.value ? i18n.t("Field must have a value") : undefined,
                }));
            };
        },
        [setBuilder]
    );

    const onSave = useCallback(async () => {
        const errors = _.reduce(
            builder,
            (acc, value, key) => {
                if (!value) return { ...acc, [key]: i18n.t("Field must have a value") };
                return acc;
            },
            {} as Dictionary<string>
        );

        if (_.values(errors).length > 0) {
            setErrors(oldErrors => ({ ...oldErrors, ...errors }));
            return;
        }

        if (editBuilder) {
            await usecases.editModule(builder);
            onClose();
        } else {
            const result = await usecases.createModule(builder);
            result.match({
                success: onClose,
                error: () => {
                    setErrors({ id: i18n.t("Code must be unique") });
                },
            });
        }
    }, [onClose, editBuilder, builder, usecases]);

    return (
        <ConfirmationDialog
            title={editBuilder ? i18n.t("Edit module") : i18n.t("Add module")}
            isOpen={true}
            maxWidth={"lg"}
            fullWidth={true}
            onCancel={onClose}
            onSave={onSave}
        >
            <TextField
                disabled={!!editBuilder}
                fullWidth={true}
                label={"Code *"}
                value={builder.id}
                onChange={onChangeField("id")}
                error={!!errors["id"]}
                helperText={errors["id"]}
            />
            <TextField
                fullWidth={true}
                label={"Name *"}
                value={builder.name}
                onChange={onChangeField("name")}
                error={!!errors["name"]}
                helperText={errors["name"]}
            />
            <TextField
                fullWidth={true}
                label={"Welcome page title *"}
                value={builder.title}
                onChange={onChangeField("title")}
                error={!!errors["title"]}
                helperText={errors["title"]}
            />
            <TextField
                fullWidth={true}
                label={"Welcome page description *"}
                multiline={true}
                rows={4}
                value={builder.description}
                onChange={onChangeField("description")}
                error={!!errors["description"]}
                helperText={errors["description"]}
            />
        </ConfirmationDialog>
    );
};
