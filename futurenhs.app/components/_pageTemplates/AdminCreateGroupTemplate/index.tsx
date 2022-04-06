import { useState } from 'react';

import { formTypes } from '@constants/forms';
import { FormWithErrorSummary } from '@components/FormWithErrorSummary';
import { LayoutColumnContainer } from '@components/LayoutColumnContainer';
import { LayoutColumn } from '@components/LayoutColumn';
import { selectFormErrors, selectFormDefaultFields } from '@selectors/forms';
import { FormErrors } from '@appTypes/form';
import { routes } from '@constants/routes';
import { getServiceErrorDataValidationErrors } from '@services/index';
import { getGenericFormError } from '@helpers/util/form';


import { Props } from './interfaces';


export const AdminCreateGroupTemplate: (props: Props) => JSX.Element = ({
    csrfToken,
    user,
    forms,
    contentText
}) => {

    const [errors, setErrors] = useState(selectFormErrors(forms, formTypes.CREATE_GROUP));

    const fields = selectFormDefaultFields(forms, formTypes.CREATE_GROUP);

    const { secondaryHeading } = contentText

    /**
     * Handle client-side update submission
     */
    const handleSubmit = async (formData: FormData): Promise<FormErrors> => {

        return new Promise((resolve) => {

            try {

            } catch (error) {

                const errors: FormErrors = getServiceErrorDataValidationErrors(error) || getGenericFormError(error);

                setErrors(errors);
                resolve(errors);

            }

        });

    };

    return (
        <>
            <LayoutColumn className="c-page-body">
                <LayoutColumnContainer>
                    <LayoutColumn tablet={8}>
                    <FormWithErrorSummary
                            csrfToken={csrfToken}
                            formId={formTypes.CREATE_GROUP}
                            fields={fields}
                            errors={errors}
                            text={{
                                errorSummary: {
                                    body: 'There was a problem'
                                },
                                form: {
                                    submitButton: 'Save and close',
                                    cancelButton: 'Discard changes'
                                }
                            }}
                            cancelHref={routes.ADMIN_GROUPS}
                            submitAction={handleSubmit}
                            bodyClassName="u-mb-12">
                        </FormWithErrorSummary>
                    </LayoutColumn>
                </LayoutColumnContainer>
            </LayoutColumn>
        </>
    )
}