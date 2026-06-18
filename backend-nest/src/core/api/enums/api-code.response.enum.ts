export enum ApiCodeResponse {
    // Success
    COMMON_SUCCESS = 'api.success.common',

    // Common errors
    PAYLOAD_IS_NOT_VALID = 'api.error.payload_is_not_valid',

    // Authentication errors (Security)
    USER_NOT_FOUND = 'api.error.user_not_found',
    USER_ALREADY_EXIST = 'api.error.user_already_exist',
    TOKEN_EXPIRED = 'api.error.token_expired',
    NO_TOKEN_FOUND = 'api.error.no_token_found',
    SIGNUP_ERROR = 'api.error.signup_error',
    TOKEN_GEN_ERROR = 'api.error.token_gen_error',
    INVALID_CREDENTIALS = 'api.error.invalid_credentials',
    EMAIL_ALREADY_EXISTS = 'api.error.email_already_exists',
    NICKNAME_ALREADY_EXISTS = 'api.error.nickname_already_exists',
    TOKEN_CREDENTIAL_MISSING = 'api.error.token_credential_missing',

    // Member Errors
    MEMBER_NOT_FOUND = 'api.error.member_not_found',

    // Recipe errors
    RECIPE_NOT_FOUND = 'api.error.recipe_not_found',
    RECIPE_FORBIDDEN_ACTION = 'api.error.recipe_forbidden_action'
}
