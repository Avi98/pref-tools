import React from 'react'
import './App.css'

class Book extends React.Component {

	// make sure thumbnail exists before using it
	checkThumbnailExists(book) {
		if (book.imageLinks.thumbnail) {
			return (
				<div className="book-cover" key={book.imageLinks.thumbnail} style={{ backgroundImage: `url(${book.imageLinks.thumbnail})`}} alt="book cover"></div>
			)
		}
	}
 
	render(){

		// destructuring props so can be called without 'this.props'
	    const { book, changeShelf } = this.props

		return(

		  /* use this.props when receiving props from parent component */
	      <li key={book.id}>
	         <div className="book">
	            <div className="book-top">
	              { this.checkThumbnailExists(book) }
	              <div className="book-shelf-changer">
	                <select onChange={(event) => changeShelf(book, event.target.value)} defaultValue={book.shelf}>
	                  <option value="none" disabled>Move to...</option>
	                  <option value="currentlyReading">Currently Reading</option>
	                  <option value="wantToRead">Want to Read</option>
	                  <option value="read">Read</option>
	                  <option value="none">None</option>
	                </select>
	              </div>
	            </div>
	            <div className="book-title" key={book.title}>{book.title}</div>
	            <div className="book-authors" key={book.authors}>{book.authors && book.authors.join(', ')}</div>
	          </div>
	        
	        </li>
	      
		)
	}
}


export default Book