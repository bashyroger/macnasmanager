# Deterministic Business Rules

## 1. Duration calculation
duration_minutes = ceil((end_time - start_time) in minutes)
Constraint: end_time must be greater than start_time

## 2. Material line cost
computed_material_cost = round(quantity_used * unit_cost_snapshot, 2)

## 3. Labor cost
labor_cost = round((sum(duration_minutes) / 60) * hourly_rate_snapshot, 2)

## 4. Material cost total
material_cost_total = round(sum(project_materials.computed_material_cost), 2)

## 5. Total project cost
total_cost = labor_cost + material_cost_total + overhead_amount

## 6. Profit amount
profit_amount = charged_amount - total_cost
If charged_amount is null, profit_amount is null

## 7. Profit margin
profit_margin_pct =
  if charged_amount > 0 then profit_amount / charged_amount
  else null

## 8. Sustainability score per axis
For each active axis:
axis_score =
  sum(material_axis_score * quantity_used_normalized_weight)
Where quantity_used_normalized_weight =
  quantity_used / sum(quantity_used across all project materials)

If a material linked to a project has no score for an active axis:
- default behavior: block final sustainability calculation until resolved
- do not silently assume zero

## 9. Letter grades
Given axis score:
- A if score >= grade_a_min
- B if score >= grade_b_min and < grade_a_min
- C if score >= grade_c_min and < grade_b_min
- D otherwise

## 10. Overall sustainability score
overall_score = weighted average of active axis scores using sustainability_axes.weight

## 11. Publish eligibility
A project may publish only if:
- status in (completed, delivered)
- publish_enabled = true
- public_title is not null
- public_description is not null
- at least 1 public image exists
- sustainability snapshot exists
- financial snapshot exists
The public route reads only from public-safe fields and snapshots

## 12. Calendar event matching
Import matching precedence:
1. Exact short_code token match in event title
2. Exact project title match in normalized event title
3. Exact pattern "<project title> - <client first name or full name>"
4. Otherwise mark unmatched and require manual assignment

No fuzzy string matching in MVP.

## 13. Calendar import idempotency
If external_event_id already exists:
- update linked time entry
Else:
- create new time entry

## 14. Calendar export idempotency
If time entry has external_event_id:
- update existing Google Calendar event
Else:
- create event and store external_event_id

## 15. Product tier assignment
Tier assignment uses ordered rule evaluation.
First matching active tier wins.
Rules are stored explicitly in JSON and evaluated deterministically.

## 16. Snapshot strategy
When project status changes to completed:
- compute and persist financial snapshot
- compute and persist sustainability snapshot
- assign tier
Publishing uses latest snapshots, not ad hoc recalculation in the public route
