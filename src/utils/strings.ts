export const isNonEmptyString = (value: string | null | undefined): value is string =>
    Boolean(value && value.trim().length > 0);
