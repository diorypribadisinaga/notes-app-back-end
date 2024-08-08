const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);

  const createdAt = new Date().toISOString();
  const newNote = {
    title, tags, body, id, createdAt, updatedAt: createdAt
  };

  notes.push(newNote);
  const isSuccess = notes.find((note) => note.id === id);

  if (isSuccess){
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      }
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;

};

const getAllNotesHandler = ()=>({
  status: 'success',
  data: {
    notes,
  }
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.find((note) => note.id === id);
  if (!note){
    return h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    }).code(404);
  }
  return h.response({
    status: 'success',
    data: {
      note
    }
  });
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1){
    notes.splice(index, 1, {
      ...notes[index], title, tags, body, updatedAt: new Date().toISOString(),
    });
    return h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui'
    });
  }
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan'
  }).code(404);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1){
    notes.splice(index, 1);
    return h.response({
      status: 'success',
      message:'Catatan berhasil dihapus'
    });
  }
  return h.response({
    status: 'fail',
    message: 'Gagal mengehapus catatan. Id tidak ditemukan'
  }).code(404);
};

module.exports = {
  addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler
};
