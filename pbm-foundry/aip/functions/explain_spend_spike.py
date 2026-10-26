"""AIP function contract: return cited ontology objects, never uncited narrative."""

def explain(employer_group, variance_objects, max_drivers=5):
    ranked = sorted(variance_objects, key=lambda item: abs(item["variance_contribution"]), reverse=True)[:max_drivers]
    return {
        "employer_group_id": employer_group["employer_group_id"],
        "net_pmpm_delta": employer_group["net_pmpm_delta"],
        "drivers": [
            {"objectType": item["objectType"], "primaryKey": item["primaryKey"], "absolute_dollars": item["variance_contribution"], "lineage": item["lineage"]}
            for item in ranked
        ],
    }
