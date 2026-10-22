
const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

const STORAGE_KEY = "quicknotes-notes";

let notes = [];

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchTerm)
    );

    filteredNotes.forEach((note) => {
        const li = document.createElement("li");
        li.classList.add(
            `category-${note.category.toLowerCase()}`
        );

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("note-category");
        categoryLabel.textContent = note.category;

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const date = document.createElement("p");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            notes = notes.filter((item) => item.id !== note.id);
            saveNotes();
            render();
        });

        li.append(categoryLabel, noteText, date, deleteButton);
        notesList.appendChild(li);
    });

    if (searchTerm !== "" && filteredNotes.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    }

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: `${Date.now()}-${Math.random()}`,
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);
    saveNotes();

    noteInput.value = "";
    errorMessage.textContent = "";

    render();
});

searchInput.addEventListener("input", render);

function loadNotes() {
    try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

        notes = Array.isArray(parsedNotes) ? parsedNotes : [];
    } catch (error) {
        notes = [];
    }

    render();
}

loadNotes();
