# Open Questions

These must be resolved explicitly in implementation notes or config, not left ambiguous.

1. Exact hourly rate behavior:
   - global default?
   - project snapshot only?
   - editable per project?

2. Overhead model:
   - flat amount per project?
   - percentage?
   - future formula engine?
   MVP recommendation: flat manual amount per project.

3. Product tier rules:
   - based on total cost only?
   - based on labor hours + materials + qualitative tag?
   MVP recommendation: explicit ordered rules using total_cost and/or labor_hours.

4. Sustainability scoring scale:
   - use 0-100 per axis?
   MVP recommendation: yes, normalized numeric 0-100.

5. Website content model:
   - rich text JSON or structured fields?
   MVP recommendation: structured sections plus limited rich text.

6. Multi-user future:
   - one owner only in MVP or multiple staff later?
   MVP recommendation: support multiple authenticated users now, even if only one active user initially.

7. Stock tracking:
   - full inventory deduction in MVP or optional stock field only?
   MVP recommendation: optional stock field only, no full inventory engine in MVP.
