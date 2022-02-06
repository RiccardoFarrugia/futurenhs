import React from 'react';
import classNames from 'classnames';

import { initials } from '@helpers/formatters/initials';
import { Avatar } from '@components/Avatar';

import { Props } from './interfaces';

export const UserProfile: (props: Props) => JSX.Element = ({
    member,
    text,
    image,
    className
}) => {

    const { firstName,
            lastName,
            pronouns,
            email } = member ?? {};

    const { heading, 
            firstNameLabel, 
            lastNameLabel, 
            pronounsLabel, 
            emailLabel } = text;

    const userInitials: string = initials({ value: `${firstName} ${lastName}` });

    const generatedClasses: any = {
        wrapper: classNames('c-profile', className),
        image: classNames('c-profile_image'),
        heading: classNames('c-profile_heading'),
        data: classNames('c-profile_data'),
        label: classNames('c-profile_data-label', 'u-text-bold'),
        value: classNames('c-profile_data-value')
    };

    return (

        <div className={generatedClasses.wrapper}>
            <h2 className={generatedClasses.heading}>{heading}</h2>
            <Avatar image={image} initials={userInitials} className={generatedClasses.image} />
            <dl className={generatedClasses.data}>
                {firstName &&
                    <>
                        <dt className={generatedClasses.label}>{firstNameLabel}</dt>
                        <dd className={generatedClasses.value}>{firstName}</dd>
                    </>
                }
                {lastName &&
                    <>
                        <dt className={generatedClasses.label}>{lastNameLabel}</dt>
                        <dd className={generatedClasses.value}>{lastName}</dd>
                    </>
                }
                {pronouns &&
                    <>
                        <dt className={generatedClasses.label}>{pronounsLabel}</dt>
                        <dd className={generatedClasses.value}>{pronouns}</dd>
                    </>
                }
                {email &&
                    <>
                        <dt className={generatedClasses.label}>{emailLabel}</dt>
                        <dd className={generatedClasses.value}>{email}</dd>
                    </>
                }
            </dl>
        </div>

    );
}