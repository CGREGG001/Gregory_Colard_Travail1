export enum ApiCodeResponse {
    // Succès
    COMMON_SUCCESS = 'api.success.common',

    // Erreurs Communes
    PAYLOAD_IS_NOT_VALID = 'api.error.payload_is_not_valid',

    // Erreurs d'Authentification (Security)
    USER_NOT_FOUND = 'api.error.user_not_found',
    USER_ALREADY_EXIST = 'api.error.user_already_exist',
    TOKEN_EXPIRED = 'api.error.token_expired',
    NO_TOKEN_FOUNDED = 'api.error.no_token_founded',
    SIGNUP_ERROR = 'api.error.signup_error',
    TOKEN_GEN_ERROR = 'api.error.token_gen_error',
    INVALID_CREDENTIALS = 'api.error.invalid_credentials',
    EMAIL_ALREADY_EXISTS = 'api.error.email_already_exists',
    NICKNAME_ALREADY_EXISTS = 'api.error.nickname_already_exists',
    TOKEN_CREDENTIAL_MISSING = 'api.error.token_credential_missing',

    MEMBER_NOT_FOUND = 'api.error.member_not_found',
}
