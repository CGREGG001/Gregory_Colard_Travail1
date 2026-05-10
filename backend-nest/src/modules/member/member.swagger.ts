import { ApiOperationOptions } from "@nestjs/swagger";

export const MemberControllerCreateDocumentation: ApiOperationOptions = {
    summary: 'Create a new member manually',
}

export const MemberControllerDetailsDocumentation: ApiOperationOptions = {
    summary: 'Get member details',
    description: 'Returns detailed information about the current member'
}

export const MemberControllerListDocumentation: ApiOperationOptions = {
    summary: 'List all members',
}

export const MemberControllerUpdateDocumentation: ApiOperationOptions = {
    summary: 'Update a member',
}

export const MemberControllerDeleteDocumentation: ApiOperationOptions = {
    summary: 'Delete a member',
}
