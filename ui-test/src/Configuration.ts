require('dotenv').config({path: __dirname + '/../.env'});

export default class Configuration {
    // Test specific
    public static readonly ENABLE_CONSOLE_LOG: string | undefined = process.env.ENABLE_CONSOLE_LOG;
    public static readonly TEST_TIMEOUT: string | undefined = process.env.TEST_TIMEOUT;
    // ArgoCD UI specific.  These are for single application-based tests, so one can quickly create an app based on the environment variables
    public static readonly ARGOCD_URL: string = process.env.ARGOCD_URL ? process.env.ARGOCD_URL : '';
    public static readonly ARGOCD_AUTH_USERNAME: string = process.env.ARGOCD_AUTH_USERNAME || '';
    public static readonly ARGOCD_AUTH_PASSWORD: string = process.env.ARGOCD_AUTH_PASSWORD || '';
    public static readonly APP_NAME: string = process.env.APP_NAME ? process.env.APP_NAME : '';
    public static readonly APP_PROJECT: string = process.env.APP_PROJECT ? process.env.APP_PROJECT : '';
    public static readonly SYNC_POLICY: string = process.env.SYNC_POLICY ? process.env.SYNC_POLICY : '';
    public static readonly GIT_REPO: string = process.env.GIT_REPO ? process.env.GIT_REPO : '';
    public static readonly REPOSITORY_REVISION: string = process.env.REPOSITORY_REVISION ? process.env.REPOSITORY_REVISION : '';
    public static readonly SOURCE_REPO_PATH: string = process.env.SOURCE_REPO_PATH ? process.env.SOURCE_REPO_PATH : '';

    public static readonly DESTINATION_CLUSTER_NAME: string = process.env.DESTINATION_CLUSTER_NAME ? process.env.DESTINATION_CLUSTER_NAME : '';
    public static readonly DESTINATION_NAMESPACE: string = process.env.DESTINATION_NAMESPACE ? process.env.DESTINATION_NAMESPACE : '';
    //Openshift cluster login 
    // public static readonly OSC_URL: string = process.env.OSC_URL ? process.env.OSC_URL : '';
    // public static readonly OSC_USERNAME: string = process.env.OSC_USERNAME ? process.env.OSC_USERNAME : '';
    // public static readonly OSC_PASSWORD: string = process.env.OSC_PASSWORD ? process.env.OSC_PASSWORD : '';
    // public static readonly OSC_LABEL_KEY: string = process.env.OSC_LABEL_KEY ? process.env.OSC_LABEL_KEY : '';
    // public static readonly OSC_LABEL_VALUE: string = process.env.OSC_LABEL_VALUE ? process.env.OSC_LABEL_VALUE : '';
}
