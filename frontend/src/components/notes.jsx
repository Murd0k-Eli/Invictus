import {useState, useEffect} from 'react'
import api from '../api'
import Note from './Note'


function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

   const getNotes = async () => {
    try {
        // 1. Await the direct API response
        const response = await api.get('/api/notes/');
        // 2. Axios automatically puts the payload inside .data
        const data = response.data;
        // 3. Update your React state
        setNotes(data);
        console.log(data);
    } catch (err) {
        // 4. Handle errors cleanly
        alert('Error fetching notes: ' + err.message);
        setError(err.message);
    } finally {
        // 5. This always runs, turning off your loading spinner
        setLoading(false);
    }
};

 
    const deleteNote = async (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((response) => {
                if (response.status === 204) 
                    alert("Note deleted")
                else 
                    alert("Failed to delete Note")
                getNotes();
            })
            .catch((error) => alert(error.message));
    }

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", {content, title})
            .then((response) => {
                if (response.status === 201) 
                    alert("Note Created.")
                else 
                    alert("Failed to create Note")
                getNotes();
            })
            .catch((error) => alert(error.message));
    }

    useEffect(() => {
        getNotes();
    }, []);
 
    if (loading) return <p>Loading notes...</p>;
    if (error) return <p>Error loading notes: {error}</p>;

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes && notes?.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>
            <div>
                <h2>Create a Note: </h2>
                <form onSubmit={createNote}>
                    <br/>
                    <label htmlFor='title'>Title: </label>
                    <input 
                        type='text' 
                        id='title' 
                        name='title' 
                        required 
                        onChange={(e) => setTitle(e.target.value)}
                        value ={title}
                    />
                    <br/>
                    <br/>
                    <label htmlFor='content'>Content: </label>
                    <textarea  
                        id='content' 
                        name='content' 
                        required 
                        onChange={(e) => setContent(e.target.value)}
                        value ={content}
                    />
                    <br/>
                    <input type="submit" value ="Submit"></input>
                </form>
            </div>
        </div>
    );
}

export default Notes;