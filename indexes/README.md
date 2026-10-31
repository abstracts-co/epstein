# Document indexes for agents

This folder holds reusable PageIndex trees for agents. Start with a document's `index.json`, navigate `tree` by titles and summaries, and read `text/<node_id>.md` for the selected leaf. The community skill is [read-an-index](../skills/read-an-index/SKILL.md).

Page ranges are **1-based, inclusive PDF positions**, including covers and front matter, rather than printed page labels. Leaf files contain the full cleaned text of their page ranges, so adjacent leaves can overlap and include neighbouring sections. This preserves context and parent introductions; consult the source PDF for exact section boundaries, figures, formulas, or layout. Text extraction does not transcribe image-only content. Linked supplements are not included.

## Documents

| Document | PDF pages | Source | License | How built |
| --- | ---: | --- | --- | --- |
| [Investigation and Review of the Federal Bureau of Prisons’ Custody, Care, and Supervision of Jeffrey Epstein at the Metropolitan Correctional Center in New York, New York](oig-23-085/index.json) | 128 | [Official PDF](https://oig.justice.gov/sites/default/files/reports/23-085.pdf) | Public domain — U.S. government work | PageIndex 0.5.0 local Flash + `claude-code/haiku`; reviewed and corrected on 2026-10-30. |
| [Executive Summary of Report: Investigation into the U.S. Attorney’s Office for the Southern District of Florida’s Resolution of Its 2006–2008 Federal Criminal Investigation of Jeffrey Epstein and Its Interactions with Victims during the Investigation](opr-2020-summary/index.json) | 13 | [Official PDF](https://www.justice.gov/opr/page/file/1336471/dl) | Public domain — U.S. government work | PageIndex 0.5.0 local Flash + `claude-code/haiku`; reviewed and corrected on 2026-10-30. |

## Build and verification

Installed `pip install -U "pageindex[claude]"` into a fresh `/tmp/pageindex-venv`. Read the upstream README, SDK getting-started documentation, installed client API, and Flash README. Used the machine owner's Claude Code sign-in, with no cloud indexing or PageIndex API key:

```python
from pageindex import PageIndexClient
client = PageIndexClient(
    index={"model": "claude-code/haiku", "storage_path": "/tmp/pageindex-store/<doc-id>",
           "summary_max_words": 65, "summary_concurrency": 3},
    chat="claude-code/haiku",
)
doc_id = client.submit_document("source.pdf", mode="flash")["doc_id"]
tree = client.get_tree(doc_id, node_summary=True, include_text=True)["result"]
```

Flash extracts headings from layout, deterministically merges, and uses Haiku to refine and summarize. Converted `start_index` / `end_index` to `start_page` / `end_page`, kept node IDs, and normalized missing child lists to `[]`. Editorial review checked nesting, replaced model-added navigation labels with printed headings, and shortened summaries. For the OIG report, review also corrected the front-matter ranges, restored its printed Table of Contents, and removed an incorrectly nested duplicate. Poppler `pdftotext` extracted leaf page text in reading order; repeated headers, footers, and page labels were removed. Summaries are paraphrases; leaf text is an extraction, not an authoritative transcription. Source SHA-256 hashes and page counts in each JSON identify the exact downloaded PDF bytes. The PDFs are not bundled.

Validated JSON keys and values, unique IDs, nested page bounds, complete leaf page coverage, matching leaf files, SHA-256 hashes, and the strict 300,000-byte cap for every JSON/text file. Five nodes per document were checked against rendered source PDF pages for headings and summary content; their inclusive ranges were also checked against extracted text and section transitions:

| Document | Checked node IDs and PDF pages |
| --- | --- |
| `oig-23-085` | `0009` (p. 8), `0012` (p. 13), `0031` (p. 39), `0054` (p. 86), `0075` (p. 117) |
| `opr-2020-summary` | `0002` (p. 2), `0003` (p. 6), `0004` (p. 8), `0006` (p. 10), `0007` (p. 13) |

Source section text is reused under the licenses above. CC BY attributions identify the authors, publication, DOI, and license; extraction, cleanup, indexing, and summaries are the changes made here. No redacted content has been reconstructed.
