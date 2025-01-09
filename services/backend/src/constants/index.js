const CONSTANTS = {
    // Departments
    DEPARTMENTS: {
        SALES: 'sales',
        OPERATOR: 'operator',
        ACCOUNTANT: 'accountant',
        INTERN: 'intern'
    },

    // Roles
    ROLES: {
        ADMIN: 'admin',
        USER: 'user'
    },

    // Status
    STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive'
    },

    // Lists for validation
    VALID_DEPARTMENTS: ['sales', 'operator', 'accountant', 'intern'],
    VALID_ROLES: ['admin', 'user'],
    VALID_STATUS: ['active', 'inactive']
};

module.exports = CONSTANTS;