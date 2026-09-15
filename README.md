# 📝 My Notes

My Notes adalah aplikasi pencatatan sederhana berbasis web yang dibuat menggunakan Vue 3 dan Vite.

Aplikasi ini dirancang untuk menyimpan catatan secara lokal di browser menggunakan `localStorage`, sehingga tidak membutuhkan backend maupun database.

Project ini merupakan hasil rewrite dari versi sebelumnya yang menggunakan HTML, Bootstrap, jQuery, dan JavaScript vanilla menjadi arsitektur Vue yang lebih modern dan lebih mudah dikembangkan.

---

## ✨ Features

- Create note
- Edit note
- Autosave
- Search notes
- Search by title, content, dan tags
- Sort notes
  - Recently Updated
  - Recently Created
  - Title
- Pin / Unpin notes
- Archive / Unarchive notes
- Move notes to Trash
- Restore notes
- Permanent delete
- Empty Trash
- Multi-select notes
- Bulk move to Trash
- Undo delete
- Tags
- Grid View
- List View
- Dark Mode
- Responsive layout
- Local storage persistence
- Keyboard shortcuts

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `N` | Create new note |
| `/` | Focus search |
| `Esc` | Close editor / cancel selection |
| `Cmd + Enter` | Create new note on macOS |
| `Ctrl + Enter` | Create new note on Windows / Linux |

Keyboard shortcut `N` dan `/` tidak akan dijalankan ketika pengguna sedang mengetik di input atau editor.

---

## 🛠 Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide Vue Next](https://lucide.dev/)
- Browser Local Storage

---

## 📦 Installation

Clone repository:

```bash
git clone <repository-url>
```

Masuk ke directory project:

```bash
cd MyNotes
```

Install dependencies
```bash
npm install
```

Jalankan development server
```bash
npm run dev
```

Build Production server
```bash
npm run build
```

## 📁 Project Struktur

```text
MyNotes/
├── public/
├── src/
│   ├── components/
│   │   ├── AppSidebar.vue
│   │   ├── EmptyState.vue
│   │   ├── NoteCard.vue
│   │   ├── NoteEditor.vue
│   │   ├── NoteMenu.vue
│   │   └── UndoToast.vue
│   │
│   ├── composables/
│   │   ├── useNotes.js
│   │   └── useTheme.js
│   │
│   ├── utils/
│   │   └── storage.js
│   │
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md

```
```md
## 🚀 Future Roadmap

- [ ] Custom confirmation modal
- [ ] Import / Export notes
- [ ] JSON backup
- [ ] Markdown editor
- [ ] Rich text editor
- [ ] Checklist
- [ ] Auto title
- [ ] Note colors
- [ ] Tag filter
- [ ] Drag and drop
- [ ] Note duplication
- [ ] Automatic Trash cleanup
- [ ] PWA support
- [ ] Offline installation
- [ ] IndexedDB storage
- [ ] Cloud synchronization
- [ ] Authentication
- [ ] Backend API
- [ ] Sync antar perangkat

```
## 📄 License

This project is intended for learning and personal development.

Feel free to modify and expand the project.