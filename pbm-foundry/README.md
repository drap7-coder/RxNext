# PBM Foundry Starter

An ontology-first starter for a pharmacy-benefit decision OS. Objects, links, metrics, lineage, actions, and markings are the product surface; dashboards are projections over that model.

## Important

The YAML and Workshop JSON are tenant-neutral, adapter-ready source definitions. Palantir Foundry deployments require generated ontology RIDs, datasource RIDs, action type IDs, and tenant-specific permissions before import.

## Local validation

```bash
python3 scripts/validate_starter.py
python3 -m unittest discover sdk/python/metric-lib/tests
```

The adjacent Next.js application is a clickable local projection of the same object/action model.
