import { FormConfig } from '@appTypes/form'

export interface Props {
    csrfToken: string;
    formConfig: FormConfig;
    context?: Record<string, any>;
    instanceId?: string;
    text: {
        submitButton: string
        cancelButton?: string
    }
    action?: string
    method?: string
    submitAction: (formData: FormData) => Promise<Record<string, string>>
    changeAction?: (props: any) => any
    cancelAction?: () => any
    validationFailAction?: any
    cancelHref?: string
    className?: string
    bodyClassName?: string
    submitButtonClassName?: string
    cancelButtonClassName?: string
    shouldAddErrorTitle?: boolean
    shouldClearOnSubmitSuccess?: boolean
}
