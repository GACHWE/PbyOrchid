# Plugged by Orchid — README

> **A modern, responsive e‑commerce storefront for exclusive streetwear and sneaker drops.**
> Built for speed, style, and seamless user experience across all devices.

---

## 📌 Project Overview

**Plugged by Orchid** is a React‑based e‑commerce frontend designed for a streetwear and sneaker brand targeting the Kenyan market (prices in **Ksh**). The platform showcases **featured product drops** with a live **countdown timer**, dynamic **discount badges**, and a fully responsive layout that adapts to mobile, tablet, and desktop screens.

The project emphasizes:
- **High‑energy visual design** – animated gradients, floating product images, neon glows.
- **Real‑time urgency** – countdown timers and progress bars for limited‑time offers.
- **Modular component architecture** – reusable UI blocks (`CountdownTimer`, `HeroSection`, `StatItem`).
- **Graceful degradation** – skeleton loaders, fallback states for missing data.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Featured Product Hero** | Dynamically fetches the latest featured product from the backend and displays it with a floating animation, discount badge, and countdown card. |
| **Live Countdown Timer** | Shows days, hours, minutes, and seconds until an offer expires. Supports permanent features, expired states, and a progress bar. |
| **Responsive Layout** | Mobile‑first design: the countdown card stacks below the product image on small screens and floats alongside it on desktops. |
| **Animated Background** | Soft, pulsing blobs create depth and movement without distracting from content. |
| **Skeleton Loading** | A spinner is shown while fetching featured product data, preventing layout shifts. |
| **Fallback UI** | If no featured product exists, a friendly placeholder (“No featured product at the moment”) is displayed. |
| **Accessibility‑conscious** | Semantic HTML, keyboard‑friendly interactive elements, and sufficient color contrast in light/dark modes. |

---

## 🛠 Tech Stack

- **Framework**: React (v18+)
- **Routing**: `react-router-dom`
- **Animation**: `motion/react` (Framer Motion)
- **Icons**: `lucide-react`
- **Styling**: Tailwind CSS (utility classes, custom theme tokens like `text-app-text-muted`, `bg-primary-accent`)
- **State Management**: Local component state (`useState`, `useEffect`, `useMemo`, `useRef`)
- **API Communication**: Fetch via `getFeaturedProducts` (Spring Page response)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation
```bash
git clone https://github.com/GACHWE/plugged-by-orchid.git
cd plugged-by-orchid
npm install
```

### Environment Variables
Create a `.env` file in the root with the following (example):
```env
REACT_APP_API_BASE_URL=https://api.pluggedbyorchid.com
```
> Adjust the variable name to match your project’s setup (e.g., `VITE_` prefix for Vite).

### Running Locally
```bash
npm start   # or npm run dev
```
The app will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```
The output will be in the `build/` (or `dist/`) folder.

---

## 📁 Project Structure (relevant)

```
src/
├── components/
│   ├── CountdownTimer.jsx      # Reusable countdown component
│   ├── HeroSection.jsx         # Main hero with featured product
│   └── ...
├── api/
│   └── products.js             # getFeaturedProducts fetch wrapper
├── App.jsx
└── index.jsx
```

---

## 🧩 Component Documentation

### `CountdownTimer`
**Props**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `targetDate` | `string` (ISO) | – | The date/time the offer ends. |
| `label` | `string` | `"Ends in"` | Text shown above the timer. |
| `showProgress` | `boolean` | `false` | If `true`, renders a progress bar representing elapsed time. |

**Behaviour**
- If `targetDate` is missing or invalid → renders **“✨ Permanent Feature”**.
- If the target date has passed → renders **“⏰ Offer Ended”** with a pulsing animation.
- Otherwise displays **days, hours, minutes, seconds** in a responsive grid.
- A progress bar is shown only when `showProgress` is `true` and the total duration is known (captured on mount).

**Responsive Adjustments**
- Font sizes scale from `text-3xl` (mobile) to `text-5xl` (desktop).
- Separators shrink and gaps reduce on smaller screens.

---

### `HeroSection`
**Purpose**
- Fetches the most recent featured product from the backend.
- Renders a two‑column layout: text/branding on the left, product showcase + countdown card on the right.
- On mobile, the countdown card moves **below** the product image for readability.
- Displays a discount badge if `originalPrice > price`.
- Handles empty/error states with a fallback message.

**Sub‑components**
- `StatItem` – small metric (e.g., “30+ Premium Brands”).
- `TimeUnit` / `Separator` – internal to `CountdownTimer`.

---

## 🔌 API Integration

The project expects a `getFeaturedProducts(page, size)` function that returns a **Spring Page** object:

```json
{
  "content": [
    {
      "id": 1,
      "name": "Air Max 97",
      "price": 4500,
      "originalPrice": 6000,
      "featuredUntil": "2026-05-01T23:59:59",
      "resources": [{ "url": "https://cdn.example.com/img.jpg" }]
    }
  ],
  "totalElements": 1
}
```

The component picks `response.content[0]` as the featured product. If no items exist, `featuredProduct` remains `null` and the fallback UI is shown.

> **Note**: Ensure the `featuredUntil` field is a valid ISO string. The `CountdownTimer` gracefully handles missing or invalid dates.

---

## 📱 Responsive Design Breakpoints

| Breakpoint | Layout behaviour |
|------------|------------------|
| **< 640px** (mobile) | Hero becomes single column. Countdown card stacks under the product image. Timer digits shrink. Discount badge scales down. |
| **640px – 1024px** (tablet) | Two‑column layout begins. Product image rotates slightly. Countdown card starts to float. |
| **≥ 1024px** (desktop) | Full two‑column hero with absolute‑positioned countdown card. Large gradient typography and generous spacing. |

---

## 🎨 Theming & Customisation

- **Tailwind tokens** used: `primary-accent`, `secondary-accent`, `tertiary-accent`, `app-text-muted`, `app-card`, `app-border`.
- **Dark mode**: The code includes `dark:` variants for the permanent‑feature and expired states.
- **Gradients**: `bg-gradient-to-r from-violet-300 via-violet-600 to-orange-300` – adjust the color stops to match your brand palette.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request.

Please ensure all new components are responsive and follow the existing Tailwind conventions.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- Built with **React**, **Tailwind CSS**, **Framer Motion**, and **Lucide Icons**.
- Inspired by the vibrant streetwear culture of Nairobi and the global sneaker community.
- Special thanks to the Orchid team for the design direction.

---

> **Plugged by Orchid** – *Step into the vibe.*
