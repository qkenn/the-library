const form = document.getElementById('form'),
  openBtn = document.getElementById('open'),
  formModal = document.getElementById('form-modal'),
  closeBtn = document.getElementById('close-btn'),
  bookTemplate = document.getElementById('book-template'),
  booksGrid = document.getElementById('books-grid');

// books collection
let library = [];

// add demo books to collection
addToLibrary('1984', 'George Orwell', 328, 1949, true);
addToLibrary('The Lord of the Rings', 'J.R.R. Tolkien', 1216, 1954, false);
addToLibrary('This Book Loves You', 'PewDiePie', 224, 2015, true);

// book constructor
function Book(title, author, pages, publishedYear, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.publishedYear = publishedYear;
  this.isRead = isRead;
}

// book toggle prototype function
Book.prototype.toggle = function () {
  this.isRead = !this.isRead;
};

// create and render book card upon form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  // extract and purify form data
  const title = DOMPurify.sanitize(data.get('book_title'));
  const author = DOMPurify.sanitize(data.get('book_author'));
  const pages = DOMPurify.sanitize(data.get('book_pages'));
  const publishedYear = DOMPurify.sanitize(data.get('book_year'));
  let isRead = DOMPurify.sanitize(data.get('read_status'));

  addToLibrary(
    title,
    author,
    pages,
    publishedYear,
    isRead == 'true' ? true : false
  );

  renderBooks(library);

  formModal.close();
});

openBtn.addEventListener('click', () => {
  formModal.showModal();
});

closeBtn.addEventListener('click', () => {
  formModal.close();
});

// add to books collection
function addToLibrary(...book) {
  const newBook = new Book(...book);
  library.push(newBook);
}

// create book card dom element
function createBookCard(book, bookIndex) {
  const clone = bookTemplate.content.cloneNode(true);

  const title = clone.querySelector('.template-title');
  const author = clone.querySelector('.template-author');
  const pages = clone.querySelector('.template-pages');
  const publishedYear = clone.querySelector('.template-year');
  const toggleMsg = clone.querySelector('.template-toggle-msg');
  const template = clone.querySelector('.book-template');
  const deleteBtn = clone.querySelector('.delete-btn');
  const toggleBtn = clone.querySelector('.toggle-btn');

  book.title ? (title.textContent = book.title) : (title.textContent = '');
  book.author
    ? (author.textContent = `By ${book.author}`)
    : (author.textContent = '');
  book.pages
    ? (pages.textContent = `${book.pages} pages.`)
    : (pages.textContent = '');

  book.publishedYear
    ? (publishedYear.textContent = `Published in ${book.publishedYear}.`)
    : (publishedYear.textContent = '');

  toggleMsg.textContent = book.isRead
    ? '✅ You have read this.'
    : "❎ You haven't read this yet.";

  book.isRead
    ? (template.style.borderBottom = '10px solid rgb(44, 189, 0)')
    : (template.style.borderBottom = '10px solid rgb(255, 174, 0)');

  template.dataset.id = bookIndex;

  // template elements isn't availbale in global scope: template haven't initiated
  handleDelete(deleteBtn, bookIndex);
  handleToggle(toggleBtn, bookIndex);

  return clone;
}

// render available books on books collection
function renderBooks(books) {
  booksGrid.innerHTML = '';

  const fragment = document.createDocumentFragment();

  books.forEach((book, bookIndex) => {
    const clone = createBookCard(book, bookIndex);
    fragment.appendChild(clone);
  });

  booksGrid.appendChild(fragment);
}

// handles book deletion
function handleDelete(deleteBtn, bookIndex) {
  deleteBtn.addEventListener('click', () => {
    library = library.filter((book, index) => index != bookIndex);

    // re-render book cards after deletion
    renderBooks(library);
  });
}

// handles book read toggle
function handleToggle(toggleBtn, bookIndex) {
  toggleBtn.addEventListener('click', () => {
    const book = library.find((book, index) => index == bookIndex);

    book.toggle();

    renderBooks(library);
  });
}

// initial render
renderBooks(library);
