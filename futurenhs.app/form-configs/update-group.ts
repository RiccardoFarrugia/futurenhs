import { formTypes } from "@constants/forms";
import { themes } from "@constants/themes";
import { selectTheme } from "@selectors/themes";
import { isLight } from '@helpers/util/theme/isLight';
import { FormConfig } from '@appTypes/form';
import { Theme } from "@appTypes/theme";

const getThemeLabel = ({ themeId, number }): string => {

    const { background, 
            content, 
            accent }: Theme = selectTheme(themes, themeId);

    const backgroundBorderClass: string = isLight({ colorId: background }) ? 'u-border-theme-4' : `u-border-theme-${background}`;
    const contentBorderClass: string = isLight({ colorId: content }) ? 'u-border-theme-4' : `u-border-theme-${content}`;
    const accentBorderClass: string = isLight({ colorId: accent }) ? 'u-border-theme-4' : `u-border-theme-${accent}`;

    return `<span class="c-theme-tokens">
                <span class=\"u-sr-only\">Theme ${number}</span>
                <span label="Background" class="c-theme-tokens_theme u-w-10 u-h-10 u-bg-theme-${background} ${backgroundBorderClass}"></span>
                <span label="Text" class="c-theme-tokens_theme u-w-6 u-h-6 u-bg-theme-${content} ${contentBorderClass}"></span>
                <span label="Accent" class="c-theme-tokens_theme u-w-6 u-h-6 u-bg-theme-${accent} ${accentBorderClass}"></span>
            </span>`;

}

export const updateGroupForm: FormConfig = {
    id: formTypes.UPDATE_GROUP,
    steps: [
        {
            fields: [
                {
                    name: 'name',
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
                    name: 'strapline',
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
                    name: 'logo',
                    text: {
                        label: 'Logo (optional)',
                        hint: 'Please upload your logo or an icon. If not, we will use the existing image.'
                    },
                    component: 'input',
                    inputType: 'file',
                    validators: [
                        {
                            type: 'maxFileSize',
                            maxFileSize: 500000,
                            message: 'The selected file must be smaller than 500Kb'
                        },
                        {
                            type: 'validFileExtensions',
                            validFileExtensions: ['jpg', 'png'],
                            message: 'The selected file must be a JPG or PNG'
                        }
                    ]
                },
                {
                    name: 'themeId',
                    text: {
                        label: 'Choose your theme colour',
                        hint: 'Please choose a colour theme for your group. Please note, all colour combinations are accessible. For more information, see our knowledge hub.'
                    },
                    component: 'multiChoice',
                    options: [
                        {
                            value: '36d49305-eca8-4176-bfea-d25af21469b9',
                            label: getThemeLabel({
                                themeId: '36d49305-eca8-4176-bfea-d25af21469b9',
                                number: 1
                            })
                        },
                        {
                            value: '0fca6809-a71f-4733-a622-343967acbad9',
                            label: getThemeLabel({
                                themeId: '0fca6809-a71f-4733-a622-343967acbad9',
                                number: 2
                            })
                        },
                        {
                            value: '9a3c911b-c3d3-4f58-a32a-d541e0f5bf56',
                            label: getThemeLabel({
                                themeId: '9a3c911b-c3d3-4f58-a32a-d541e0f5bf56',
                                number: 3
                            })                        
                        },
                        {
                            value: '5053a8c6-ea4d-4125-9dc3-475e3e931fee',
                            label: getThemeLabel({
                                themeId: '5053a8c6-ea4d-4125-9dc3-475e3e931fee',
                                number: 5
                            })
                        },
                        {
                            value: '53bce171-d6a3-4721-8199-92f10fca5ef2',
                            label: getThemeLabel({
                                themeId: '53bce171-d6a3-4721-8199-92f10fca5ef2',
                                number: 6
                            })                        
                        },
                        {
                            value: '217a1f99-5b25-4e3b-be3d-29c55c46be05',
                            label: getThemeLabel({
                                themeId: '217a1f99-5b25-4e3b-be3d-29c55c46be05',
                                number: 8
                            })
                        },
                        {
                            value: 'a7101d5f-acce-4ef7-b1c9-5dbf20d54580',
                            label: getThemeLabel({
                                themeId: 'a7101d5f-acce-4ef7-b1c9-5dbf20d54580',
                                number: 9
                            })
                        },
                        {
                            value: 'a9d8566d-162a-4fa3-b159-f604b12c214d',
                            label: getThemeLabel({
                                themeId: 'a9d8566d-162a-4fa3-b159-f604b12c214d',
                                number: 10
                            })
                        }
                    ],
                    validators: [
                        {
                            type: 'required',
                            message: 'Select the group theme'
                        }
                    ],
                    optionClassName: 'tablet:u-w-2/5'
                }
                // {
                //     name: 'features',
                //     text: {
                //         legend: 'Features included in your group',
                //         hint: 'Choose to include a forum, a file area and a members list on your group. These will be displayed in the group header.'
                //     },
                //     component: 'fieldSet',
                //     fields: [
                //         {
                //             name: 'include-forum-page',
                //             inputType: 'multiChoice',
                //             text: {
                //                 label: 'Include a forum page?'
                //             },
                //             options: [
                //                 {
                //                     value: 'yes',
                //                     label: 'Yes'
                //                 },
                //                 {
                //                     value: 'no',
                //                     label: 'No'
                //                 }
                //             ],
                //             component: 'multiChoice',
                //             validators: [
                //                 {
                //                     type: 'required',
                //                     message: 'Select whether the group should include a forum page'
                //                 }
                //             ]
                //         },
                //         {
                //             name: 'include-files-page',
                //             inputType: 'text',
                //             text: {
                //                 label: 'Include a files page?'
                //             },
                //             options: [
                //                 {
                //                     value: 'yes',
                //                     label: 'Yes'
                //                 },
                //                 {
                //                     value: 'no',
                //                     label: 'No'
                //                 }
                //             ],
                //             component: 'multiChoice',
                //             validators: [
                //                 {
                //                     type: 'required',
                //                     message: 'Select whether the group should include a files page'
                //                 }
                //             ]
                //         },
                //         {
                //             name: 'include-members-page',
                //             inputType: 'multiChoice',
                //             text: {
                //                 label: 'Include a members page?'
                //             },
                //             options: [
                //                 {
                //                     value: 'yes',
                //                     label: 'Yes'
                //                 },
                //                 {
                //                     value: 'no',
                //                     label: 'No'
                //                 }
                //             ],
                //             component: 'multiChoice',
                //             validators: [
                //                 {
                //                     type: 'required',
                //                     message: 'Select whether the group should include a members page'
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ]
        }
    ]
};