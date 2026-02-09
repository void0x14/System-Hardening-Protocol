# Sentinel Journal

## 2025-12-17 - Stored XSS in Meal Modal
**Vulnerability:** A Stored XSS vulnerability was found in `Actions.openMealModal`. The function rendered custom food names (user input) directly into the HTML using template literals without sanitization. An attacker could create a custom food with a malicious name (e.g., `<script>...`) which would execute when the meal modal was opened.
**Learning:** Interpolating user-controlled data directly into HTML strings is dangerous, even if the data comes from internal storage (stored XSS). The assumption that "database" data is safe is incorrect when users can write to that database.
**Prevention:** Always use `Utils.escapeHtml()` (or equivalent sanitization) when rendering data into HTML strings. Prefer creating DOM elements and setting `textContent` over `innerHTML` where possible, or use a secure rendering library that handles escaping automatically. Also applied defense-in-depth sanitization to `UI.renderPortionInputs`.
