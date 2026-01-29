# Wedding Planner

A comprehensive wedding planning application built with Laravel 12 and React 19.

## Features

- **Wedding Management** - Create and manage multiple weddings with detailed information
- **Guest Management** - Track guests, RSVPs, dietary restrictions, and plus-ones
- **Vendor Management** - Manage vendors with contact info, pricing, and payment tracking
- **Budget Management** - Organize budget by categories with expense tracking
- **Task Checklist** - Keep track of wedding tasks with due dates and priorities
- **Timeline** - Plan wedding day schedule and other important events
- **Seating Charts** - Create tables and assign guests to seats
- **Venue Management** - Store venue details and contacts
- **Wedding Party** - Manage bridesmaids, groomsmen, and other party members
- **Gift Registry** - Track gift registries and purchased items
- **Invitations** - Monitor invitation status and responses
- **Marriage Certificate** - Store certificate details
- **Accommodations** - Manage hotel blocks for guests
- **Menus** - Plan reception menus with dietary options

## Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **Laravel Fortify** - Authentication
- **MySQL/PostgreSQL** - Database

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Inertia.js** - SPA without API
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Requirements

- PHP 8.2+
- Node.js 18+
- Composer
- MySQL 8.0+ or PostgreSQL 14+

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-planner
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**

   Update `.env` with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=wedding_planner
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

## Development

Start the development servers:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev
```

Or with Laravel Herd, just run:
```bash
npm run dev
```

## Project Structure

```
wedding-planner/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # API controllers
│   │   └── Requests/         # Form validation
│   ├── Models/               # Eloquent models
│   └── Policies/             # Authorization policies
├── database/
│   └── migrations/           # Database migrations
├── resources/
│   └── js/
│       ├── components/       # Reusable React components
│       │   └── ui/           # UI primitives (shadcn/ui style)
│       ├── layouts/          # Page layouts
│       ├── lib/              # Utilities
│       └── pages/            # Inertia pages
│           └── weddings/     # Wedding-related pages
├── routes/
│   └── web.php               # Web routes
└── tests/                    # Test files
```

## Design

The application features an elegant black and white design with:
- Clean, minimal interface
- Card-based layouts
- Neutral color palette with accent colors for status indicators
- Responsive design for all screen sizes
- Accessible components using Radix UI primitives

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).
