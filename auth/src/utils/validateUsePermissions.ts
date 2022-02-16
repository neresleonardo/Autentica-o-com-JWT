type User = {
    permissions: string[];
    roles: string[];
}

type ValidadeUserPermissionsParams = {
    user: User;
    permissions?: string[];
    roles?: string[];
}

export function validateUsePermissions({ 
    user,
    permissions,
    roles
    }: ValidadeUserPermissionsParams) {

    if (permissions?.length > 0) {
        const hasAllPermissions = permissions.some(permission => {
            return user.permissions.includes(permission);
        })
    if (!hasAllPermissions){
        return false;
    }
    };

    if (roles?.length > 0) {
        const hasAllRoles = permissions.every(role => {
            return user.roles.includes(role);
        })
    if (!hasAllRoles){
        return false;
    }
    };

    return true;
}