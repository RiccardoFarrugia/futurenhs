import * as React from 'react';
import * as nextRouter from 'next/router';
import { render, screen } from '@testing-library/react';

import Page from './index.page';
import { Props } from '@components/_pageTemplates/GroupFoldersTemplate/interfaces';

describe('Group file page', () => {

    (nextRouter as any).useRouter = jest.fn();
    (nextRouter as any).useRouter.mockImplementation(() => ({ 
        asPath: '/groups/group/files' 
    }));

    const props: Props = {
        id: 'mockId',
        folderId: 'mockId',
        files: [],
        user: undefined,
        content: {
            titleText: 'Mock title text',
            metaDescriptionText: 'Mock meta description text',
            mainHeadingHtml: 'Mock main heading html',
            introHtml: 'Mock intro html',
            navMenuTitleText: 'Mock nav menu title text',
            secondaryHeadingHtml: 'Mock secondary heading html'
        },
        image: null
    };

    it('renders correctly', () => {

        render(<Page {...props} />);

        expect(screen.getAllByText('Mock main heading html').length).toEqual(1);

    });
    
});
