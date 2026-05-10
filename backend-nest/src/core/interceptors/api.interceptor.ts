import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor
} from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { map, Observable } from "rxjs";
import { isNil } from "lodash";

import { configManager } from "@core/config";
import { ConfigKey } from "@core/config/enums/config-key.enum";
import { ApiCodeResponse, ApiResponse } from "@core/api";

@Injectable()
export class ApiInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ApiInterceptor.name);
    
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const route = ctx.getRequest().route;
    const path: string = route?.path ?? '';

    return next
        .handle()
        .pipe(
            map((data: any) => {
                // Handle 204 No Content (like Logout) to avoid sending a body
                if (response.statusCode === 204) {
                    return undefined;
                }

                // Format to standardized ApiResponse
                const apiResponse: ApiResponse<any> = {
                    result: true,
                    code: this.mapCode(path),
                    data: instanceToPlain(data) // Triggers @Exclude() and other class-transformer decorators
                };

                return apiResponse;
            })
        );
    }

    private mapCode(path: string): ApiCodeResponse {
        // Log removed in production to avoid log pollution, but useful in dev
        this.logger.debug(`Mapping response code for path: ${path}`);

        try {
            // Check if APP_BASE_URL exists in config, otherwise fallback to empty string
            const baseUrl = configManager.getValue(ConfigKey.APP_BASE_URL, false) || '';

            const parts = path
                .replace(baseUrl, '')
                .split('/')
                .filter(s => s.length > 0)
                .slice(0, 2)
                .map(s => s.toUpperCase());

            const dynamicCodeKey = `${parts.join('_')}_SUCCESS`;
            
            // Cast to check if the generated key exists in the enum
            const code = ApiCodeResponse[dynamicCodeKey as keyof typeof ApiCodeResponse];

            return isNil(code) ? ApiCodeResponse.COMMON_SUCCESS : code;
        } catch (error) {
            this.logger.warn(`Failed to map code for path ${path}, falling back to COMMON_SUCCESS`);
            return ApiCodeResponse.COMMON_SUCCESS;
        }
    }
}
