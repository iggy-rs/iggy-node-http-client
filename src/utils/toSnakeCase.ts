

export function toSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(toSnakeCase);
    }

    return Object.entries(obj)
        .reduce((result, [key, value]) => ({
            ...result,
            [key.split(/(?=[A-Z])/).join('_').toLowerCase()]: toSnakeCase(value),
        }), {});
}
