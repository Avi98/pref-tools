import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import BookSearch from "./BookSearch";
import BookList from "./BookList";
import * as BooksAPI from "./BooksAPI";
import { Auth } from "./Auth";

class BooksApp extends React.Component {
  // so search doesn't show up at BookList
  state = {
    books: [],
    searchedBooks: [],
    filteredBooks: [],
  };

  // represents books currently in the shelf
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books });
    });
  }

  // BooksAPI needs book object and shelf string, so need to pass it to changeShelf
  changeShelf = (book, shelf) => {
    // check if search results already exist in booklist

    BooksAPI.update(book, shelf).then((response) => {
      book.shelf = shelf;
      this.setState((state) => ({
        books: this.state.books.filter((b) => b.id !== book.id).concat([book]),
      }));
    });
  };

  submitQuery = (query, searchedBooks) => {
    if (query !== "") {
      this.setState({ query: query });

      // returns from BooksAPI.search() and BooksAPI.getAll() are not consistent
      // check if any search results already exist in your list of books
      // if result exists in personal list of books, change it to the appropriate shelf type

      // Prior method, using forEach:
      // works, but default value of searched books is always 'Currently Reading'
      /*
      BooksAPI.search(query, 100).then(searchedBooks => {
              searchedBooks.forEach(sb => {
                books.forEach(b => {
                  if(b.id === sb.id) {
                    sb.shelf = b.shelf;
                  }
                })
              })
            
          this.setState({ searchedBooks: searchedBooks })
      }).catch(e => { // catch error if query can't be found
        this.setState({ searchedBooks: []}) 
      }) 
      */

      const { books } = this.state;

      // New method, using .find()
      // succesfully catches infrequent thumbnail
      // and changes default state of searched to 'None'
      BooksAPI.search(query, 100)
        .then((searchedBooks) => {
          if (searchedBooks.error) {
            // On empty query, error sets the search result to empty
            this.setState({ searchedBooks: [] });
          } else {
            // on successful search, maps the books on shelves to the search results
            // eslint-disable-next-line
            searchedBooks.map((filteredBooks) => {
              // check if searched books match books on list
              let bookOnShelf = books.find((b) => b.id === filteredBooks.id);
              // if book is already on shelf
              if (bookOnShelf) {
                // update corresponding searched book's shelf
                filteredBooks.shelf = bookOnShelf.shelf;
              } else {
                // if book isn't already on shelf, set shelf to 'none'
                filteredBooks.shelf = "none";
              }
            });
            this.setState({ searchedBooks: searchedBooks });
          }
        })
        .catch((e) => {
          this.setState({ searchedBooks: [] });
        });
    }
  };

  render() {
    return (
      <div className="app">
        <Route exact path="/auth" render={() => <Auth />} />

        <Route
          exact
          path="/"
          render={({ history }) => (
            <BookList books={this.state.books} changeShelf={this.changeShelf} />
          )}
        />

        <Route
          exact
          path="/search"
          render={({ history }) => (
            <BookSearch
              searchedBooks={this.state.searchedBooks}
              changeShelf={this.changeShelf}
              submitQuery={this.submitQuery}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
