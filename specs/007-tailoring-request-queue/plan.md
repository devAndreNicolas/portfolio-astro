# Plan

Use JSON to avoid an additional parsing dependency and keep the contract machine-validatable. Keep request data separate from the raw job description: requests reference the existing `.txt` source instead of duplicating it. The validator reads the canonical manifest only for base-CV IDs and never edits request files.

The agent owns evidence selection, derivative creation, QA and lifecycle updates. GitHub Actions remains responsible only for approved PDF compilation/publication.
