import { z } from 'zod';
import { reactive } from 'vue';

export function useFormValidation<S extends z.ZodObject = z.ZodObject, D extends object = {}>(schema: S, formData: D) {
    const errors = reactive<Record<string | symbol, string>>({});

    Object.keys(formData).forEach(key => {
        errors[key] = '';
    });

    async function validate() {
        let isValid = true;

        try {
            await schema.parseAsync(formData);
            Object.keys(errors).forEach(key => {
                errors[key] = '';
            });
        } catch (error) {
            isValid = false;
            if (error instanceof z.ZodError) {
                Object.keys(errors).forEach(key => {
                    errors[key] = '';
                });
                error.issues.forEach(err => {
                    const field = err.path[0];

                    if (field in errors) {
                        errors[field] = err.message;
                    }
                });
            }
        }

        return isValid;
    }

    function reset() {
        Object.keys(errors).forEach(key => {
            errors[key] = '';
        });
    }

    return { errors, validate, reset };
}
