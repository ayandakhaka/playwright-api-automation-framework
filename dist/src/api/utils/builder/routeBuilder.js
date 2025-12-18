/**
 * Safely builds a dynamic API route by replacing placeholder parameters
 * in the format `{key}` with actual values supplied in the params object.
 *
 * Example:
 *   buildRoute("/user/{id}/pet/{petId}", { id: 10, petId: 22 })
 *   → "/user/10/pet/22"
 *
 * This version includes:
 *   ✔ Validation for missing parameters
 *   ✔ Clear warnings for undefined values
 *   ✔ Safe type handling
 *
 * @param route - A route template containing placeholders in {key} format.
 * @param params - A map of parameter keys and their string/number values.
 * @returns The route string with placeholders replaced by their corresponding values.
 */
export function buildRoute(route, params) {
    // Keep a working copy of the route template
    let updated = route;
    // Extract placeholders from the route: {id}, {name}, {petId}, etc.
    const templateKeys = Array.from(route.matchAll(/\{([^}]+)\}/g)).map(match => match[1] // <-- Fix: assert capture always exists
    );
    // Warn if route contains placeholders not provided in params
    for (const key of templateKeys) {
        if (!(key in params)) {
            console.warn(`[buildRoute] Warning: Route expects parameter "${key}" but it was not provided.`);
        }
    }
    // Replace each provided param in the route
    for (const key in params) {
        const value = params[key];
        // Warn and skip undefined values
        if (value === undefined) {
            console.warn(`[buildRoute] Warning: Parameter "${key}" is undefined and will not be replaced.`);
            continue;
        }
        // Perform the actual placeholder replacement
        updated = updated.replace(`{${key}}`, value.toString());
    }
    // Return the finished route
    return updated;
}
