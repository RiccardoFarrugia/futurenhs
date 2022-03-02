import { useState } from 'react';
import { formTypes } from "@constants/forms";
import { selectFormErrors, selectFormInitialValues, selectFormDefaultFields } from '@selectors/forms';
import { FormWithErrorSummary } from '@components/FormWithErrorSummary';
import { LayoutColumnContainer } from '@components/LayoutColumnContainer';
import { LayoutColumn } from '@components/LayoutColumn';

import { Props } from './interfaces';

/**
 * Group create folder template
 */
export const GroupUpdateTemplate: (props: Props) => JSX.Element = ({
    csrfToken,
    forms,
    contentText
}) => {

    const [errors, setErrors] = useState(selectFormErrors(forms, formTypes.UPDATE_GROUP));

    const initialValues = selectFormInitialValues(forms, formTypes.UPDATE_GROUP);
    const fields = selectFormDefaultFields(forms, formTypes.UPDATE_GROUP);

    const { mainHeading, secondaryHeading } = contentText ?? {}

    return (

        <>
            <LayoutColumn className="c-page-body">
                <LayoutColumnContainer>
                    <LayoutColumn tablet={8}>
                        <FormWithErrorSummary
                            csrfToken={csrfToken}
                            formId={formTypes.UPDATE_GROUP}
                            fields={fields}
                            errors={errors}
                            initialValues={initialValues}
                            text={{
                                errorSummary: {
                                    body: 'There was a problem'
                                },
                                form: {
                                    submitButton: 'Save and close',
                                    cancelButton: 'Cancel'
                                }
                            }}
                            cancelHref="/"
                            submitAction={() => { }}
                            bodyClassName="u-mb-12">
                            <h2 className="nhsuk-heading-l">{mainHeading}</h2>
                            <p className="u-text-lead u-text-theme-7 u-mb-4">{secondaryHeading}</p>
                        </FormWithErrorSummary>
                    </LayoutColumn>
                </LayoutColumnContainer>
            </LayoutColumn>
        </>

    )

}
