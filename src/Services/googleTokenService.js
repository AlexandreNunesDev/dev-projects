
import axios from 'axios';

export const getOauthToken = async () => {
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAwUkhGE3_YB8cT4706OKT-xi3RpvnL014")
}
/*     function authorize(credentials) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client
    } */