"""Bronze claim ingestion contract. Replace read_source with the tenant datasource adapter."""
REQUIRED = {"claim_id", "member_id", "ndc", "service_date", "plan_paid", "member_paid"}

def ingest(rows):
    for row in rows:
        missing = REQUIRED - row.keys()
        if missing:
            raise ValueError(f"claim missing fields: {sorted(missing)}")
        yield {**row, "_source_system": row.get("_source_system", "pbm"), "_immutable": True}
