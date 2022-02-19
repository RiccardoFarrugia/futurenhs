import { useState } from 'react';
import { useRouter } from 'next/router';
import { Link } from '@components/Link';
import { Form as FinalForm, Field, FormSpy } from 'react-final-form';
import classNames from 'classnames';

import { formComponents } from '@components/_formComponents';
import { Dialog } from '@components/Dialog';
import { validate } from '@helpers/validators';
import { FormField } from '@appTypes/form';

import { Props } from './interfaces';

/**
 * Generic form handler
 */
export const Form: (props: Props) => JSX.Element = ({
    action,
    method = 'POST',
    csrfToken,
    formId,
    instanceId,
    initialValues = {},
    fields: fieldsTemplate,
    changeAction,
    submitAction,
    validationFailAction,
    cancelHref,
    text,
    className,
    bodyClassName,
    submitButtonClassName,
    cancelButtonClassName
}) => {

    const router = useRouter();

    /**
     * Create unique field instances from the supplied fields template
     */
    const [fields] = useState(() => {

        let templatedFields: Array<FormField>;
        
        try {

            templatedFields = JSON.parse(JSON.stringify(fieldsTemplate));

        } catch(error){

            templatedFields = [];

        }
        
        templatedFields.forEach(field => {
        
            field.name = instanceId ? field.name + '-' + instanceId : field.name;  
        
        });
        
        return templatedFields;

    });
    
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const handleCancel = (event: any): any => {

        event.preventDefault();

        setIsCancelModalOpen(true);

    };
    const handleDiscardFormCancel = () => setIsCancelModalOpen(false);
    const handleDiscardFormConfirm = () => router.push(cancelHref);
    const handleChange = (props: any): any => changeAction?.(props);
    const handleValidate = (submission: any): any => validate(submission, fields);

    const { submitButton, cancelButton } = text ?? {};

    const shouldRenderCancelButton: boolean = Boolean(cancelButton) && Boolean(cancelHref);

    const generatedClasses: any = {
        wrapper: classNames('c-form', className),
        body: classNames('c-form_body', bodyClassName),
        buttonContainer: classNames('u-flex', 'u-justify-between'),
        submitButton: classNames('c-form_submit-button', 'c-button', 'c-button--min-width', submitButtonClassName),
        cancelButton: classNames('c-form_cancel-button', 'c-button', 'c-button-outline', 'c-button--min-width', cancelButtonClassName)
    };

    return (

        <FinalForm
            initialValues={initialValues}
            onSubmit={submitAction}
            validate={handleValidate}
            render={({ 
                form,
                errors,
                hasValidationErrors,
                handleSubmit, 
                submitting 
            }) => (
                
                <form 
                    action={action} 
                    method={method}
                    onSubmit={(event: any) => {

                        event.preventDefault();

                        /**
                         * Handle client-side validation failure in forms
                         */
                        if(hasValidationErrors){

                            validationFailAction?.(errors);

                        }

                        /**
                         * Submit and then reset the form on success
                         */
                        handleSubmit()?.then(() => form.restart());

                    }} 
                    className={generatedClasses.wrapper}>
                        <Field
                            key="_csrf"
                            id={`_csrf${instanceId}`}
                            name="_csrf"
                            component={formComponents.hidden} 
                            defaultValue={csrfToken} />
                        <Field
                            key="_form-id"
                            id={`_form-id${instanceId}`}
                            name="_form-id"
                            component={formComponents.hidden} 
                            defaultValue={formId} />
                        {instanceId &&
                            <Field
                                key="_instance-id"
                                id={`_instance-id${instanceId}`}
                                name="_instance-id"
                                component={formComponents.hidden} 
                                defaultValue={instanceId} />
                        }
                        <div className={generatedClasses.body}>
                            {fields?.map(({ 
                                name, 
                                inputType, 
                                text, 
                                shouldRenderAsRte,
                                component,
                                className 
                            }) => {

                                return (

                                    <Field
                                        key={name}
                                        name={name}
                                        inputType={inputType}
                                        text={text}
                                        component={formComponents[component]}
                                        instanceId={instanceId}
                                        shouldRenderAsRte={shouldRenderAsRte}
                                        className={className} />

                                )

                            })}
                        </div>
                        <div className={generatedClasses.buttonContainer}>
                            {shouldRenderCancelButton &&
                                <>
                                    <Link href={cancelHref}> 
                                        <a className={generatedClasses.cancelButton} onClick={handleCancel}>
                                            {cancelButton}
                                        </a>
                                    </Link>
                                    <Dialog 
                                        id="dialog-discard-discussion"
                                        isOpen={isCancelModalOpen}
                                        text={{
                                            cancelButton: 'Cancel',
                                            confirmButton: 'Yes, discard'
                                        }}
                                        cancelAction={handleDiscardFormCancel}
                                        confirmAction={handleDiscardFormConfirm}>
                                            <h3>Entered Data will be lost</h3>
                                            <p className="u-text-bold">Any entered details will be discarded. Are you sure you wish to proceed?</p>
                                    </Dialog>
                                </>
                            }
                            <button 
                                disabled={submitting}
                                type="submit" 
                                className={generatedClasses.submitButton}>
                                    {submitButton}
                            </button>
                        </div>
                        <FormSpy
                            subscription={{
                                touched: true,
                                errors: true,
                                submitErrors: true,
                                submitFailed: true, 
                                submitSucceeded: true,
                                modifiedSinceLastSubmit: true
                            }}
                            onChange={handleChange}
                        />
                </form>

            )}
        />
    )
    

}
