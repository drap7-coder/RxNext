from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

required = [
    "ontology/ontology.yaml",
    "ontology/objects/EmployerGroup.yaml",
    "ontology/objects/PharmacyClaim.yaml",
    "ontology/links/links.yaml",
    "ontology/actions/actions.yaml",
    "pipelines/lineage/metric_definitions.yaml",
    "workshop/apps/tesla_benefit_command/app.yaml",
    "workshop/apps/tesla_benefit_command/pages/00_mission_control.json",
]

missing = [path for path in required if not (ROOT / path).is_file()]
if missing:
    raise SystemExit(f"missing starter files: {missing}")

for path in ROOT.rglob("*.json"):
    json.loads(path.read_text())

print(f"validated {len(list(ROOT.rglob('*.*')))} starter files")
