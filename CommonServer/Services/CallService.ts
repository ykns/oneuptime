import EmptyResponseData from 'Common/Types/API/EmptyResponse';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import Route from 'Common/Types/API/Route';
import URL from 'Common/Types/API/URL';
import { JSONObject } from 'Common/Types/JSON';
import API from 'Common/Utils/API';
import { NotificationHostname } from '../Config';
import Protocol from 'Common/Types/API/Protocol';
import ClusterKeyAuthorization from '../Middleware/ClusterKeyAuthorization';
import Phone from 'Common/Types/Phone';
import ObjectID from 'Common/Types/ObjectID';
import CallRequest from 'Common/Types/Call/CallRequest';

export default class CallService {
    public static async makeCall(
        to: Phone,
        callRequest: CallRequest,
        options: {
            projectId?: ObjectID | undefined; // project id for sms log
            from?: Phone; // from phone number
            isSensitive?: boolean; // if true, message will not be logged
        }
    ): Promise<HTTPResponse<EmptyResponseData>> {
        const body: JSONObject = {
            to: to.toString(),
            callRequest: callRequest,
            from: options.from?.toString(),
            projectId: options.projectId?.toString(),
            isSensitive: options.isSensitive,
        };

        return await API.post<EmptyResponseData>(
            new URL(
                Protocol.HTTP,
                NotificationHostname,
                new Route('/call/make-call')
            ),
            body,
            {
                ...ClusterKeyAuthorization.getClusterKeyHeaders(),
            }
        );
    }
}
