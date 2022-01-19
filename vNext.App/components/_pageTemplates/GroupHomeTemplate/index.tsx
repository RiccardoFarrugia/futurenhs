import { GroupLayout } from '@components/_pageLayouts/GroupLayout';
import { LayoutColumn } from '@components/LayoutColumn';

import { Props } from './interfaces';

export const GroupHomeTemplate: (props: Props) => JSX.Element = ({
    user,
    content,
    image,
    actions
}) => {

    return (

        <GroupLayout 
            id="index"
            user={user}
            content={content}
            image={image}
            actions={actions}
            className="u-bg-theme-3">
                <LayoutColumn tablet={8} className="c-page-body">
                    
                </LayoutColumn>
        </GroupLayout>

    )

}