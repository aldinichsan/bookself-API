const { nanoid } = require('nanoid')
const books = require('./books')

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  let finished
  if (readPage === pageCount) {
    finished = true
  } else {
    finished = false
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  if (pageCount >= readPage && name !== undefined) {
    books.push(newBook)
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  if (reading !== undefined) {
    const read = !(reading < 1)
    return {
      status: 'success',
      data: {
        books: books.filter((book) => book.reading === read).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }
  }
  if (finished !== undefined) {
    const finis = !(finished < 1)
    return {
      status: 'success',
      data: {
        books: books.filter((book) => book.finished === finis).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }
  }
  if (name !== undefined) {
    return {
      status: 'success',
      data: {
        books: books.filter(book => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }
  }
  return {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }
}

const getBooksByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.filter((book) => book.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  let isSuccess
  if (name === undefined) {
    isSuccess = undefined
  } else if (readPage > pageCount) {
    isSuccess = false
  } else {
    isSuccess = true
  }
  const index = books.findIndex((book) => book.id === id)
  if (isSuccess && index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  if (isSuccess === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (isSuccess === false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
}
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
