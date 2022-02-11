import { GetServerSideProps } from 'next';

import { getJsonSafeObject } from '@helpers/routing/getJsonSafeObject';
import { withAuth } from '@hofs/withAuth';
import { withTextContent } from '@hofs/withTextContent';
import { getGroups } from '@services/getGroups';
import { selectProps, selectUser, selectPagination } from '@selectors/context';
import { GetServerSidePropsContext } from '@appTypes/next';
import { User } from '@appTypes/user';

import { GroupListingTemplate } from '@components/_pageTemplates/GroupListingTemplate';

const routeId: string = '8190d347-e29a-4577-baa8-446bcae428d9';
const isGroupMember: boolean = false;

/**
 * Get props to inject into page on the initial server-side request
 */
export const getServerSideProps: GetServerSideProps = withAuth({
    getServerSideProps: withTextContent({
        routeId: routeId,
        getServerSideProps: async (context: GetServerSidePropsContext) => {

            /**
             * Get data from request context
             */
            const user: User = selectUser(context);
            const initialPageNumber: number = selectPagination(context).pageNumber ?? 1;
            const initialPageSize: number = selectPagination(context).pageSize ?? 10;
    
            let props: any = selectProps(context);
    
            /**
             * Get data from services
             */
            try {
    
                const [
                    groupsList,
                ] = await Promise.all([
                    getGroups({
                        user: user,
                        isMember: isGroupMember,
                        pagination: {
                            pageNumber: initialPageNumber,
                            pageSize: initialPageSize
                        }
                    })
                ]);
    
                props.isGroupMember = isGroupMember;
                props.groupsList = groupsList.data ?? [];
                props.pagination = groupsList.pagination;
            
            } catch (error) {
                
                if (error.name === 'ServiceError') {

                    props.errors = [{
                        [error.data.status]: error.data.statusText
                    }];

                }
    
            }
    
            /**
             * Return data to page template
             */
            return {
                props: getJsonSafeObject({
                    object: props
                })
            }
    
        }
    })
});

/**
 * Export page template
 */
export default GroupListingTemplate;
