# **App Name**: PG Locator

## Core Features:

- Role-Based User Authentication: Secure user signup and login using Firebase Authentication, assigning distinct 'tenant', 'owner', or 'admin' roles stored within user profiles in Firestore, with role-based route protection.
- Owner Property Listing & Management: Enable owners to create, view, edit, and delete their PG/Hostel listings (CRUD). Includes uploading multiple property images to Firebase Storage and managing listing status (pending/approved).
- AI Listing Enhancer Tool: An AI tool using Gemini via Genkit, available to owners to suggest engaging property descriptions and relevant amenities, improving listing appeal and search discoverability.
- Tenant Property Search & Discovery: Tenants can search and filter available PG/Hostel listings by criteria including city, area, rent range, amenities, and room type, displaying only approved listings.
- Detailed Property View & Contact: Display comprehensive details for each listing, including a gallery of images (from Firebase Storage URLs), rental price, amenities, description, and direct contact options (contact number, WhatsApp button) for owners.
- Admin Content Moderation Dashboard: Provide administrators with a dedicated dashboard to view all listings, approve/reject new listings, delete spam properties, and manage (view/delete) user accounts.

## Style Guidelines:

- Primary color: A welcoming and clear orange-brown (#CC6817) to evoke warmth and discovery. (HSL: 30, 80%, 45%)
- Background color: A very light, warm off-white (#F7F1EC) derived from the primary hue, ensuring a clean and legible interface. (HSL: 30, 20%, 95%)
- Accent color: A striking red (#CC4D4D) to highlight critical actions, warnings, and calls to attention, providing strong contrast. (HSL: 0, 70%, 60%)
- Body and headline font: 'Inter' (sans-serif) for its modern, neutral, and highly readable qualities, supporting both headlines and longer text passages efficiently.
- Use a consistent set of clean, minimalist outline icons for amenities, navigation, and actions, ensuring clarity and quick recognition.
- Implement a responsive, mobile-first, card-based layout for property listings and dashboards to ensure optimal viewing and interaction across all device sizes.
- Limit animations to subtle feedback (e.g., hover effects, small loaders for data fetching) to maintain a fast, performant, and clutter-free user experience.