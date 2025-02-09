import {
    setFetchOpts as setFetchOptionsHelper,
    fetchJSON as fetchJSONHelper,
} from '@helpers/fetch'
import { services } from '@constants/services'
import { defaultTimeOutMillis, requestMethods } from '@constants/fetch'
import { ServiceError } from '..'
import { FetchResponse } from '@appTypes/fetch'
import { ApiResponse, ServiceResponse } from '@appTypes/service'
import { User } from '@appTypes/user'
import { GroupMember } from '@appTypes/group'
import { Member } from '@appTypes/member'

declare type Options = {
    user: User
    targetUserId: string
}

declare type Dependencies = {
    setFetchOptions: any
    fetchJSON: any
}

export const getSiteUser = async (
    { user, targetUserId }: Options,
    dependencies?: Dependencies
): Promise<ServiceResponse<Member>> => {
    const serviceResponse: ServiceResponse<Member> = {
        data: null,
    }

    const setFetchOptions =
        dependencies?.setFetchOptions ?? setFetchOptionsHelper
    const fetchJSON = dependencies?.fetchJSON ?? fetchJSONHelper

    const { id } = user 

    const apiUrl: string = `${process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL}/v1/users/${id}/users/${targetUserId}/update`
    const apiResponse: FetchResponse = await fetchJSON(
        apiUrl,
        setFetchOptions({ method: requestMethods.GET }),
        defaultTimeOutMillis
    )

    const apiData: ApiResponse<any> = apiResponse.json
    const apiMeta: any = apiResponse.meta

    const { ok, status, statusText, headers } = apiMeta

    if (!ok) {
        throw new ServiceError(
            'An unexpected error occurred when attempting to get the site user',
            {
                serviceId: services.GET_SITE_USER,
                status: status,
                statusText: statusText,
                body: apiData,
            }
        )
    }

    serviceResponse.headers = headers
    serviceResponse.data = {
        id: apiData.id ?? '',
        firstName: apiData.firstName ?? '',
        lastName: apiData.surname ?? '',
        email: apiData.email ?? '',
        pronouns: apiData.pronouns ?? '',
        role: apiData.roleId ?? '',
        image: apiData.image
        ? {
              src: `${apiData.image?.source}`,
              height: apiData?.image?.height,
              width: apiData?.image?.width,
              altText: 'Profile image',
          }
        : null,
        imageId: apiData.imageId ?? ''
    }

    return serviceResponse
}
