import { useState } from 'react';
import { useRouter } from 'next/router';

import { getServiceErrorDataValidationErrors } from '@services/index';
import { getGenericFormError } from '@helpers/util/form';
import { selectForm } from '@selectors/forms';
import { formTypes } from '@constants/forms';
import { FormWithErrorSummary } from '@components/FormWithErrorSummary';
import { LayoutColumnContainer } from '@components/LayoutColumnContainer';
import { LayoutColumn } from '@components/LayoutColumn';
import { postGroup } from '@services/postGroup';
import { FormConfig, FormErrors } from '@appTypes/form';

import { Props } from './interfaces';

/**
 * Admin create group template
 */
export const AdminCreateGroupTemplate: (props: Props) => JSX.Element = ({
    csrfToken,
    forms,
    routes,
    user,
    contentText,
    services = {
        postGroup: postGroup
    }
}) => {

    const router = useRouter();

    const formConfig: FormConfig = selectForm(forms, formTypes.CREATE_GROUP);
    const [errors, setErrors] = useState(formConfig.errors);

    const { secondaryHeading } = contentText ?? {};

    /**
     * Client-side submission handler
     */
    const handleSubmit = async (formData: FormData): Promise<FormErrors> => {

        try {

            await services.postGroup({ user, body: formData as any });

            router.replace(`${routes.adminGroupsRoot}`)

            return Promise.resolve({});

        } catch (error) {

            const errors: FormErrors = getServiceErrorDataValidationErrors(error) || getGenericFormError(error);

            setErrors(errors);

            return Promise.resolve(errors);

        }

    };

    /**
     * Render
     */
    return (

        <LayoutColumnContainer>
            <LayoutColumn className="c-page-body">
                <LayoutColumnContainer>
                    <LayoutColumn tablet={8}>
                        <FormWithErrorSummary
                            csrfToken={csrfToken}
                            formConfig={formConfig}
                            errors={errors}
                            text={{
                                form: {
                                    submitButton: 'Save and create group',
                                    cancelButton: 'Discard group'
                                }
                            }}
                            context={{
                                user: user
                            }}
                            submitAction={handleSubmit}
                            cancelHref={routes.siteRoot}
                            shouldClearOnSubmitSuccess={true}
                            bodyClassName="u-mb-14 u-p-4 tablet:u-px-14 tablet:u-pt-12 u-pb-8 u-bg-theme-1">
                                <h2 className="nhsuk-heading-l">{secondaryHeading}</h2>
                        </FormWithErrorSummary>
                    </LayoutColumn>
                </LayoutColumnContainer>
            </LayoutColumn>
        </LayoutColumnContainer>

    )

}
