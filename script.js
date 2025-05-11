class Book {
    constructor(title, author, pages, isRead = false) {
        const id = Date.now().toString() + Math.random().toString().substring(2,5);
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }

    getInfo(){
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? 'is read' : 'not read yet'}}`;
    }

    toggleStatus(){
        this.isRead = !this.isRead;
        return this.isRead;
    }
}

class LibraryModule {
    static #books = [];

    //helper functions start with #
    static #findBookIndex(id) {
        return LibraryModule.#books.findIndex(book => book.id === id);
    }

    
    static #getBookById(id) {
        return LibraryModule.#books.at(LibraryModule.#findBookIndex(id));
    }

    static getBooks() {
        return [...LibraryModule.#books]
    }

    
    static clearLibrary() {
        LibraryModule.#books.length = 0;
    }

    static addBook(book) {
        LibraryModule.#books.push(book);
        return book;
    }
    
    static removeBook(id) {
        const index = LibraryModule.#findBookIndex(id);
        if(index !== -1){
            const removedBook = books.splice(index, 1);
            return removedBook;
        }
        return null;
    }

    static toggleBookStatus(id) {
        const book = LibraryModule.#getBookById(id);
        if(book){
            book.toggleStatus();
            return true;
        }
        return false;
    }
}

class UIModule {
    
    //helper functions
    static #clearBooks() {
        bookList = document.querySelector('.book-list');
        bookList.innerHTML = '';
    }
    
    static #createBookElement(book) {
        const innerHTML = `<div class="book-list__info">
                        <div class="book-list__top-row">
                            <span class="book-list__title">${book.title}</span>
                            <span class="book-list__author">by ${book.author}</span>
                        </div>
                        <div class="book-list__bottom-row">
                            <span class="book-list__pages">${book.pages} pages</span>
                            <span class="book-list__status">${book.isRead ? 'is read' : 'not read yet'}</span>
                        </div>
                    </div>

                    <div class="book-list__actions">
                        <button
                            class="book-list__remove-btn"
                            aria-label="Remove ${book.title} from library"
                        >
                            <svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>
                        </button>

                        <button 
                            class="book-list__toggle-status"
                            aria-label="Toggle read status for ${book.title}"
                            data-status="${book.isRead ? 'read' : 'unread'}"
                            >
                            <svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960" fill="currentColor">
                                <path d="M240-80q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h440v640H240q-17 0-28.5 11.5T200-200q0 17 11.5 28.5T240-160h520v-640h80v720H240Zm120-240h240v-480H360v480Zm-80 0v-480h-40q-17 0-28.5 11.5T200-760v447q10-3 19.5-5t20.5-2h40Z"/>
                            </svg>
                            <span class="visually-hidden status-text">Mark as ${book.isRead ? 'unread' : 'read'}</span>
                        </button>
                    </div>
                    <span class="book-list__number">(  )</span>`;
        //create a li
        const newBookElement = document.createElement('li');

        //add innerhtml 
        newBookElement.innerHTML = innerHTML;

        //set attribute and class
        newBookElement.classList.add('book-list__item');
        newBookElement.setAttribute('data-id', book.id);

        return newBookElement;
    }

    static #findBookListItem(id) {
        const bookList = document.querySelector('.book-list');
        return bookList.querySelector(`[data-id="${id}"]`);
    }
    
    static numberBooks() {
        const numberSpans = document.querySelectorAll('.book-list__number');
        let ctr = 1;
        numberSpans.forEach(numberSpan => {
            numberSpan.textContent = `(0${ctr})`;
            ctr++
        });
    }

    static displayBook(book) {
        const bookList = document.querySelector('.book-list');

        //create an element (a list item) from the given book object
        const newBookElement = UIModule.#createBookElement(book);

        //display it on the book list
        bookList.appendChild(newBookElement);

        //add event listeners to corresponding buttons
        newBookElement.querySelector('.book-list__toggle-status').addEventListener('click', EventModule.handleToggleBookStatus);
        newBookElement.querySelector('.book-list__remove-btn').addEventListener('click', EventModule.handleRemoveBook);

        //numberBooks
        UIModule.numberBooks();
    }

    static removeBook(id) {
        const bookListItem = UIModule.#findBookListItem(id);
        if(bookListItem){
            bookListItem.parentElement.removeChild(bookListItem);
            UIModule.numberBooks();
            return bookListItem;
        }
        return null;
    }

    //dialog functions
    static openDialog() {
        const dialog = document.querySelector('#add-book-dialog');
        dialog.showModal();
    }

    static closeDialog() {
        const dialog = document.querySelector('#add-book-dialog');
        dialog.close();
    }

    static getFormData() {
        const form = document.querySelector('#book-form');
        return {
            title: document.querySelector('#book-title').value.trim(),
            author: document.querySelector('#book-author').value.trim(),
            pages: document.querySelector('#book-pages').value || 0,
            isRead: document.querySelector('#book-read').checked,
        }
    }

    static clearForm() {
        const form = document.querySelector('#book-form');
        form.reset();
    }

    static toggleStatus(id) {
        const bookListItem = UIModule.#findBookListItem(id);
        if(bookListItem){
            const buttonSpan = bookListItem.querySelector('.status-text');
            buttonSpan.textContent = (buttonSpan.textContent === 'Mark as unread') ? 'Mark as read' : 'Mark as unread';

            const infoSpan = bookListItem.querySelector('.book-list__status');
            infoSpan.textContent = (infoSpan.textContent === 'not read yet') ? 'is read' : 'not read yet';
        }
    }

    static displayBooks() {
        const books = LibraryModule.getBooks();
        UIModule.#clearBooks();
        books.forEach((book) => {
            UIModule.displayBook(book);
        });
    }

    static setupEventListeners() {
        //get elements
        const addBookButton = document.querySelector('#add-book-btn');
        const registerBookButton = document.querySelector('#register-book-btn');
        const clearDialogButton = document.querySelector('#clear-dialog-btn');
        const cancelDialogButton = document.querySelector('#close-dialog-btn');
        const bookSearchInput = document.querySelector('#book-search');

        //setup event listeners
        addBookButton.addEventListener('click', EventModule.handleOpenDialog);
        registerBookButton.addEventListener('click', EventModule.handleAddBook);
        clearDialogButton.addEventListener('click', EventModule.handleClearDialog);
        cancelDialogButton.addEventListener('click', EventModule.handleCloseDialog);
        //input event fires each time when user presses a new key while writing at the input bar
        bookSearchInput.addEventListener('input', EventModule.handleSearchBook); 
    }

    static filterBooks(query) {
        const books = LibraryModule.getBooks();

        UIModule.#clearBooks();

        const filteredBooks = books.filter((book) => {
            return  book.title.toLowerCase().includes(query.toLowerCase()) || 
                    book.author.toLowerCase().includes(query.toLowerCase());
        });

        filteredBooks.forEach((book) => {
            UIModule.displayBook(book);
        });
    }

}

class EventModule {
    static handleOpenDialog() {
        UIModule.openDialog();
    }

    static handleCloseDialog() {
        UIModule.closeDialog();
    }

    static handleAddBook(event) {
        event.preventDefault();
        
        //get the form data (4 prpoerties) and create a book object with prototype methods from it
        const {title, author, pages, isRead} = UIModule.getFormData();
        const newBook = new Book(title, author, pages, isRead);

        //register it in the books[] list
        LibraryModule.addBook(newBook);

        //display the new book on the screen
        UIModule.displayBook(newBook);

        UIModule.clearForm();
        UIModule.closeDialog();
    }

    static handleRemoveBook(event) {
        const button = event.target;

        //find the id of the book item corresponding to the button clicked:
        //find the closest book list item to the button clicked
        const bookListItem = button.closest('li');

        //every book list item has a unique data-id property
        const id = bookListItem.getAttribute('data-id');

        UIModule.removeBook(id);
        LibraryModule.removeBook(id);
    }

    static handleClearDialog() {
        UIModule.clearForm();
    }

    static handleToggleBookStatus(event) {
        //get the button
        const button = event.target;

        //find the id of the book item corresponding to the button clicked:
        //find the closest book list item to the button clicked
        const bookListItem = button.closest('li');

        //every book list item has a unique data-id property
        const id = bookListItem.getAttribute('data-id');

        UIModule.toggleStatus(id);
        LibraryModule.toggleBookStatus(id);
    }

    static handleSearchBook() {
        const searchInput = document.querySelector('#book-search');
        const query = searchInput.value;
        UIModule.filterBooks(query);
    }

}

class App {
    
    static #sampleBookData = [
        {title: "The Hobbit", author: "J.R.R Tolkien", pages: 295, isRead: false},
        {title: "1984", author: "George Orwell", pages: 328, isRead: true},
        {title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281, isRead: false},
        {title: "War and Peace", author: "Leo Tolstoy", pages: 1225, isRead: false},
        {title: "The Catcher in the Rye", author: "J.D. Salinger", pages: 214, isRead: true},
        {title: "The Lord of the Rings", author: "J.R.R. Tolkien", pages: 1216, isRead: true},
        {title: "The Alchemist", author: "Paulo Coelho", pages: 208, isRead: false},
        {title: "Crime and Punishment", author: "Fyodor Dostoevsky", pages: 671, isRead: false},
    ];

    
    static addSampleBooks() {
        App.#sampleBookData.forEach((book) => {
            const {title, author, pages, isRead} = book;
            const newBookObject = new Book(title, author, pages, isRead);
            console.log(newBookObject);
            console.log(newBookObject.getInfo());
            LibraryModule.addBook(newBookObject);
            UIModule.displayBook(newBookObject);
        });
    }

    
    static init(){
        document.addEventListener('DOMContentLoaded', () => {
            UIModule.setupEventListeners();
        });
        App.addSampleBooks();
    }

}

//start the App
App.init();