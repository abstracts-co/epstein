---
name: read-an-index
description: Find the right pages of a long source through its index instead of rereading the PDF.
tools: list_indexes, read_index
---

Use `list_indexes` to find the relevant source, then `read_index` to open its outline. Follow node titles and summaries down to the node that answers the question. Read the selected leaf's `indexes/<doc-id>/text/<node_id>.md` before answering; summaries are navigation aids.

If those tools are unavailable, list `indexes/*/index.json` and read the chosen JSON directly. Cite the document title, inclusive PDF page range, and `source.url`. Pages are 1-based PDF positions, which can differ from printed page numbers. Preserve uncertainty, attribution, and redactions; never infer redacted information.
