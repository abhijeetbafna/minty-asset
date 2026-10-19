# UI/UX & Design System Directive for AI Coding Agents

This document defines mandatory UI/UX standards, typography systems, layout rules, core UX laws, anti-slop skills, and approved component/icon libraries for both **Web** and **Mobile** applications.

---

## 1. Core Visual & Spatial Design System Rules

### 1.1 Contrast & Accessibility
* **Contrast Threshold:** Enforce a contrast ratio of at least **4.5:1** for body text and critical UI elements (WCAG AA standard).
* **Sunlight & Ambient Legibility:** Avoid ultra-light gray text (`#9CA3AF` or lower contrast). Light grays disappear in sunlight and impair readability for low-vision users.
* **Non-Color Indicators:** Never rely solely on color to convey state (e.g., pair red error text with explicit icons or clear text labels).

### 1.2 Typography System
* **Strict Style Limits:** Limit each application interface to **3 to 5 font sizes** and a maximum of **2 font weights** (e.g., Regular `400` and Semi-Bold `600`).
* **Scale Consistency:** A small, repeated set of typographic scales creates a calm, structured visual hierarchy across screens.

### 1.3 Spacing Grid System (8pt Base Unit)
* **Base Spatial Unit:** Use a **4px** or **8px** base grid unit exclusively.
* **Approved Spatial Steps:** Limit all margins, paddings, and gap distances strictly to multiples of the base unit: **4px, 8px, 16px, 24px, 32px, 48px, 64px**.
* **Spatial Rhythm:** Consistent spatial increments group related elements visually and establish clear layout hierarchy.

### 1.4 Button Hierarchy & Call-To-Action (CTA) Focus
* **Single Primary Action:** Enforce **one primary button** per screen view/viewport context.
* **Secondary & Tertiary Quietness:** Render all alternative actions as secondary (bordered/ghost) or tertiary (text-only/quiet) buttons.
* **Visual De-cluttering:** Avoid competing high-contrast buttons on a single view to prevent cognitive overload.

### 1.5 Visual Communication Beyond the Screen
* **Contextual Graphics:** Utilize product visuals, clean illustrative assets, and structured data visualizations to communicate value and system state beyond plain body text.

---

## 2. Platform-Specific Design Guidelines

### 2.1 Mobile Application Rules (iOS & Android)
* **Touch Target Sizing:**
  - **Minimum Size:** All interactive touch targets (buttons, icon triggers, list items, input fields) must be at least **44pt × 44pt** (iOS Human Interface Guidelines) or **48dp × 48dp** (Material Design).
  - **Touch Padding:** Increase interactive bounding boxes around small icons using transparent padding so fingers can trigger controls easily.
* **Thumb Zone Layout:** Position key actions, primary CTAs, and main navigation (bottom tab bars) within natural thumb reach.
* **Native Gestures:** Respect platform-native gesture patterns (e.g., swipe-to-dismiss, edge swipe back).

### 2.2 Web Application Rules (Desktop & Responsive)
* **Cursor States & Hover Feedback:** Provide clear, immediate visual states (`hover`, `focus-visible`, `active`) on all interactive web components.
* **Keyboard Navigation:** Ensure full keyboard focusability (`tabindex`, visible custom focus rings) across all forms, buttons, and modal dialogs.
* **Density & Layout Scaling:** Adapt desktop layouts dynamically across breakpoint bounds (`sm`, `md`, `lg`, `xl`, `2xl`), adjusting multi-column layouts into single-column flows on mobile web viewports.

---

## 3. Fundamental Laws of UX

1. **Fitts’s Law:** The time to acquire a target is a function of the distance to and size of the target.
   - *Execution:* Make primary action targets large and position them close to expected user interaction areas.
2. **Hick’s Law:** The time it takes to make a decision increases with the number and complexity of choices.
   - *Execution:* Reduce choices on critical flows. Break complex tasks into progressive multi-step flows.
3. **Jakob’s Law:** Users spend most of their time on other apps. They prefer your app to work the same way as all the other apps they already know.
   - *Execution:* Use predictable navigation patterns, standard control symbols, and familiar interaction loops.
4. **Law of Proximity:** Objects that are near, or proximate to each other, tend to be grouped together.
   - *Execution:* Use spacing steps (e.g., `8px` inner element gap vs. `24px` section gap) to establish relationships clearly.
5. **Von Restorff Effect (Isolation Effect):** When multiple similar objects are present, the one that differs from the rest is most likely to be remembered.
   - *Execution:* Apply distinct accent colors or elevated styling selectively to high-value actions (e.g., primary sign-up, upgrade triggers).

---

## 4. AI Agent Design Skills & Execution Workflows

Maintain high design standards, eliminate generic AI design artifacts ("slop"), and integrate refined UI aesthetics using these agent skills:

### Skill Add Commands
```bash
# Add Hallmark design skill
npx skills add nutlope/hallmark

# Add Taste / Anti-Slop skill
npx skills add Leonxlnx/taste-skill
```

### Reference Repositories
* **Anti-Slop Design Reference:** [anti-slop GitHub Repository](https://github.com/miqdadbadjuber/anti-slop.git)

---

## 5. Approved Icon & UI Component Libraries

### 5.1 Icon Libraries
Select clean, cohesive icon sets matching project requirements:
* **Reicon:** `https://github.com/dqev/reicon.git`
* **Iconoir:** `https://github.com/iconoir-icons/iconoir.git`
* **Heroicons:** `https://github.com/tailwindlabs/heroicons.git`
* **Ionicons:** `https://github.com/ionic-team/ionicons.git`
* **Font-Awesome:** `https://github.com/FortAwesome/Font-Awesome.git`
* **Boxicons:** `https://github.com/box-icons/boxicons.git`
* **UIcons:** `https://github.com/UIcons/UIcons.git`
* **Majesticons:** `https://github.com/halfmage/majesticons.git`
* **Phosphor Icons:** `https://github.com/phosphor-icons/homepage.git`

### 5.2 UI Component Frameworks & Libraries
Utilize these component ecosystems for building web and mobile application UIs:
* **Shadcn UI:** `https://github.com/shadcn-ui/ui.git`
* **Radix UI Themes:** `https://github.com/radix-ui/themes.git`
* **HeroUI:** `https://github.com/heroui-inc/heroui.git`
* **PrimeReact:** `npm install primereact`
* **Watermelon Platform:** `https://github.com/WatermelonCorp/watermelon-platform.git`
* **Uiverse Galaxy:** `https://github.com/uiverse-io/galaxy.git`
* **Arc Library:** `https://github.com/kuratlielia/arc-library.git`