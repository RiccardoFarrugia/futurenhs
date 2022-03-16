import { GetServerSideProps } from 'next';

import { handleSSRSuccessProps } from '@helpers/util/ssr/handleSSRSuccessProps';
import { handleSSRErrorProps } from '@helpers/util/ssr/handleSSRErrorProps';
import { getServerSideMultiPartFormData } from '@helpers/util/form';
import { getStandardServiceHeaders } from '@helpers/fetch';
import { layoutIds, groupTabIds } from '@constants/routes';
import { formTypes } from '@constants/forms';
import { routeParams } from '@constants/routes';
import { requestMethods } from '@constants/fetch';
import { actions as actionConstants } from '@constants/actions';
import { withUser } from '@hofs/withUser';
import { withRoutes } from '@hofs/withRoutes';
import { withGroup } from '@hofs/withGroup';
import { withForms } from '@hofs/withForms';
import { selectCsrfToken, selectFormData, selectParam, selectUser, selectRequestMethod } from '@selectors/context';
import { putGroupFolder } from '@services/putGroupFolder';
import { getGroupFolder } from '@services/getGroupFolder';
import { GetServerSidePropsContext } from '@appTypes/next';
import { User } from '@appTypes/user';

import { groupFolderForm } from '@formConfigs/group-folder';
import { GroupCreateUpdateFolderTemplate } from '@components/_pageTemplates/GroupCreateUpdateFolderTemplate';
import { Props } from '@components/_pageTemplates/GroupCreateUpdateFolderTemplate/interfaces';
import { withTextContent } from '@hofs/withTextContent';

const routeId: string = 'cd828945-f799-40e9-be00-64e76809e00d';
const props: Partial<Props> = {};

/**
 * Get props to inject into page on the initial server-side request
 */
export const getServerSideProps: GetServerSideProps = withUser({
    props,
    getServerSideProps: withRoutes({
        props,
        getServerSideProps: withGroup({
            props,
            getServerSideProps: withForms({
                props,
                routeId,
                getServerSideProps: withTextContent({
                    props,
                    routeId,
                    getServerSideProps: async (context: GetServerSidePropsContext) => {

                        const user: User = selectUser(context);
                        const groupId: string = selectParam(context, routeParams.GROUPID);
                        const folderId: string = selectParam(context, routeParams.FOLDERID);
                        const csrfToken: string = selectCsrfToken(context);
                        const formData: any = selectFormData(context);
                        const requestMethod: string = selectRequestMethod(context);

                        props.layoutId = layoutIds.GROUP;
                        props.tabId = groupTabIds.FILES;
                        props.folderId = folderId;

                        /**
                         * Return not found if user does not have folder edit action
                         */
                        if (!props.actions?.includes(actionConstants.GROUPS_FOLDERS_EDIT)) {

                            return {
                                notFound: true
                            }

                        }

                        /**
                         * Get data from services
                         */
                        if (folderId) {

                            try {

                                const [groupFolder] = await Promise.all([getGroupFolder({ user, groupId, folderId })]);
                                const etag: string = groupFolder.headers.get('etag');

                                props.etag = etag;
                                props.folder = groupFolder.data;
                                props.forms[formTypes.GROUP_FOLDER].initialValues = {
                                    'name': props.folder?.text?.name,
                                    'description': props.folder?.text?.body
                                };

                                /**
                                 * handle server-side form POST
                                 */
                                if (formData && requestMethod === requestMethods.POST) {

                                    props.forms[groupFolderForm.id].initialValues = formData;

                                    const headers = getStandardServiceHeaders({ csrfToken, etag });
                                    const body = getServerSideMultiPartFormData(formData) as any;

                                    await putGroupFolder({ groupId, folderId, user, headers, body });

                                    return {
                                        redirect: {
                                            permanent: false,
                                            destination: props.routes.groupFolder
                                        }
                                    }

                                }

                            } catch (error) {

                                if (error.data?.status) {

                                    props.forms[groupFolderForm.id].errors = error.data.body || {
                                        _error: error.data.statusText
                                    };

                                } else {

                                    return handleSSRErrorProps({ props, error });

                                }

                            }

                        }

                        /**
                         * Return data to page template
                         */
                        return handleSSRSuccessProps({ props });

                    }
                })
            })
        })
    })
});

/**
 * Export page template
 */
export default GroupCreateUpdateFolderTemplate;