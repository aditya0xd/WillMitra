import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

export default tseslint.config(
    // Files and folders ESLint should completely skip.
    // - dist/**  : compiled output, not source
    // - **/*.js  : we only lint TypeScript files; .js files (like this config) are excluded
    {
        ignores: ["dist/**", "**/*.js"],
    },

    // Base ESLint recommended rules (catches common JS mistakes like no-undef, no-unused-vars, etc.)
    eslint.configs.recommended,

    // TypeScript-aware recommended rules.
    // Using "recommendedTypeChecked" instead of "strictTypeChecked" so we get
    // genuinely useful type-based checks without the overly strict rules that
    // cause friction during normal development.
    tseslint.configs.recommendedTypeChecked,

    // Stylistic rules that use type information (e.g. prefer `?.` over manual null checks).
    tseslint.configs.stylisticTypeChecked,

    {
        languageOptions: {
            parserOptions: {
                // Automatically finds the nearest tsconfig.json for each file.
                // This is required for type-aware lint rules to work.
                projectService: true,
                // Tells the parser where to resolve tsconfig from (the project root).
                tsconfigRootDir: import.meta.dirname,
            },
        },

        rules: {
            // ── Template Literals ────────────────────────────────────────────────
            // By default, TypeScript ESLint only allows strings in template literals.
            // We relax this to also allow numbers (e.g. `Port: ${port}`),
            // booleans (e.g. `Enabled: ${isActive}`), and nullish values.
            "@typescript-eslint/restrict-template-expressions": [
                "error",
                { allowNumber: true, allowBoolean: true, allowNullish: true },
            ],

            // ── Console / Debugging ──────────────────────────────────────────────
            // Allow console.log / console.error etc. freely in server-side code.
            // In a browser app you'd want this as "warn" or "error".
            "no-console": "off",

            // ── Unsafe Operations ────────────────────────────────────────────────
            // These rules fire whenever TypeScript infers a value as `any`.
            // They're too noisy when working with third-party libs that have
            // incomplete types (e.g. Express req/res). Disable them to avoid
            // constant false positives — rely on TypeScript's own type checker instead.
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-argument": "off",

            // ── Explicit Return Types ────────────────────────────────────────────
            // TypeScript is excellent at inferring return types, so requiring them
            // everywhere adds boilerplate with little benefit.
            // Turn these off and let the compiler infer where it's obvious.
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",

            // ── Unused Variables ─────────────────────────────────────────────────
            // Downgraded to a warning so it doesn't block commits.
            // Variables/args prefixed with _ (e.g. _req, _next) are intentionally
            // ignored — a common convention for "I know this exists but don't need it".
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],

            // ── Promise Handling ─────────────────────────────────────────────────
            // Warn (not error) when a Promise is not awaited or caught.
            // Floating promises are usually bugs, but warn gives you flexibility
            // to handle top-level fire-and-forget scenarios during development.
            "@typescript-eslint/no-floating-promises": "warn",

            // Error when an async function is passed somewhere that expects void
            // (e.g. Express route handlers). The `checksVoidReturn.attributes: false`
            // option prevents false positives on JSX event handlers if you add React later.
            "@typescript-eslint/no-misused-promises": [
                "error",
                { checksVoidReturn: { attributes: false } },
            ],
        },
    },

    // Perfectionist plugin: enforces consistent ordering of imports, object keys,
    // exports, etc. using "natural" sort order (1, 2, 10 instead of 1, 10, 2).
    perfectionist.configs["recommended-natural"]
);