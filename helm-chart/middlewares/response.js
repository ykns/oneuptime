/* eslint-disable no-console */
/**
 *
 * Copyright HackerBay, Inc.
 *
 */

module.exports = {
    sendEmptyResponse(req, res) {
        //purge request.
        //req = null;
        return res.status(200).send();
    }
};
