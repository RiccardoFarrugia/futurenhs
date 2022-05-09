import { GetServerSideProps } from 'next'

import { handleSSRSuccessProps } from '@helpers/util/ssr/handleSSRSuccessProps'
import { handleSSRErrorProps } from '@helpers/util/ssr/handleSSRErrorProps'
import { routeParams } from '@constants/routes'
import { formTypes } from '@constants/forms'
import { layoutIds, groupTabIds } from '@constants/routes'
import { withUser } from '@hofs/withUser'
import { withRoutes } from '@hofs/withRoutes'
import { withGroup } from '@hofs/withGroup'
import { withForms } from '@hofs/withForms'
import { withTextContent } from '@hofs/withTextContent'
import { getGroupMember } from '@services/getGroupMember'
import { selectUser, selectParam, selectCsrfToken, selectFormData } from '@selectors/context'
import { GetServerSidePropsContext } from '@appTypes/next'
import { User } from '@appTypes/user'

import { GroupMemberUpdateTemplate } from '@components/_pageTemplates/GroupMemberUpdateTemplate'
import { Props } from '@components/_pageTemplates/GroupMemberTemplate/interfaces'
import { actions } from '@constants/actions'

const routeId: string = '4502d395-7c37-4e80-92b7-65886de858ef'
const props: Partial<Props> = {}

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
                getServerSideProps: withTextContent({
                    props,
                    routeId,
                    getServerSideProps: async (
                        context: GetServerSidePropsContext
                    ) => {
                        const user: User = selectUser(context)
                        const csrfToken: string = selectCsrfToken(context)
                        const currentValues: any = selectFormData(context)

                        if (!props.actions.includes(actions.GROUPS_MEMBERS_EDIT)) {
                            return {
                                notFound: true,
                            }
                        }

                        const groupId: string = selectParam(
                            context,
                            routeParams.GROUPID
                        )
                        const memberId: string = selectParam(
                            context,
                            routeParams.MEMBERID
                        )

                        const form: any =
                            props.forms[formTypes.UPDATE_GROUP_MEMBER]

                        /**
                         * Get data from services
                         */
                        try {
                            const [memberData] = await Promise.all([
                                getGroupMember({ groupId, user, memberId, isForEdit: true }),
                            ])
                            const etag = memberData.headers?.get('etag');

                            props.etag = etag

                            props.member = memberData.data
                            props.layoutId = layoutIds.GROUP
                            props.tabId = groupTabIds.MEMBERS
                            props.pageTitle = `${props.entityText.title} - ${
                                props.member.firstName ?? ''
                            } ${props.member.lastName ?? ''} - Edit`

                            form.initialValues = {
                                'member-role': props.member.role,
                            }

                            console.log(props);
                        } catch (error) {
                            return handleSSRErrorProps({ props, error })
                        }

                        /**
                         * Return data to page template
                         */
                        return handleSSRSuccessProps({ props })
                    },
                }),
            }),
        }),
    }),
})

/**
 * Export page template
 */
export default GroupMemberUpdateTemplate