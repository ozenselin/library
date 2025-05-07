const bookModule = (() => {
    const bookPrototype = {
        getInfo(){
            return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? 'is read' : 'not read yet'}}`;
        },
        toggleStatus(){
            this.isRead = !this.isRead;
            return this.isRead;
        }
    }
    const createBook = (title, author, pages, isRead = false) => {
        const id = Date.now().toString() + Math.random().toString().substring(2,5);
        const newBook = {
            id,
            title,
            author,
            pages,
            isRead,
        }
        Object.setPrototypeOf(newBook, bookPrototype);
        return newBook;
    }

    return {
        createBook,
    }
})();

const libraryModule = (() => {
    
    const books = [];

    
    const findBookIndex = (id) => {
        return books.findIndex(book => book.id === id);
    }

    
    const getBookById = (id) => {
        return books.at(findBookIndex(id));
    }

    const getBooks = () => {
        return [...books]
    }

    
    const clearLibrary = () => {
        books = [];
    }

    const addBook = (book) => {
        books.push(book);
        return book;
    }
    
    const removeBook = (id) => {
        const index = findBookIndex(id);
        if(index !== -1){
            const removedBook = books.splice(index, 1);
            return removedBook;
        }
        return null;
    }

    const toggleBookStatus = (id) => {
        const book = getBookById(id);
        if(book){
            book.toggleStatus;
            return true;
        }
        return false;
    };

    return{
        getBooks,
        addBook,
        removeBook,
        clearLibrary,
        toggleBookStatus,
    }
})();

const UIModule = (() => {
    
    const clearBooks = () => {
        const bookList = document.querySelector('.book-list');
        bookList.innerHTML = '';
    }
    
    const createBookElement = (book) => {
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
                    </div>`;
        //create a li
        const newBookElement = document.createElement('li');

        //add innerhtml 
        newBookElement.innerHTML = innerHTML;

        //set attribute and class
        newBookElement.classList.add('book-list__item');
        newBookElement.setAttribute('data-id', book.id);

        return newBookElement;
    };

    const displayBook = (book) => {
        const bookList = document.querySelector('.book-list');

        //create an element (a list item) from the given book object
        const newBookElement = createBookElement(book);

        //display it on the book list
        bookList.appendChild(newBookElement);

        //add event listeners to corresponding buttons
        newBookElement.querySelector('.book-list__toggle-status').addEventListener('click', eventModule.handleToggleBookStatus);
        newBookElement.querySelector('.book-list__remove-btn').addEventListener('click', eventModule.handleRemoveBook);
    };
    
    const findBookListItem = (id) => {
        const bookList = document.querySelector('.book-list');
        return bookList.querySelector(`[data-id="${id}"]`);
    };

    return{
        displayBook,
        createBookElement,
        findBookListItem,
        clearBooks
    }
})();

const eventModule = (() => {
    const handleOpenDialog = () =>{
        UIModule.openDialog();
    }

    const handleCloseDialog = () =>{
        UIModule.closeDialog();
    }

    const handleAddBook = (event) => {
        event.preventDefault();
        
        //get the form data (4 prpoerties) and create a book object with prototype methods from it
        const {title, author, pages, isRead} = UIModule.getFormData();
        const newBook = bookModule.createBook(title, author, pages, isRead);

        //register it in the books[] list
        libraryModule.addBook(newBook);

        //display the new book on the screen
        UIModule.displayBook(newBook);

        UIModule.clearForm();
        UIModule.closeDialog();
    }

    const handleRemoveBook = (event) => {
        const button = event.target;

        //find the id of the book item corresponding to the button clicked:
        //find the closest book list item to the button clicked
        const bookListItem = button.closest('li');

        //every book list item has a unique data-id property
        const id = bookListItem.getAttribute('data-id');

        UIModule.removeBook(id);
        libraryModule.removeBook(id);
    }

    const handleClearDialog = () => {
        UIModule.clearForm();
    }

    const handleToggleBookStatus = (event) => {
        //get the button
        const button = event.target;

        //find the id of the book item corresponding to the button clicked:
        //find the closest book list item to the button clicked
        const bookListItem = button.closest('li');

        //every book list item has a unique data-id property
        const id = bookListItem.getAttribute('data-id');

        UIModule.toggleStatus(id);
        libraryModule.toggleBookStatus(id);
    }

    return {
        handleOpenDialog,
        handleCloseDialog,
        handleAddBook,
        handleRemoveBook,
        handleClearDialog,
        handleToggleBookStatus,
    }
})();