# IDCP Portal — Interior Designer Coordination Portal

An academic MWT (Modern Web Technologies) project: a **frontend-only**
React + Vite application built to demonstrate core React concepts.

```
React Frontend (Vite)  →  Local sample data (in-memory, per session)
```

There is **no backend, no database, and no API server** in this project.
Everything runs from a single `npm run dev` in this folder.

## React concepts demonstrated

| Hook / Feature   | Where it's used                                              |
|-------------------|---------------------------------------------------------------|
| `useState`        | Customer list, search text, form fields, modal open/close, theme, language, font size |
| `useEffect`        | Loading initial sample data on mount (Customers/Projects/Materials/Quotations/Designers/Contractors), applying font size, focusing the search box |
| `useContext`       | `ThemeContext` — theme, language, and font size shared across every page |
| `useRef`           | Focusing the Customers search input; storing a settings-hint timer id |
| `useMemo`          | Filtered customer/project/material/quotation lists, memoized dashboard stats |
| `useCallback`      | Add/Delete/Clear Search/Reset Form handlers on the Customers and Projects pages |
| React Router       | `BrowserRouter`, `Routes`, `Route`, `NavLink`, `useNavigate`, a catch-all 404 route |

## What's in this project

```
IDCP-Portal/
├── src/
│   ├── components/       Sidebar, Header, cards, theme/language controls
│   ├── pages/             Dashboard, Customers, Projects, Materials, Quotations,
│   │                       Designers, Contractors, Suppliers, Appointments,
│   │                       Payments, Reports, Settings, NotFound
│   ├── context/           ThemeContext (theme / language / font size)
│   ├── data/sampleData.js Local, frontend-only sample data (no database)
│   ├── assets/, styles/   Existing finalized UI/UX (colors, fonts, layout)
│   └── App.jsx             React Router route table
├── index.html
├── package.json
└── vite.config.js
```

## Running the project

```
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```
npm run build
npm run preview
```

## Notes

- All data (customers, projects, materials, quotations, designers,
  contractors) lives in `src/data/sampleData.js` and in component state.
  Adding/deleting a customer only changes data for the current browser
  session — there is no persistence layer, by design.
- The Settings page controls a global theme (light/dark), font size
  (small/medium/large), and language (English, தமிழ், हिन्दी, తెలుగు,
  മലയാളം, ಕನ್ನಡ), all shared app-wide via `ThemeContext`.
