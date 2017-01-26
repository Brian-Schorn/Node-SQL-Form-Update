// doc ready function
$(function(){
  console.log('document loaded');

  getBooks();

  // listen for a submit event on the form
  $('#book-form').on('submit', addBook);
  $('#book-list').on('click', '.save', updateBook);
  $('#book-list').on('click', '.delete', deleteBook);

});

function getBooks() {
  $.ajax({
    url: '/books',
    type: 'GET',
    success: displayBooks
  });
}

function displayBooks(books) {
  console.log('Got books from the server', books);

  $('#book-list').empty();

  books.forEach(function(book){
    var $li = $('<li></li>');
    var $form = $('<form></form>');

    $form.append('<label for="title">Title:</label><input type="text" name="title" value="' + book.title + '" /><br>');
    $form.append('<label for="author">Author:</label><input type="text" name="author" value="' + book.author + '" /><br>');

    // $li.append('<p><big><strong>' + book.title + '</big></strong></p>');
    // $li.append('<p><em>' + book.author + '</em></p>');

    var date = new Date(book.publication_date).toISOString().slice(0,10);
    $form.append('<label for="published">Published:</label><input type="date" name="published" value="' + date + '"/><br>');
    $form.append('<label for="edition">Edition:</label><input type="text" name="edition" value="' + book.edition + '" /><br>');
    $form.append('<label for="publisher">Publisher:</label><input type="text" name="publisher" value="' + book.publisher + '" /><br>');



    var $button = $('<button class="save">Save!</button><button class="delete">Delete!</button>');
    $button.data('id', book.id);
    $form.append($button);

    $li.append($form);
    // $li.append('<p><time><strong>Publication Date: </strong>' + date + '</time></p>');
    //
    // $li.append('<p><strong>Edition: </strong>' + book.edition + '</p>');
    // $li.append('<p><strong>Publisher: </strong>' + book.publisher + '</p>');

    $('#book-list').append($li);
  });
}

function addBook(event) {
  // prevent browser from refreshing
  event.preventDefault();

  // get the info out of the form
  var formData = $(this).serialize();

  // send data to server
  $.ajax({
    url: '/books',
    type: 'POST',
    data: formData,
    success: getBooks
  });

}

function updateBook(event) {
  event.preventDefault();

  var $button = $(this);
  var $form = $button.closest('form');

  var data = $form.serialize();

  $.ajax({
    url: '/books/' + $button.data('id'),
    type: 'PUT',
    data: data,
    success: getBooks
  });
}

function deleteBook(event) {
  event.preventDefault();

  var $button = $(this);

  $.ajax({
    url: '/books/' + $button.data('id'),
    type: 'DELETE',
    success: getBooks
  });
}
