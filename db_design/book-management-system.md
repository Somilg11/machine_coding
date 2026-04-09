## Book management system

### Overview

This document describes a simple relational design for a Book Management System (BMS). It covers the main entities, their attributes, relationships, an ER-style diagram, a SQL schema (Postgres-friendly), and common example queries (CRUD and reports).

Intended audience: developers designing/implementing a library or small lending system, or preparing data models for interviews.

### Small contract (inputs / outputs / success criteria)
- Inputs: book metadata, author data, borrower information, borrow/return actions.
- Outputs: persistent records for books/authors/borrowers and borrow history; queries that produce lists (e.g., currently borrowed books, borrower history, books by author).
- Success criteria: normalized schema, clear FKs and constraints, useful example queries for common operations.

### Entities and attributes

All attributes include suggested SQL types. Timestamps use timezone-aware values.

- Books
	- id: SERIAL PRIMARY KEY
	- title: TEXT NOT NULL
	- isbn: VARCHAR(20) UNIQUE
	- publication_year: INTEGER
	- genre: TEXT
	- created_at: TIMESTAMPTZ DEFAULT now()
	- updated_at: TIMESTAMPTZ DEFAULT now()

- Authors
	- id: SERIAL PRIMARY KEY
	- full_name: TEXT NOT NULL
	- country: TEXT
	- dob: DATE
	- created_at: TIMESTAMPTZ DEFAULT now()
	- updated_at: TIMESTAMPTZ DEFAULT now()

- Borrowers
	- id: SERIAL PRIMARY KEY
	- full_name: TEXT NOT NULL
	- email: TEXT UNIQUE
	- phone_number: TEXT
	- created_at: TIMESTAMPTZ DEFAULT now()
	- updated_at: TIMESTAMPTZ DEFAULT now()

- BorrowRecords (tracks each lending event)
	- id: SERIAL PRIMARY KEY
	- borrower_id: INTEGER REFERENCES borrowers(id) ON DELETE CASCADE
	- book_id: INTEGER REFERENCES books(id) ON DELETE CASCADE
	- borrow_date: DATE NOT NULL DEFAULT CURRENT_DATE
	- due_date: DATE NULL
	- return_date: DATE NULL
	- status: VARCHAR(20) NOT NULL CHECK (status IN ('borrowed','returned','lost'))
	- created_at: TIMESTAMPTZ DEFAULT now()
	- updated_at: TIMESTAMPTZ DEFAULT now()

### Relationships

- Book <-> Author: many-to-many (a book can have multiple authors; an author can write multiple books).
- Book <-> Borrower: many-to-many over time via the BorrowRecords table (each borrow event is a record).

### ER diagram (textual)

Books (1..*) <--- book_authors ---> (*..1) Authors

Books (1..*) <--- borrow_records ---> (*..1) Borrowers

Simple ASCII sketch:

	[books] 1---< [book_authors] >---1 [authors]
		 |
		 | 1
		 v
	[borrow_records] >---1 [borrowers]

### Design notes & assumptions

- This model assumes a single copy per book record. If you need multiple copies/ inventory counts, add a `copies` column to `books` or model a `book_copies` table.
- `isbn` is unique when available, but may be NULL for older records.
- `borrow_records` holds history; status differentiates active loans from returned ones.

## SQL schema (Postgres-style)

The following DDL creates tables with constraints and helpful indexes.

```sql
-- Books
CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	isbn VARCHAR(20) UNIQUE,
	publication_year INTEGER,
	genre TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Authors
CREATE TABLE authors (
	id SERIAL PRIMARY KEY,
	full_name TEXT NOT NULL,
	country TEXT,
	dob DATE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table: book <-> author
CREATE TABLE book_authors (
	book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
	author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY (book_id, author_id)
);

-- Borrowers
CREATE TABLE borrowers (
	id SERIAL PRIMARY KEY,
	full_name TEXT NOT NULL,
	email TEXT UNIQUE,
	phone_number TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Borrow records (historical lending events)
CREATE TABLE borrow_records (
	id SERIAL PRIMARY KEY,
	borrower_id INTEGER NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
	book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
	borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
	due_date DATE,
	return_date DATE,
	status VARCHAR(20) NOT NULL CHECK (status IN ('borrowed','returned','lost')),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common lookups
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_authors_name ON authors(full_name);
CREATE INDEX idx_borrow_records_borrower ON borrow_records(borrower_id);
CREATE INDEX idx_borrow_records_book ON borrow_records(book_id);
```

