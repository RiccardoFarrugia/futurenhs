import { actions } from '@constants/actions';
import { ServiceError } from '..';
import { setGetFetchOpts as setGetFetchOptionsHelper, fetchJSON as fetchJSONHelper } from '@helpers/fetch';
import { FetchResponse } from '@appTypes/fetch';
import { ApiResponse, ServiceResponse } from '@appTypes/service';
import { User } from '@appTypes/user';

declare type Options = ({
    user: User;
});

declare type Dependencies = ({
    setGetFetchOptions: any;
    fetchJSON: any;
});

export type GetGroupActionsService = (options: Options, dependencies?: Dependencies) => Promise<ServiceResponse<Array<actions>>>;

export const getSiteActions = async ({
    user
}: Options, dependencies?: Dependencies): Promise<ServiceResponse<Array<actions>>> => {

    const setGetFetchOptions = dependencies?.setGetFetchOptions ?? setGetFetchOptionsHelper;
    const fetchJSON = dependencies?.fetchJSON ?? fetchJSONHelper;

    const { id } = user;

    const apiUrl: string = `${process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL}/v1/users/${id}/actions`;
    const apiResponse: FetchResponse = await fetchJSON(apiUrl, setGetFetchOptions({}), 30000);
    const apiData: ApiResponse<any> = apiResponse.json;
    const apiMeta: any = apiResponse.meta;

    const { ok, status, statusText } = apiMeta;

    if(!ok){

        throw new ServiceError('Error getting site actions', {
            status: status,
            statusText: statusText,
            body: apiData
        });

    }

    const data = apiData;

    return {
        data: data
    };

}