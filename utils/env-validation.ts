import { z } from "zod";

// Define the schema for client-side environment variables
const clientEnvSchema = z.object({
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z
    .string()
    .min(1, "PayPal Client ID is required"),
});

// Type inference from the schema
type ClientEnvVars = z.infer<typeof clientEnvSchema>;

// Client-side validation function
export function validateClientEnv(): ClientEnvVars {
  try {
    // Validate only NEXT_PUBLIC_ variables
    const validatedEnv = clientEnvSchema.parse({
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    });

    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatErrors = error.errors
        .map((err) => {
          return `${err.path.join(".")}: ${err.message}`;
        })
        .join("\n");

      throw new Error(`Environment validation failed:\n${formatErrors}`);
    }
    throw error;
  }
}

// Export the schema and types for use in other parts of the application
export { clientEnvSchema, type ClientEnvVars };
