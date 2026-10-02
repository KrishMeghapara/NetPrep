# NetPrep — Modern ASP.NET Core & RESTful APIs Reference Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.4-black?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**NetPrep** is an exhaustive, open-access technical reference platform engineered for backend engineers and software architects mastering **ASP.NET Core MVC** and **RESTful Web APIs**. Built with zero paywalls, zero authentication barriers, and 100% word-for-word fidelity to production engineering standards.

---

## 🏗️ System Overview

NetPrep consolidates comprehensive theoretical concepts, production runtime blueprints, execution pipelines, and runnable code samples across **11 core units (82 in-depth topics)** into a continuous, high-performance web experience.

### Key Architectural Characteristics
* **Zero Condensation / Full Fidelity**: Every technical explanation, code comment, comparison matrix, and ASCII diagram is preserved in its entirety without AI summarization.
* **1-Page-Per-Unit Reading Architecture**: Eliminates fragmented multi-page navigation. Each unit operates as a continuous, unified document with instant scroll-spy navigation.
* **Client-Side Speed**: Engineered with React 19, Vite, and Framer Motion for sub-second page transitions, dynamic viewport reveals, and zero server-side rendering latency.

---

## 📚 Curriculum & Topic Coverage

### Part 1: ASP.NET Core MVC (5 Units • 44 Topics)
* **Unit 1: Introduction to ASP.NET Core & Middleware**
  * .NET Core vs .NET Framework architecture
  * Kestrel web server internals and reverse-proxy hosting
  * Two-phase application lifecycle (`WebApplication.CreateBuilder` & pipeline configuration)
  * Middleware mechanics (`app.Use`, `app.Run`, `app.Map`) and execution ordering
* **Unit 2: Architecture, Controllers & Actions**
  * Model-View-Controller separation of concerns
  * Action methods, parameters, and the complete `IActionResult` type hierarchy
  * Action Selectors (`[HttpGet]`, `[HttpPost]`, `[ActionName]`, `[NonAction]`)
  * Action Filters (`IActionFilter`, `OnActionExecuting`, `OnActionExecuted`)
  * Areas architecture for enterprise application partitioning
* **Unit 3: Views, Razor Syntax & Helpers**
  * Razor templating syntax (`@`, code blocks, expression rendering)
  * Strongly-typed views and ViewModel binding
  * Hierarchical layout architecture (`_Layout.cshtml`, `_ViewStart.cshtml`, `_ViewImports.cshtml`)
  * HTML Helpers vs modern Tag Helpers (`asp-for`, `asp-controller`, `asp-action`, `asp-route-*`)
* **Unit 4: Validations, Model Binding & Data Passing**
  * Parameter binding sources (`[FromQuery]`, `[FromRoute]`, `[FromBody]`, `[FromForm]`, `[FromHeader]`)
  * Data Annotations (`[Required]`, `[StringLength]`, `[Range]`, `[Compare]`)
  * Custom `ValidationAttribute` implementations and `ModelState.IsValid` checks
  * State transfer semantics: `ViewData` vs `ViewBag` vs `TempData` (Session-backed single-read)
* **Unit 5: Routing, State Management & ADO.NET**
  * Conventional routing vs Attribute routing constraints (`{id:int}`, `{guid:guid}`)
  * State management: Cookies, Session state, and In-Memory caching
  * ADO.NET architecture: `SqlConnection`, `SqlCommand`, `SqlDataReader`, `SqlDataAdapter`, and parameterized query sanitization

---

### Part 2: RESTful Web APIs (5 Units • 35 Topics)
* **Unit 1: Introduction to RESTful Web Services**
  * REST architectural constraints and Richardson Maturity Model
  * Web API vs MVC comparison matrix
  * `[ApiController]` behaviors (automatic 400 responses, model state validation, binding inferences)
  * `ControllerBase` vs `Controller`
  * HTTP Verbs (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) and status code specifications (2xx, 4xx, 5xx)
* **Unit 2: RESTful API Development in ASP.NET Core**
  * Attribute routing patterns and hierarchical API routes
  * Parameter binding sources and complex JSON deserialization
  * Complete CRUD action implementations with strict HTTP response semantics (`Ok`, `CreatedAtAction`, `NoContent`, `NotFound`, `BadRequest`)
