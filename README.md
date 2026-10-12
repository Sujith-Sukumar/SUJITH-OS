# SUJITH OS (v2.0) — Personal Developer Operating System Portfolio

An award-winning, interactive desktop operating system experience built from scratch in **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Zustand** for **Sujith K (Full Stack Developer)**.

Instead of a generic single-page portfolio, **SUJITH OS** invites recruiters and developers into a full-featured personal desktop environment showcasing architecture, code depth, and UI/UX craftsmanship.

---

## ⚡ Key Highlights & Features

- **Futuristic Boot Sequence**:
  - Sequential hardware & subsystem initialization checks (`✓ React`, `✓ TypeScript`, `✓ Node.js`, `✓ MongoDB`, `✓ Projects`, `✓ Experience`, `✓ Portfolio`).
  - Enter OS button + Keyboard `Enter` trigger + `[Skip]` option.
  - Native Web Audio API boot chime.

- **Window Management System**:
  - Drag, Minimize, Maximize / Restore, and Close.
  - Z-Index orchestration & active window focus stack.
  - Cascaded window placement with fluid physics animations.
  - Auto-responsive behavior.

- **Desktop & Custom Wallpaper**:
  - Interactive abstract network node graph canvas.
  - 4 customizable wallpapers: *Abstract (Mesh)*, *Cosmic Grid*, *Aurora Gradient*, *Minimal Slate*.
  - Desktop icons with hover glow, tooltips, single-click selection, double-click launch, and keyboard navigation.

- **Right-Click Context Menu**:
  - Right-click anywhere on the desktop to Refresh, launch Terminal, open Projects, cycle wallpapers, toggle synthesized audio, and open Settings.

- **Start Menu & Search Bar**:
  - Quick launcher with live fuzzy search filtering.
  - User identity badge & reboot trigger.

- **File Explorer (Projects Application)**:
  - Directory folder tree (`Full Stack (MERN)`, `Frontend Systems`).
  - Detailed metadata inspector drawer.
  - Double-click to open dedicated project specification windows for:
    1. **Matrimony Platform** (Socket.io real-time chat, AWS S3 direct uploads, Razorpay payments, matching engine).
    2. **Learning Management System (LMS)** (Video streaming, RBAC roles, course curriculum builder, student enrollment).
    3. **OLX Clone** (Item listings, dynamic filters, Cloudinary image pipeline).
    4. **SUJITH OS Portfolio** (Architecture, Zustand state engine, GPU transforms).

- **System Diagnostics & Telemetry (Skills)**:
  - Monospaced ASCII telemetry meters (`████████████████████`).
  - Category filtration: Frontend, Backend, Database, Cloud & Tools, Dev Methodologies.
  - Relative capability indices without misleading percentage claims.

- **Interactive Shell CLI (Terminal)**:
  - Custom prompt: `sujith@portfolio:~$`.
  - Built-in commands: `help`, `about`, `skills`, `projects`, `experience`, `contact`, `resume`, `whoami`, `neofetch`, `theme <color>`, `clear`, `ls`, `date`, `sudo`.
  - Command history navigation (`Up` / `Down` arrows) & `Tab` key autocomplete!

- **PDF Document Viewer (Resume)**:
  - Document toolbar with Zoom In / Out / Reset, Print, and direct `[VIEW RESUME]` and `[DOWNLOAD RESUME]` buttons.
  - Clean preview layout with clear config path instructions.

- **Encrypted Comms Dispatcher (Contact)**:
  - Form validation with interactive simulated dispatch sequence and confetti burst.
  - Official coordinates for GitHub, LinkedIn, and Email.

- **System Preferences (Settings)**:
  - Appearance: Dark Futurism / Light mode.
  - 6 Accent Colors: Cyan, Blue, Purple, Green (Emerald), Amber, Rose.
  - Animation toggles (Full 60fps / Reduced motion).
  - Web Audio synthesis toggle.
  - All preferences persisted in `localStorage`.

- **Adaptive Mobile Mode**:
  - Transforms into an app launcher with fullscreen touch views, mobile status bar, and bottom navigation dock. Zero awkward window dragging on small screens.

- **Global Keyboard Shortcuts**:
  - `Enter`: Open selected desktop icon
  - `Esc`: Close open menus / modals
  - `Ctrl + K`: Open Start Menu search
  - `Ctrl + Shift + T`: Open Terminal
  - `Alt + Tab`: Cycle through open windows

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Audio Engine**: Native Browser Web Audio API (Synthesized oscillators — zero external MP3s needed)
- **Icons**: Lucide React + custom inline SVGs

---

## 🚀 How to Run Locally

1. **Navigate to the project folder**:
   ```bash
   cd sujith-os
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled bundle will be in `dist/`.

---

## 📂 Configuration & Data Customization

All personal details, URLs, and project specifications are centralized in clean data files so you never have to hunt through components:

| File | What to Customize |
|---|---|
| `src/data/portfolioData.ts` | Email, GitHub URL, LinkedIn URL, resume PDF path, personal bio, location |
| `src/data/projects.ts` | Add/edit projects, GitHub links, live demo URLs, architecture highlights |
| `src/data/skills.ts` | Add/adjust skills, diagnostic meters, category groups |
| `src/data/experience.ts` | Add/edit experience timeline logs, roles, and tech stacks |
| `public/resume.pdf` | Replace with your actual resume PDF document |

---

## 📄 License

MIT © Sujith K
