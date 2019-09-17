import {google} from 'googleapis';
import config from 'config';

const createConnection = () => {
    return new google.auth.OAuth2(
        config.googleKeys.clientId,
        config.googleKeys.clientSecret,
        config.googleKeys.redirectURI
    );
}

const defaultScope ='https://www.googleapis.com/auth/drive.metadata.readonly'

const getConnectionURL = (auth) => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

const urlGoogle = () => {
    const auth = createConnection();
    const url = getConnectionURL(auth);
    return url;
}

export default { urlGoogle };