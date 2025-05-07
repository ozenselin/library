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