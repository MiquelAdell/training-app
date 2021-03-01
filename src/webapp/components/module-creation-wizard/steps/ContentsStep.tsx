import React, { useMemo } from "react";
import { updateTranslation } from "../../../../domain/entities/TrainingModule";
import { ComponentParameter } from "../../../../types/utils";
import { useAppContext } from "../../../contexts/app-context";
import { buildListSteps, ModuleListTable } from "../../module-list-table/ModuleListTable";
import { ModuleCreationWizardStepProps } from "./index";

export const ContentsStep: React.FC<ModuleCreationWizardStepProps> = ({ module, onChange }) => {
    const { usecases } = useAppContext();

    const tableActions: ComponentParameter<typeof ModuleListTable, "tableActions"> = useMemo(
        () => ({
            uploadFile: ({ data }) => usecases.instance.uploadFile(data),
            editContents: async ({ text, value }) => onChange(module => updateTranslation(module, text.key, value)),
        }),
        [usecases, onChange]
    );

    return (
        <React.Fragment>
            <ModuleListTable rows={buildListSteps(module, module.contents.steps)} tableActions={tableActions} />
        </React.Fragment>
    );
};
