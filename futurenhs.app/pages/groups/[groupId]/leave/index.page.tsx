import { GetServerSideProps } from 'next';

import { routes } from '@constants/routes';
import { routeParams } from '@constants/routes';
import { selectParam } from '@selectors/context';
import { withUser } from '@hofs/withUser';
import { withGroup } from '@hofs/withGroup';
import { handleSSRErrorProps } from '@helpers/util/ssr/handleSSRErrorProps';
import { deleteGroupMembership } from '@services/deleteGroupMembership';
import { GetServerSidePropsContext } from '@appTypes/next';

import { GroupUpdateTemplate } from '@components/_pageTemplates/GroupUpdateTemplate';
import { Props } from '@components/_pageTemplates/GroupUpdateTemplate/interfaces';

const routeId: string = 'not-required';
const props: Partial<Props> = {};

/**
 * Get props to inject into page on the initial server-side request
 */
export const getServerSideProps: GetServerSideProps = withUser({
    props,
    getServerSideProps: withGroup({
        props,
        getServerSideProps: async (context: GetServerSidePropsContext) => {

            const groupId: string = selectParam(context, routeParams.GROUPID);

            /**
             * Get data from services
             */
            try {

                await deleteGroupMembership({ groupId, user: props.user });

            } catch (error) {

                return handleSSRErrorProps({ props, error });

            }

            /**
             * Return data to page template
             */
            return {
                redirect: {
                    permanent: false,
                    destination: routes.GROUPS
                }
            }

        }
    })
});

/**
 * Export page template
 */
export default GroupUpdateTemplate;