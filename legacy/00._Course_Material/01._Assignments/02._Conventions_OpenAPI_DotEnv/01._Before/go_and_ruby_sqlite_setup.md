# [Optional] Go and Ruby SQLite Setup

Get aquainted with how to setup SQLite and create all the WhoKnows queries in Go and Ruby.

**Type**: Individual / Group Work

**Motivation**: Great opportunity to help your group assert if you like the syntax of one of these languages.

---
---
---

## Install Go and run a hello world program

### MacOS 

```bash
$ brew install go
$ go version
```

### Windows

```powershell
$ choco install golang -y
$ go version
```

---

## Initialize the SQLite database

Initialize the project as a Go module:

```bash
$ go mod init whoknows
```

Install the SQLite driver for Go:

```bash
$ go get modernc.org/sqlite@latest
```

Create a file named `init_db.go` and add the following:

```go
package main

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "whoknows.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	schema := `
	DROP TABLE IF EXISTS users;

	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);

	INSERT INTO users (username, email, password) 
	VALUES ('admin', 'keamonk1@stud.kea.dk', '5f4dcc3b5aa765d61d8327deb882cf99');

	CREATE TABLE IF NOT EXISTS pages (
		title TEXT PRIMARY KEY UNIQUE,
		url TEXT NOT NULL UNIQUE,
		language TEXT NOT NULL CHECK(language IN ('en', 'da')) DEFAULT 'en',
		last_updated TIMESTAMP,
		content TEXT NOT NULL
	);`

	_, err = db.Exec(schema)
	if err != nil {
		log.Fatal(err)
	}
}
```

Run `init_db.go` to initialize the SQLite database:

```bash
$ go run init_db.go
```

---

## Run queries on the database

Create a file named `queries.go` and add the following:

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "modernc.org/sqlite"
)

type Page struct {
    ID       int
    Title    string
    Language string
    Content  string
}

func main() {
    db, err := sql.Open("sqlite", "whoknows.db")
    if err != nil {
        log.Fatalf("Failed to open database: %v", err)
    }
    defer db.Close()

    lastID, err := InsertUserQuery(db)
    if err != nil {
        log.Printf("InsertUserQuery error: %v", err)
    } else {
        fmt.Printf("InsertUserQuery: Inserted user with id %d\n", lastID)
    }

    userID, err := GetUserIDQuery(db)
    if err != nil {
        log.Printf("GetUserIDQuery error: %v", err)
    } else {
        fmt.Printf("GetUserIDQuery: User 'johndoe' has id %d\n", userID)
    }

    id, username, email, password, err := GetUserByIDQuery(db)
    if err != nil {
        log.Printf("GetUserByIDQuery error: %v", err)
    } else {
        fmt.Printf("GetUserByIDQuery: id=%d username=%s email=%s password=%s\n", id, username, email, password)
    }

    id, username, email, password, err = GetUserByUsernameQuery(db)
    if err != nil {
        log.Printf("GetUserByUsernameQuery error: %v", err)
    } else {
        fmt.Printf("GetUserByUsernameQuery: id=%d username=%s email=%s password=%s\n", id, username, email, password)
    }

    pages, err := SearchPagesQuery(db)
    if err != nil {
        log.Printf("SearchPagesQuery error: %v", err)
    } else {
        for _, page := range pages {
            fmt.Printf("SearchPagesQuery: id=%d title=%s language=%s content=%s\n", page.ID, page.Title, page.Language, page.Content)
        }
    }
}

func InsertUserQuery(db *sql.DB) (int64, error) {
    query := "INSERT INTO users (username, email, password) values ('johndoe', 'john@example.com', '5f4dcc3b5aa765d61d8327deb882cf99')"
    res, err := db.Exec(query)
    if err != nil {
        return 0, err
    }
    lastID, err := res.LastInsertId()
    if err != nil {
        return 0, err
    }
    return lastID, nil
}

func GetUserIDQuery(db *sql.DB) (int, error) {
    query := "SELECT id FROM users WHERE username = 'johndoe'"
    var id int
    err := db.QueryRow(query).Scan(&id)
    if err != nil {
        return 0, err
    }
    return id, nil
}

func GetUserByIDQuery(db *sql.DB) (int, string, string, string, error) {
    query := "SELECT * FROM users WHERE id = '1'"
    row := db.QueryRow(query)
    var id int
    var username, email, password string
    err := row.Scan(&id, &username, &email, &password)
    if err != nil {
        return 0, "", "", "", err
    }
    return id, username, email, password, nil
}

func GetUserByUsernameQuery(db *sql.DB) (int, string, string, string, error) {
    query := "SELECT * FROM users WHERE username = 'johndoe'"
    row := db.QueryRow(query)
    var id int
    var username, email, password string
    err := row.Scan(&id, &username, &email, &password)
    if err != nil {
        return 0, "", "", "", err
    }
    return id, username, email, password, nil
}

