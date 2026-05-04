import {ApiCodeResponse} from './enums/api-code.response.enum';

export interface ApiResponse<T = any> {
    result: boolean;
    code: ApiCodeResponse | string;
    data: T | null;
}
