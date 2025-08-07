# Underwriting App

A modern Angular 19 application for underwriters to manage credit approval memos with a responsive layout featuring a collapsible sidebar.

## Features

### Layout Components
- **Header**: Fixed header with lending icon, app title, and user menu with avatar
- **Sidebar**: Collapsible sidebar with navigation menu that shows only icons when collapsed
- **Footer**: Fixed footer with copyright information
- **Main Content**: Responsive main content area that adjusts based on sidebar state

### Dashboard
- **Grid Layout**: Credit approval memos displayed in a responsive grid
- **Upload Button**: Prominent upload button in the top-right corner
- **Memo Cards**: Each memo displays:
  - Title and date
  - Status with color-coded chips
  - Amount, borrower, and underwriter information
  - Action buttons (View, Edit, Delete)

### Navigation
- Dashboard
- Credit Memos
- Upload
- Analytics
- Settings

## Technology Stack

- **Angular 19**: Latest version with standalone components
- **Angular Material**: UI components and theming
- **SCSS**: Advanced styling with responsive design
- **RxJS**: Reactive programming for state management

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd underwriting-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Header component with user menu
│   │   ├── sidebar/         # Collapsible navigation sidebar
│   │   ├── footer/          # Footer component
│   │   └── dashboard/       # Dashboard with memo grid
│   ├── services/
│   │   └── layout.service.ts # Sidebar state management
│   ├── app.component.ts     # Main app component
│   ├── app.routes.ts        # Application routing
│   └── app.config.ts        # App configuration
├── styles.scss              # Global styles and Material theme
└── main.ts                  # Application entry point
```

## Key Features

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebar adapts to screen size
- Grid layout adjusts to different screen sizes

### State Management
- LayoutService manages sidebar collapse state
- Reactive programming with RxJS observables
- Smooth transitions and animations

### Material Design
- Consistent Material Design components
- Prebuilt indigo-pink theme
- Custom styling for enhanced UX

## Development

### Adding New Components
```bash
ng generate component components/your-component
```

### Adding New Services
```bash
ng generate service services/your-service
```

### Building for Production
```bash
ng build --configuration production
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.