* **Unit 3: Data Transfer Objects (DTOs) & Validation**
  * Decoupling domain entities from public API contracts
  * Defense against over-posting / mass-assignment vulnerabilities
  * Object-to-object mapping patterns
* **Unit 4: Dependency Injection & Services**
  * Inversion of Control (IoC) and dependency inversion principles
  * ASP.NET Core built-in DI container registration
  * Service lifetimes and memory management:
    * `Transient`: New instance per resolution
    * `Scoped`: Single instance per HTTP request lifecycle
    * `Singleton`: Single instance for entire application runtime
  * Captive dependencies detection and constructor injection patterns
* **Unit 5: Advanced Web API Concepts**
  * Global exception handling middleware vs Exception filters (`IExceptionFilter`, `ApiExceptionFilterAttribute`)
  * RFC 7807 `ProblemDetails` standardization for structured error payloads
  * Swagger / OpenAPI specification generation and interactive endpoint documentation

---

### Bonus: Enterprise Technical Deep-Dives (3 Topics)
* **Section b.0**: Master Syllabus Reference & Topic Index
* **Section b.1**: Architectural Deep Dive: *Why `Task` in Web API Action Methods?* (Async/await execution mechanics, thread pool starvation prevention, and non-blocking asynchronous I/O)
* **Section b.2**: Architectural Deep Dive: *Why `IActionResult` as Return Type?* (Contract flexibility, HTTP status code decoupling, and RFC conformance)

---

## ⚡ Interactive UI/UX Features

* **Interactive Middleware Pipeline Simulator**: Visual, step-by-step request flow simulation demonstrating HTTPS redirection, route matching, JWT claim validation, and authorization short-circuiting (`401 Unauthorized`).
* **ASCII & Architecture Diagram Explorer**: Monospace diagrams (MVC request flow, folder trees, Areas structure, ADO.NET pipeline) with interactive **Zoom In/Out**, **Reset (100%)**, and **Fullscreen Modal** view.
* **Developer Code Blocks**:
  * macOS terminal chrome (red/yellow/green indicators)
  * C#, JSON, CSHTML, Bash, and SQL syntax highlighting
  * Gutter line numbering
  * Word wrap toggle (`Wrap` / `Scroll`)
  * Font size zoom controls (`A-` / `A+`)
  * 1-click copy with spring checkmark animation
* **Live Scroll-Spy Table of Contents**: Real-time pulsing dot timeline indicating current reading location within each unit.
* **Zen / Focus Reading Mode**: 1-click sidebar collapse (<kbd>Z</kbd> or <kbd>Esc</kbd>) for distraction-free reading with a 72-character line length constraint.
* **Mobile Bottom Sheet Drawer**: Touch-friendly slide-up drawer for instant topic selection on smaller screens.
* **Zero Dark Mode Flicker**: Hardcoded to a warm, glare-free light palette (`#FFF8F0` surface, `#FFFFFF` cards, `#292524` charcoal text, `#F97316` coral orange accents) with dark IDE editor windows.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology |
|---|---|
| **Core Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Motion & Physics** | [Framer Motion](https://www.framer.com/motion/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Markdown Rendering** | `react-markdown` + `remark-gfm` |
| **Syntax Highlighting** | `react-syntax-highlighter` (Prism engine) |
| **Iconography** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* `npm` or `pnpm`

### Installation
```bash
# Clone the repository
git clone https://github.com/KrishMeghapara/NetPrep.git

# Navigate into the project folder
cd NetPrep

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be live at `http://localhost:5173`.

### Production Build
```bash
# Compile and bundle assets for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🚢 Deployment (Vercel / Netlify / Cloudflare Pages)

This project is a 100% self-contained static single-page application (SPA).

| Host Setting | Configuration |
|---|---|
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 👤 Author & Maintainer

**Krish Meghapara (KM)**  
* **LinkedIn**: [krishmeghapara](https://www.linkedin.com/in/krishmeghapara/)  
* **GitHub**: [@KrishMeghapara](https://github.com/KrishMeghapara)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal, educational, and commercial reference.
