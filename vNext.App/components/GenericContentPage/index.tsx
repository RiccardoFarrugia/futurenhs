import Head from 'next/head';

import { StandardLayout } from '@components/_pageLayouts/StandardLayout';
import { LayoutColumnContainer } from '@components/LayoutColumnContainer';
import { LayoutColumn } from '@components/LayoutColumn';

import { Props } from './interfaces';

export const GenericContentPage: (props: Props) => JSX.Element = ({
    isAuthenticated,
    content
}) => {

    const { metaDescriptionText, 
            titleText, 
            mainHeadingHtml } = content ?? {};

    return (

        <StandardLayout 
            shouldRenderSearch={isAuthenticated}
            shouldRenderUserNavigation={isAuthenticated}
            shouldRenderMainNav={isAuthenticated}>
                <Head>
                    <title>{titleText}</title>
                    <meta name="description" content={metaDescriptionText} />
                </Head>
                <LayoutColumnContainer className="u-py-10">
                    <h1>{mainHeadingHtml}</h1>
                </LayoutColumnContainer>
        </StandardLayout>

    )

}
