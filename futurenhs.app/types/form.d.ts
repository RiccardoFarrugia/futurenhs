import { ServiceResponse } from "@appTypes/service";
import { services as serviceId } from "@constants/services";
import { Option } from "@appTypes/option";

declare type Component = any;
declare type InputType = string;
declare type ValidatorType = string;

export interface FormOptions {
    value: string;
    label: string;
}

export interface FormField {
    component: Component;
    inputType?: InputType;
    name?: string;
    text?: {
        label?: string;
        legend?: string;
        hint?: string;
    };
    fields?: Array<FormField>;
    options?: Array<FormOptions>;
    initialError?: string;
    shouldRenderAsRte?: boolean;
    shouldPreventFreeText?: boolean;
    shouldRenderRemainingCharacterCount?: boolean;
    validators?: Array<{
        type: ValidatorType;
        maxLength?: number;
        maxFileSize?: number;
        validFileExtensions?: Array<string>;
        message: string;
    }>;
    relatedFields?: Record<string, string>;
    services?: Record<string, (config: Record<string, any>, dependencies: Record<string, any>) => ServiceResponse<Array<Option>>>;
    serviceId?: serviceId;
    className?: string;
    optionClassName?: string;
}

export interface FormStep {
    fields: Array<FormField>;
}

export interface FormConfig {
    id: string;
    initialValues?: Record<string, any>;
    errors?: Record<string, string>;
    steps: Array<FormStep>;
}

export type FormErrors = Record<string, string>;