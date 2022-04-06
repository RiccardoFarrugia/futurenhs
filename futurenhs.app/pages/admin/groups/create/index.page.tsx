import { GetServerSideProps } from 'next';
import { GetServerSidePropsContext } from '@appTypes/next';

import { handleSSRErrorProps } from '@helpers/util/ssr/handleSSRErrorProps';
import { actions } from '@constants/actions';
import { withUser } from '@hofs/withUser';
import { withRoutes } from '@hofs/withRoutes';
import { withTextContent } from '@hofs/withTextContent';
import { withForms } from '@hofs/withForms';
import { Props } from '@components/_pageTemplates/GroupUpdateTemplate/interfaces';
import { layoutIds } from '@constants/routes';

import { AdminCreateGroupTemplate } from '@components/_pageTemplates/AdminCreateGroupTemplate';

const routeId: string = '3161df94-3a6f-4b40-8ed4-e7a39125885a';
const props: Partial<Props> = {};

/**
 * Get props to inject into page on the initial server-side request
 */
export const getServerSideProps: GetServerSideProps = withUser({
    props,
    getServerSideProps: withRoutes({
        props,

        getServerSideProps: withTextContent({
            props,
            routeId,
            getServerSideProps: withForms({
                props,
                routeId,
                getServerSideProps: async (context: GetServerSidePropsContext) => {

                    props.layoutId = layoutIds.ADMIN;

                    /**
                     * Return data to page template
                     */
                    return {
                        notFound: !props.actions.includes(actions.SITE_ADMIN_VIEW),
                        props: props
                    }

                }
            })
        })
    })
});

/**
 * Export page template
 */
export default AdminCreateGroupTemplate;

