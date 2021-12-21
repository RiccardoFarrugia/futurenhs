import * as React from 'react';
import { render, screen } from '@testing-library/react';

import Page, { getServerSideProps } from './index.page';
import { Props } from '@components/_pageTemplates/GenericContentTemplate/interfaces';

const props: Props = {
    id: 'mockId',
    user: undefined,
    content: {
        titleText: 'mockTitle',
        metaDescriptionText: 'mockMetaDescriptionText',
        mainHeadingHtml: 'mockMainHeading',
    }
};

describe('Contact us page', () => {

    it('renders correctly', () => {

        render(<Page {...props} />);

        expect(screen.getAllByText('mockMainHeading').length).toEqual(1);

    });

    it('gets required server side props', async () => {

        const serverSideProps = await getServerSideProps({} as any);
                
        expect(serverSideProps).toHaveProperty('props.content');

    });
    
});
