import { formTypes } from "@constants/forms";
import { FormConfig } from '@appTypes/form';

export const createGroupForm: FormConfig = {
    id: formTypes.CREATE_GROUP,
    steps: [
        {
            fields: [
                {
                    name: 'Name',
                    inputType: 'text',
                    text: {
                        label: 'Group name',
                        hint: 'Add your group name, this will be used to search for the group '
                    },
                    component: 'input',
                    shouldRenderRemainingCharacterCount: true,
                    validators: [
                        {
                            type: 'required',
                            message: 'Enter the group name'
                        },
                        {
                            type: 'maxLength',
                            maxLength: 255,
                            message: 'Enter 255 or fewer characters'
                        }
                    ]
                },
                {
                    name: 'Strapline',
                    text: {
                        label: 'Strap line (optional)',
                        hint: 'Add a strapline to encapsulate your group, include keywords for search'

                    },
                    component: 'textArea',
                    shouldRenderRemainingCharacterCount: true,
                    validators: [
                        {
                            type: 'maxLength',
                            maxLength: 1000,
                            message: 'Enter 1000 or fewer characters'
                        }
                    ]
                },
                {
                    name: 'File',
                    text: {
                        label: 'Logo (optional)',
                        hint: 'Please upload your logo or an icon. If not, we will use the default image'
                    },
                    component: 'imageUpload',
                    relatedFields: {
                        fileId: 'ImageId'
                    }
                },
                {
                    name: 'ImageId',
                    component: 'hidden'
                },
            ]
        }
    ]
};