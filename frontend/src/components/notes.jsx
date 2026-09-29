import {useState, useEffect} from 'react'
import api from '../api'
import Note from './Note'


function Notes() {
    // 1. Updated state to manage notes
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [content, setContent] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    const [title, setTitle] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [showForm, setShowForm] = useState(false);

    const getNotes = async () => {
        try {
            // 1. Await the direct API response
            const response = await api.get('/api/notes/')
            //const response = await api.get('/api/notes/')
            //        .then((response) => setNotes(res.data))
            //        .catch(err => console.error("Error fetching notes:", err));
            // 2. Axios automatically puts the payload inside .data
            const data = response.data;
            // 3. Update your React state
            setNotes(data);
            console.log(data);
        } catch (err) {
            // 4. Handle errors cleanly without blocking the page UI
            console.error('Error fetching notes:', err);
            setError(err.message || 'Failed to load notes');
        } finally {
            // 5. This always runs, turning off your loading spinner
            setLoading(false);
        }
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", {content, title})
            .then((response) => {
                setNotes([...notes, response.data]);
                setNewNoteTitle('');
                setNewNoteContent('');
                if (response.status === 201) {
                    console.log('Note created');
                } else {
                    console.error('Failed to create note');
                }
                getNotes();
            })
            .catch((error) => console.error('Create note failed:', error.message));
    }

    const deleteNote = async (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((response) => {
                // Filter out the deleted note from your React state UI
                setNotes(notes.filter(note => note.id !== id));
                if (response.status === 204) {
                    console.log('Note deleted');
                } else {
                    console.error('Failed to delete note');
                }
                getNotes();
            })
            .catch((error) => console.error('Delete note failed:', error.message));
    }

    // 2. Fetch notes on component load (Triggers NoteListCreateView GET method)
    useEffect(() => {
        getNotes();
    }, []);
 
    if (loading) return <p>Loading notes...</p>;
    if (error) return <p>Error loading notes: {error}</p>;

    return (
        <div className="notes-dashboard-container">
            <div className="notes-header d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold mb-0">My Quick Notes</h3>
                <button 
                    className="btn btn-outline-primary btn-sm" 
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Close' : 'Add Note'}
                </button>
            </div>
            
            {showForm && (
                <div className="note-create-box p-3 mb-4 border rounded-3 bg-light">
                    <form onSubmit={createNote} className="d-flex flex-column gap-2">
                        <input 
                            type='text' 
                            className="form-control form-control-sm" 
                            placeholder="Note Title" 
                            required 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea 
                            className="form-control form-control-sm" 
                            placeholder="Note content..." 
                            required 
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm">Save Note</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="notes-grid d-flex flex-wrap gap-3">
                {notes.length === 0 ? (
                    <p className="text-muted">No notes yet. Start adding some!</p>
                ) : (
                    notes.map((note) => (
                        <Note note={note} onDelete={deleteNote} key={note.id} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;