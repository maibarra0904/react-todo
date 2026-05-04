# React Todo App with Google Authentication

A modern, responsive Todo application built with React and Vite. This app features a robust set of capabilities including drag-and-drop task reordering, multiple project management, data import/export, and seamless authentication via Google.

## Features

- **Google Authentication:** Secure login using `@react-oauth/google`.
- **Multiple Projects:** Create and manage separate todo lists (projects).
- **Drag & Drop:** Reorder tasks intuitively using `@hello-pangea/dnd`.
- **Filtering:** View all, active, or completed tasks.
- **Import/Export:** Save your projects locally or export them as a JSON file.
- **Responsive Design:** Styled with Tailwind CSS and Bootstrap for a great experience on any device.
- **Dark Mode Support:** Designed to adapt to light and dark theme preferences.

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Bootstrap
- SweetAlert2
- `@hello-pangea/dnd` (Drag and drop interface)
- `@react-oauth/google`

## Setup & Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a `.env` file and configure your credentials (you can use `.env.example` as a guide):
   ```env
   VITE_ID_PROJECT=WSX
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Authentication

This application exclusively utilizes a backend to handle authentication via Google OAuth. It communicates with a remote API to validate Google tokens securely.

## Deployment

This project is configured and ready to be deployed on platforms like Netlify. Remember to configure your environment variables in your hosting provider's dashboard before deploying.