func SearchPagesQuery(db *sql.DB) ([]Page, error) {
    query := "SELECT * FROM pages WHERE language = 'en' AND content LIKE '%golang%'"
    rows, err := db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var pages []Page
    for rows.Next() {
        var page Page
        err := rows.Scan(&page.ID, &page.Title, &page.Language, &page.Content)
        if err != nil {
            log.Printf("SearchPagesQuery row scan error: %v", err)
            continue
        }
        pages = append(pages, page)
    }
    if err := rows.Err(); err != nil {
        return nil, err
    }
    return pages, nil
}
```

Run it:

```bash
$ go run queries.go
```


---
---
---


## Install Ruby and run a hello world program

### macOS 

```bash
$ brew install ruby
$ ruby -v
```

### Windows

Setting the path for Ruby is necessary. Instead of `refreshenv`, you could also restart the terminal.

```bash
$ choco install ruby -y
$ setx PATH "$($env:PATH);C:\ProgramData\chocolatey\lib\ruby\tools\bin"
$ refreshenv
$ ruby -v
```

---

## Initialize a new Ruby project

```bash
$ bundle init
```

A file named `Gemfile` has been created in the current directory and make sure it contains:

```gemfile
source "https://rubygems.org"
gem 'sqlite3'
```

Install the dependency (installs the gem in the local `./vendor` directory instead of the system-wide location):

```bash
$ bundle config set --local path 'vendor'
$ bundle install
```

Add `vendor` to your `.gitignore` file:

```gitignore
# Ruby
vendor/
```

## Windows: Extra step - Build SQLite binaries locally

Install `ridk`. There might be a need to run the command twice to install it in the GUI installer widget first and then in the terminal. 

```powershell
$ ridk install   # choose option 3
$ bundle config set --local force_ruby_platform true
$ bundle install
```

---

## Initialize the SQLite database

Create a file named `init_db.rb` and add the following:

```ruby
require 'sqlite3'

db = SQLite3::Database.new 'whoknows.db'

schema = <<~SQL
  DROP TABLE IF EXISTS users;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  INSERT INTO users (username, email, password)
  VALUES ('admin', 'keamonk1@stud.kea.dk', '5f4dcc3b5aa765d61d8327deb882cf99');

  CREATE TABLE IF NOT EXISTS pages (
    title TEXT PRIMARY KEY UNIQUE,
    url TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL CHECK(language IN ('en', 'da')) DEFAULT 'en',
    last_updated TIMESTAMP,
    content TEXT NOT NULL
  );
SQL

db.execute_batch(schema)
```

Run it with the local Ruby environment (bundled gems):

```bash
$ bundle exec ruby init_db.rb
```

---

## Run queries on the database

Create a file named `queries.rb` and add the following code:

```ruby
require 'sqlite3'

Page = Struct.new(:id, :title, :language, :content)

begin
  db = SQLite3::Database.new "whoknows.db"

  def insert_user_query(db)
    query = "INSERT INTO users (username, email, password) VALUES ('johndoe', 'john@example.com', '5f4dcc3b5aa765d61d8327deb882cf99')"
    db.execute(query)
    db.last_insert_row_id
  end

  def get_user_id_query(db)
    query = "SELECT id FROM users WHERE username = 'johndoe'"
    row = db.get_first_row(query)
    row ? row[0] : nil
  end

  def get_user_by_id_query(db)
    query = "SELECT * FROM users WHERE id = '1'"
    row = db.get_first_row(query)
    if row
      id, username, email, password = row
      [id, username, email, password]
    else
      [nil, nil, nil, nil]
    end
  end

  def get_user_by_username_query(db)
    query = "SELECT * FROM users WHERE username = 'johndoe'"
    row = db.get_first_row(query)
    if row
      id, username, email, password = row
      [id, username, email, password]
    else
      [nil, nil, nil, nil]
    end
  end

  def search_pages_query(db)
    query = "SELECT * FROM pages WHERE language = 'en' AND content LIKE '%golang%'"
    pages = []
    db.execute(query) do |row|
      id, title, language, content = row
      pages << Page.new(id, title, language, content)
    end
    pages
  end

  last_id = insert_user_query(db)
  if last_id
    puts "InsertUserQuery: Inserted user with id #{last_id}"
  else
    puts "InsertUserQuery error"
  end

  user_id = get_user_id_query(db)
  if user_id
    puts "GetUserIDQuery: User 'johndoe' has id #{user_id}"
  else
    puts "GetUserIDQuery error"
  end

  id, username, email, password = get_user_by_id_query(db)
  if id
    puts "GetUserByIDQuery: id=#{id} username=#{username} email=#{email} password=#{password}"
  else
    puts "GetUserByIDQuery error"
  end

  id, username, email, password = get_user_by_username_query(db)
  if id
    puts "GetUserByUsernameQuery: id=#{id} username=#{username} email=#{email} password=#{password}"
  else
    puts "GetUserByUsernameQuery error"
  end

  pages = search_pages_query(db)
  if pages
    pages.each do |page|
      puts "SearchPagesQuery: id=#{page.id} title=#{page.title} language=#{page.language} content=#{page.content}"
    end
  else
    puts "SearchPagesQuery error"
  end

rescue SQLite3::Exception => e
  puts "Database error: #{e}"
ensure
  db.close if db
end
```

Run it:

```bash
$ bundle exec ruby queries.rb
```