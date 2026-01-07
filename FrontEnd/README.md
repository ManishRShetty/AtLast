# AtLast / Netrunner Command Center

> **Status**: Active Development
> **Version**: 0.1.0

An immersive hacking simulation interface built with modern web technologies, designed to provide a premium, "Apple-like Dark Mode" aesthetic mixed with high-stakes cyberpunk interactions.

## ⚡ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Motion-black?style=for-the-badge&logo=framer)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet)
![Lucide React](https://img.shields.io/badge/Lucide_React-Icons-F56565?style=for-the-badge&logo=lucide)

## 🚀 Features

### core / Hacking Simulation
- **Immersive Intro Sequence**: Cinematic entry into the command center (`/intro`).
- **Breach Protocol**: Interactive hacking mechanics (`/breach`) with dynamic success/fail states.
- **Geospatial Tracking**: Integrated real-time map visualizations using Leaflet.
- **Seamless Handoff**: Dedicated workflows for user state transition (`/handoff`).

### UI / UX
- **Premium Dark Mode**: "Apple-like" deep blacks and glassmorphism effects.
- **Fluid Animations**: High-performance transitions powered by Framer Motion.
- **Responsive Design**: Mobile-first architecture ensuring distinct experiences across devices.

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- **`/app`**: Next.js App Router structure.
  - **`breach`**: Main hacking game logic.
  - **`intro`**: Application entry sequence.
  - **`handoff`**: State transition interface.
  - **`play`**: Gameplay loop components.
- **`/components`**: Reusable UI components (buttons, cards, map widgets).
- **`/public`**: Static assets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.