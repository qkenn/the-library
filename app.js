const form = document.getElementById('form'),
  openBtn = document.getElementById('open'),
  formModal = document.getElementById('form-modal'),
  closeBtn = document.getElementById('close-btn'),
  bookTemplate = document.getElementById('book-template'),
  booksGrid = document.getElementById('books-grid');

// books collection
let library = [
  { title: 'Sapiens', author: 'Yuval Noah Harari', pages: 498, isRead: true },
  { title: 'GenX', author: 'Batman', pages: 200, isRead: false },
  { title: 'GenY', author: 'Spider-man', pages: 300, isRead: true },
];

// book constructor
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// create and render book card upon form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  // extract and purify form data
  const title = DOMPurify.sanitize(data.get('book_title'));
  const author = DOMPurify.sanitize(data.get('book_author'));
  const pages = DOMPurify.sanitize(data.get('book_pages'));
  let isRead = DOMPurify.sanitize(data.get('read_status'));

  const newBook = new Book(
    title,
    author,
    pages,
    isRead == 'true' ? true : false
  );

  addToLibrary(newBook);

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
function addToLibrary(book) {
  library.push(book);
}

// create book card dom element
function createBookCard(book, bookIndex) {
  const clone = bookTemplate.content.cloneNode(true);

  const title = clone.querySelector('.template-title');
  const author = clone.querySelector('.template-author');
  const pages = clone.querySelector('.template-pages');
  const readStatus = clone.querySelector('.template-read-status');
  const template = clone.querySelector('.book-template');
  const deleteBtn = clone.querySelector('.delete-btn');

  book.title ? (title.textContent = book.title) : (title.textContent = '');
  book.author
    ? (author.textContent = `By ${book.author}`)
    : (author.textContent = '');
  book.pages
    ? (pages.textContent = `${book.pages} pages.`)
    : (pages.textContent = '');

  readStatus.textContent = book.isRead
    ? '✅ You have read this.'
    : "❎ You haven't read this yet.";

  book.isRead
    ? (template.style.borderBottom = '10px solid rgb(44, 189, 0)')
    : (template.style.borderBottom = '10px solid rgb(255, 174, 0)');

  template.dataset.id = bookIndex;

  // deleteBtn isn't availbale in global scope: template haven't initiated
  handleDelete(deleteBtn, bookIndex);

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

// initial render
renderBooks(library);

function handleDelete(deleteBtn, bookIndex) {
  deleteBtn.addEventListener('click', () => {
    library = library.filter((book, index) => index != bookIndex);

    // re-render book cards after deletion
    renderBooks(library);
  });
}
