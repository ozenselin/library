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