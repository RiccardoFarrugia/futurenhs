import { FormField } from '@appTypes/form';

export interface Props {
    csrfToken: string;
    initialValues?: any;
    fields: Array<FormField>;
    text: {
        submitButton: string;
        cancelButton?: string;
    };
    action?: string;
    method?: string;
    submitAction: any;
    changeAction?: any;
    cancelHref?: string;
    className?: string;
    bodyClassName?: string;
    submitButtonClassName?: string;
    cancelButtonClassName?: string;
}