﻿import { UIComponentBase } from '@modules/ui/componentBase/index';

/**
 * Ajax Progressive enhancement for form element
 */
export class AjaxForm extends UIComponentBase {

    wrapperSelector: HTMLFormElement = undefined;
    successCallBack: Function = undefined;
    errorCallBack: Function = undefined;

    constructor(config: {
        wrapperSelector: HTMLFormElement,
        successCallBack?: Function,
        errorCallBack?: Function
    }) {

        super();

        this.wrapperSelector = config.wrapperSelector;
        this.wrapperSelector.addEventListener('submit', (event: any) => {

            event.preventDefault();

            ($(this) as any).validate();

            if (($(this) as any).valid()) {

                $.ajax({
                    url: (this as any).action,
                    type: (this as any).method,
                    data: $(this).serialize(),
                    dataType: "json",
                    cache: false,
                    success: (result) => this.emit('success', result),
                    error: (xhr, ajaxOptions, thrownError) => this.emit('error', xhr, ajaxOptions, thrownError)
                });

            }

        });

    }

}