## Common SQL queries

-- 1) Insert sample author
```sql
INSERT INTO authors (full_name, country, dob)
VALUES ('Jane Austen', 'UK', '1775-12-16')
RETURNING id;
```

-- 2) Insert a book and link to an author
```sql
INSERT INTO books (title, isbn, publication_year, genre)
VALUES ('Pride and Prejudice', '9780141199078', 1813, 'Novel')
RETURNING id;

-- Suppose book_id = 1 and author_id = 1
INSERT INTO book_authors (book_id, author_id) VALUES (1, 1);
```

-- 3) Register a borrower
```sql
INSERT INTO borrowers (full_name, email, phone_number)
VALUES ('Aman Singh', 'aman@example.com', '+91-99999-00000')
RETURNING id;
```

-- 4) Issue (borrow) a book
```sql
-- create a borrow record with status 'borrowed' and an optional due_date
INSERT INTO borrow_records (borrower_id, book_id, borrow_date, due_date, status)
VALUES (1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 'borrowed')
RETURNING id;
```

-- 5) Return a book (update borrow record)
```sql
UPDATE borrow_records
SET status = 'returned', return_date = CURRENT_DATE, updated_at = now()
WHERE id = 42; -- replace with the borrow_records id
```

-- 6) Books currently borrowed (active loans)
```sql
SELECT br.id AS borrow_id, b.id AS book_id, b.title, bo.id AS borrower_id, bo.full_name, br.borrow_date, br.due_date
FROM borrow_records br
JOIN books b ON b.id = br.book_id
JOIN borrowers bo ON bo.id = br.borrower_id
WHERE br.status = 'borrowed'
ORDER BY br.due_date NULLS LAST, br.borrow_date DESC;
```

-- 7) Borrower history (all loans for a borrower)
```sql
SELECT br.id, b.title, br.borrow_date, br.due_date, br.return_date, br.status
FROM borrow_records br
JOIN books b ON b.id = br.book_id
WHERE br.borrower_id = 1
ORDER BY br.borrow_date DESC;
```

-- 8) Find books by author name
```sql
SELECT b.id, b.title, b.isbn, a.full_name
FROM books b
JOIN book_authors ba ON ba.book_id = b.id
JOIN authors a ON a.id = ba.author_id
WHERE a.full_name ILIKE '%Austen%'
ORDER BY b.title;
```

-- 9) Overdue books (assuming due_date set)
```sql
SELECT br.id, b.title, bo.full_name, br.borrow_date, br.due_date
FROM borrow_records br
JOIN books b ON b.id = br.book_id
JOIN borrowers bo ON bo.id = br.borrower_id
WHERE br.status = 'borrowed' AND br.due_date < CURRENT_DATE
ORDER BY br.due_date ASC;
```

-- 10) Soft report: number of times a book was borrowed
```sql
SELECT b.id, b.title, COUNT(br.id) AS times_borrowed
FROM books b
LEFT JOIN borrow_records br ON br.book_id = b.id
GROUP BY b.id, b.title
ORDER BY times_borrowed DESC;
```

## Notes & next steps

- If you need to support multiple copies, add a `copies` column on `books` or a `book_copies` table with copy-level identifiers and track `borrow_records` against copies.
- To enforce stricter statuses and constraints, consider using a Postgres ENUM for `status` instead of a text CHECK.
- Add application-level checks to prevent double-issuing the same copy (if copies are modeled).

---

Document updated: provides a cleaner structure, explicit schema, and many practical example queries to support typical library workflows.