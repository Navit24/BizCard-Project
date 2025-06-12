# Digital Business Card (BizCard)

A modern web system for managing digital business cards, allowing businesses and individuals to create, edit, share, and manage business cards in a smart, convenient, and secure way.

## Main Features

- **Sign up and Login** (including regular, business, and admin users)
- **Create, edit, and delete business cards**
- **Mark cards as favorites**
- **User management (admin only)**
- **Smart search and filtering system**
- **Modern and user-friendly interface**
- **Fully responsive for mobile and desktop**

## Main Technologies

- React 19 + TypeScript
- Redux Toolkit
- Vite
- Flowbite-React (UI)
- SweetAlert2 (popups)
- Joi (validation)
- axios (API communication)
- react-hook-form (form management)
- react-router-dom (routing)

## Installation & Running

1. Make sure Node.js (v18+) is installed
2. Run:

```bash
npm install
npm run dev
```

3. The app will be available at: http://localhost:5173

## Main Pages Structure

- **Home**: View all business cards, search, like, pagination.
- **About**: Information about the system and contact details.
- **Favorites**: View all cards marked as favorites.
- **My Cards**: Manage cards created by the business user.
- **Profile**: View and edit user details.
- **Sign Up / Login**: Create a new account or log in.
- **Create Card / Edit Card**: Forms for creating and editing business cards.
- **User Management**: (admin only) View, change status, and delete users.

## Permissions

- Regular user: View cards, mark favorites, edit profile.
- Business user: All the above + create, edit, and delete cards.
- Admin: All the above + user management.

## License

MIT

---

For questions and support: contact@bizcard.co.il

---
