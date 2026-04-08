# PostgreSQL Full-Text Search: Complete Guide

### Overview
Full-Text Search (FTS) powers the search bars on blogs, documentation, and e-commerce sites. While developers often reach for third-party services like Algolia or Meilisearch, **PostgreSQL has incredibly powerful, native full-text search capabilities built directly into it.**



---

### 1. The Problem with `LIKE` / `ILIKE`
The traditional way to search a database is using the `LIKE` or `ILIKE` operator with wildcards.

```sql
SELECT * FROM articles WHERE body ILIKE '%golang%';
```

**Why this fails at scale:**
1. **Sequential Scans:** The database must read every single row one-by-one to find matching substrings. For large text fields (like blog post bodies), this is extremely slow.
2. **Strict Matching:** It lacks semantic understanding. Searching for "Program" will not match "Programming".
3. **No Typo Tolerance:** If a user types "Golng", the search completely fails.

---

### 2. The Core Engine: `tsvector` & `tsquery`
Postgres solves semantic search using vectors.

* **`tsvector` (Text Search Vector):** Postgres takes your text, normalizes it, and converts it into a list of searchable tokens.
    * **Stemming:** It reduces words to their root forms (e.g., "Programming" and "Programmer" both become "Program").
    * **Stop Words:** It automatically removes useless words like "a", "the", and "is".
    * **Lexemes:** The resulting root words are called *lexemes*.
    * **Positional Data:** It stores the exact position of the word in the text (e.g., `10, 2, 3` meaning the word appears at the 2nd, 3rd, and 10th position).
* **`tsquery`:** The formatted query you use to search against a `tsvector`.

#### Step-by-Step Implementation:
Instead of parsing text on the fly, we create a dedicated, auto-updating column to store the vectors.

```sql
-- 1. Add a new column to store the vectors
ALTER TABLE articles
ADD COLUMN tsv tsvector 
GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;
```

```sql
-- 2. Search using tsquery and rank the results by relevance
SELECT id, title, body, ts_rank(tsv, plainto_tsquery('golang')) as rank
FROM articles
WHERE tsv @@ plainto_tsquery('golang')
ORDER BY rank DESC
LIMIT 10;
```

---

### 3. Performance Boost: GIN Indexing
Even with `tsvector`, Postgres still has to scan every row to check the vectors. To fix this, we need an **Inverted Index**.

* **How an Inverted Index works:** Instead of mapping a row to its text (Row 1 -> "Learn Golang"), it maps the *word* to the *rows* (Golang -> Rows 1, 3, 7). 
* **GIN (Generalized Inverted Index):** This is the specific algorithm Postgres uses for this. Once applied, the query planner can instantly locate rows without scanning the table.

```sql
-- Create a GIN Index on the vector column
CREATE INDEX articles_tsv_idx ON articles USING GIN (tsv);
```
*(Pro-tip: You can verify the index is being used by prefixing your query with `EXPLAIN ANALYZE` and looking for "Index Scan" instead of "Seq Scan").*

---

### 4. Handling Typos: Fuzzy Searching with `pg_trgm`
`tsvector` is great for semantic meaning, but it fails if the user makes a typo (e.g., typing "Redus" instead of "Redis"). For this, we need **Fuzzy Searching**.

Postgres supports this via an official extension called **Trigrams (`pg_trgm`)**.
* **How it works:** It breaks words into chunks of three consecutive letters. "Redis" becomes `{" r", " re", "red", "edi", "dis", "is "}`. It then compares the trigrams of the typo against the actual data to find alphanumeric similarity.

```sql
-- 1. Enable the Trigram extension (run once per database)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Search using the similarity operator (%)
SELECT id, title, body 
FROM articles 
WHERE title % 'redus' -- The % operator triggers a similarity match
ORDER BY similarity(title, 'redus') DESC
LIMIT 10;
```

---

### Summary Workflow for Production
To build a robust search engine natively in Postgres:
1. Combine your text columns (`title`, `body`) into a generated `tsvector` column.
2. Apply a `GIN` index to that vector column for instant lookups.
3. Use `plainto_tsquery` and `ts_rank` for accurate, semantic search results.
4. Enable `pg_trgm` to catch and correct user typos via similarity scoring.