import { formTypes } from '@constants/forms'
import { FormConfig } from '@appTypes/form'

export const contentBlockQuickLink: FormConfig = {
    id: formTypes.CONTENT_BLOCK_QUICK_LINK,
    steps: [
        {
            fields: [
                {
                    name: 'title',
                    inputType: 'text',
                    text: {
                        label: 'Link title',
                    },
                    component: 'input',
                    validators: [
                        {
                            type: 'required',
                            message: 'Enter the link title',
                        }
                    ],
                    className: 'u-grow tablet:u-mr-3'
                },
                {
                    name: 'link',
                    inputType: 'text',
                    text: {
                        label: 'Link',
                    },
                    component: 'input',
                    validators: [
                        {
                            type: 'required',
                            message: 'Enter the link',
                        }
                    ],
                    className: 'u-grow'
                }
            ],
        },
    ],
}
