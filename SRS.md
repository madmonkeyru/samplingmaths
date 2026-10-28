\# Software Requirements Specification (SRS)

\*\*Project:\*\* MEP‑EA‑01 – High‑Fidelity Mathematics Test Simulator    
\*\*Version:\*\* 1.0    
\*\*Date:\*\* 2026‑01‑26    
\*\*Status:\*\* Final Draft (Replaces all previous drafting documentation)

\---

\#\# 1\. Introduction

\#\#\# 1.1 Purpose  
This document specifies the requirements for \*\*MEP‑EA‑01\*\*, a high‑fidelity prototype that simulates the experience of completing the Costa Rican \*Bachillerato por Madurez Suficiente\* Mathematics test (convocatoria 02‑2026). The system provides both \*\*simulation tests\*\* (full 60‑item timed exams) and \*\*modular practice\*\* (topic‑ or area‑specific sessions), with rich interactive visualisations and performance feedback. This SRS replaces all previous drafting documentation and serves as the single authoritative reference for design, development, and validation.

\#\#\# 1.2 Scope  
The product will be a web‑based application (desktop and tablet first) that:  
\- Delivers the full 60‑item multiple‑choice mathematics test under timed conditions.  
\- Offers selective practice by area (Geometry, Functions, Statistics) or by specific topic.  
\- Renders high‑fidelity question visuals (2D/3D geometry, function graphs, statistical charts, Venn diagrams, etc.) dynamically from the underlying question data.  
\- Provides immediate scoring, answer review with step‑by‑step solutions, and longitudinal performance tracking.  
\- Supports user accounts to persist progress and display performance trends.

\*\*Out of scope:\*\* Real‑time proctoring, question authoring tools (content is pre‑loaded), native mobile apps (responsive web is sufficient for the prototype), and integration with external LMS platforms.

\#\#\# 1.3 Definitions, Acronyms, and Abbreviations  
\| Term \| Definition \|  
\|------\|------------\|  
\| \*\*BXM\*\* \| \*Bachillerato por Madurez\* – the Costa Rican maturity certificate exam. \|  
\| \*\*MEP\*\* \| \*Ministerio de Educación Pública\* (Costa Rica). \|  
\| \*\*DGEC\*\* \| \*Dirección de Gestión y Evaluación de la Calidad\* – the office that publishes the exam specifications. \|  
\| \*\*Item\*\* \| A single multiple‑choice question (A, B, C, D). \|  
\| \*\*Area\*\* \| One of the three content domains: Geometry, Functions (Relaciones y Álgebra), Statistics & Probability. \|  
\| \*\*Simulation\*\* \| A full timed test of 60 items. \|  
\| \*\*Practice\*\* \| A user‑configured session limited by area, topic, or number of items. \|  
\| \*\*SRS\*\* \| Software Requirements Specification (this document). \|

\#\#\# 1.4 References  
\- \*Práctica de Matemáticas para la prueba de Bachillerato por Madurez Suficiente\* (convocatoria 02‑2026) – sample items and solucionario.  
\- \*Tabla de especificaciones MATEMÁTICAS – Bachillerato por Madurez Suficiente, convocatoria 02‑2026\*.  
\- \*General Project Ideas.md\* – visual/interaction component ideas.  
\- IEEE 29148‑2018 – standard for requirements engineering.

\---

\#\# 2\. Overall Description

\#\#\# 2.1 Product Perspective  
MEP‑EA‑01 is a standalone, browser‑based learning tool. It replicates the structure and timing of the official BXM Mathematics test while providing interactive visual aids and feedback not available in a paper exam. The system is intended for individual self‑study and formative assessment.

\#\#\# 2.2 Product Functions (High‑Level)  
1\. \*\*User management\*\* – registration, login, profile, progress persistence.  
2\. \*\*Test simulation\*\* – 60‑item timed exam with the official distribution of areas/topics.  
3\. \*\*Modular practice\*\* – user selects area, topic, or number of items; optional timer.  
4\. \*\*Dynamic question rendering\*\* – text, images, equations (LaTeX), 2D/3D graphics, charts.  
5\. \*\*Answer capture and scoring\*\* – single‑choice selection, automatic scoring on submission.  
6\. \*\*Results & review\*\* – score, correct/incorrect breakdown, expandable step‑by‑step solutions, option to retry.  
7\. \*\*Performance analytics\*\* – historical attempts, performance graph with colour gradient (green to red), first‑time user encouragement message.  
8\. \*\*Navigation & progress\*\* – progress bar, question position indicator (not fixed numbering), ability to flag/review before submission.

\#\#\# 2.3 User Characteristics  
\- \*\*Students\*\* preparing for the BXM Mathematics exam.  
\- \*\*Teachers/tutors\*\* who may use the tool for demonstration or assign practice.  
\- Users are assumed to have basic computer literacy and internet access.  
\- Spanish language interface (es‑CR).

\#\#\# 2.4 Constraints  
\- The question pool is fixed and based on the provided practice and specification documents.  
\- Timer behaviour must mirror the official exam (duration to be confirmed; prototype may use a configurable default, e.g., 2 hours 30 minutes).  
\- Visual rendering must be accurate to the official specifications table (areas, topics, item types).  
\- Use 3.14 for π, 2.72 for e, and 4‑decimal trigonometric values as per exam instructions.  
\- All calculations (variance, standard deviation) use population formulas.  
\- Must run on modern browsers (Chrome, Edge, Firefox, Safari) without plugins.

\#\#\# 2.5 Assumptions and Dependencies  
\- Content (questions, images, solutions) is provided in structured digital format (JSON/CSV) by the content team.  
\- The prototype will use a lightweight backend (e.g., Firebase, Supabase, or Node/Express) for user data and question serving.  
\- No external authentication (e.g., Google) is required for the prototype; email/password is sufficient.

\---

\#\# 3\. Specific Requirements

\#\#\# 3.1 Functional Requirements

\#\#\#\# 3.1.1 User Management  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑U‑01 \| The system shall allow users to create an account with email and password. \|  
\| FR‑U‑02 \| The system shall allow users to log in and log out. \|  
\| FR‑U‑03 \| The system shall persist user progress and attempt history across sessions. \|  
\| FR‑U‑04 \| The system shall display a first‑time user message on the results page: “Keep practising and we’ll tell you how you’re doing.” \|

\#\#\#\# 3.1.2 Welcome / Landing Page  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑W‑01 \| The landing page shall present three main options: \*\*Simulation Test\*\*, \*\*Practice by Area\*\*, \*\*Practice by Topic\*\*. \|  
\| FR‑W‑02 \| The user shall be able to view past attempts and performance trends from the landing page. \|  
\| FR‑W‑03 \| The landing page shall display a subtle green‑to‑red performance indicator based on past attempts (for returning users). \|

\#\#\#\# 3.1.3 Simulation Test  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑S‑01 \| The simulation shall consist of exactly 60 multiple‑choice items (A, B, C, D). \|  
\| FR‑S‑02 \| The distribution of items shall match the official specification table (Geometry: 18 items, Functions: 24 items, Statistics: 18 items – exact counts to be derived from the table). \|  
\| FR‑S‑03 \| The simulation shall be timed. The timer shall be visible and count down; when time expires, the test auto‑submits. \|  
\| FR‑S‑04 \| The order of items shall follow the official module order (Geometry → Functions → Statistics) and within each area, topics shall be grouped as per the specification table. \|  
\| FR‑S‑05 \| Some items will include supporting images; others will not. The system shall render images or graphics as required by each item. \|  
\| FR‑S‑06 \| Some items will be grouped (share a common context/image). The system shall display shared context once and present the grouped items sequentially. \|  
\| FR‑S‑07 \| The user shall be able to navigate between questions (previous/next) and jump to a specific question via a question navigator. \|  
\| FR‑S‑08 \| The user shall be able to flag questions for review and see flagged status in the navigator. \|  
\| FR‑S‑09 \| A progress bar shall show the proportion of questions answered. \|  
\| FR‑S‑10 \| The question position indicator shall show “Question X of 60” without revealing the fixed item number from the original pool (to allow variation in future pools). \|

\#\#\#\# 3.1.4 Modular / Selective Practice  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑P‑01 \| The user shall be able to select practice by \*\*Area\*\* (Geometry, Functions, Statistics) or by \*\*Topic\*\* (e.g., Circunferencia, Polígonos, Funciones lineales, Probabilidad, etc.). \|  
\| FR‑P‑02 \| The user shall be able to choose the number of items for practice (e.g., 5, 10, 20, or all available for the selected scope). \|  
\| FR‑P‑03 \| The user shall be able to enable or disable a timer for practice sessions and set the duration. \|  
\| FR‑P‑04 \| The practice session shall draw items from the question pool relevant to the selected scope. \|  
\| FR‑P‑05 \| Practice sessions shall follow the same rendering, navigation, and submission rules as the simulation (except for item count and timer configurability). \|

\#\#\#\# 3.1.5 Question Rendering  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑Q‑01 \| The system shall render text, LaTeX mathematical expressions, and images. \|  
\| FR‑Q‑02 \| The system shall render interactive 2D Cartesian coordinate systems with axes, grids, points, labels, dashed projection lines, circles, lines, polygons, and custom curves. \|  
\| FR‑Q‑03 \| The system shall render 3D spatial geometry visualisations (spheres, cylinders) with cross‑section planes and metric dimension overlays. \|  
\| FR‑Q‑04 \| The system shall render transformation overlays (symmetry axes, translation arrows, rotation centres, multi‑state polygons). \|  
\| FR‑Q‑05 \| The system shall render function graphs (linear, quadratic, square root, exponential, logarithmic, piecewise) with vertex points, intercepts, axis of symmetry, and multiple‑choice multi‑view grids. \|  
\| FR‑Q‑06 \| The system shall render statistical components: frequency tables, weighted tables, contingency tables, box plots, distribution curves, Venn diagrams, and probability matrices. \|  
\| FR‑Q‑07 \| All graphics shall be rendered dynamically from structured data (JSON) and shall be scalable without loss of quality (SVG/Canvas). \|  
\| FR‑Q‑08 \| The system shall provide interactive tools for exploration: parameter sliders, coordinate inspector (hover/click), layer toggles, and step‑by‑step animation player (for transformations and function transformations). \|

\#\#\#\# 3.1.6 Answer Capture and Scoring  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑A‑01 \| The user shall select exactly one option (A, B, C, or D) per item. \|  
\| FR‑A‑02 \| The system shall automatically score the test/practice upon submission. \|  
\| FR‑A‑03 \| Scoring shall use the official solucionario provided with the practice. \|  
\| FR‑A‑04 \| The system shall display the total score as a percentage and as a count of correct/incorrect items. \|

\#\#\#\# 3.1.7 Results and Review  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑R‑01 \| After submission, the user shall see a results summary: score, correct/incorrect counts, and time taken. \|  
\| FR‑R‑02 \| The user shall be able to review each item, see their answer, the correct answer, and an expandable step‑by‑step solution. \|  
\| FR‑R‑03 \| The user shall be able to retry the same test/practice or start a new one. \|  
\| FR‑R‑04 \| The user shall be able to return to the welcome page from the results page. \|  
\| FR‑R‑05 \| The results page shall display a performance graph based on past attempts (for users with ≥2 attempts). \|  
\| FR‑R‑06 \| For first‑time users, the results page shall display the message: “Keep practising and we’ll tell you how you’re doing.” \|

\#\#\#\# 3.1.8 Performance Analytics  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑AN‑01 \| The system shall store every attempt with metadata: date, mode (simulation/practice), scope, score, time taken, and item‑level responses. \|  
\| FR‑AN‑02 \| The system shall display a trend graph (line or bar) of scores over time. \|  
\| FR‑AN‑03 \| The system shall compute and display a subtle colour indicator (green‑to‑red gradient) representing the user’s current performance level based on recent attempts. \|  
\| FR‑AN‑04 \| The system shall allow the user to filter analytics by area or topic. \|

\#\#\#\# 3.1.9 Content Management (Internal)  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| FR‑C‑01 \| The system shall load question data from a structured JSON file that includes: item ID, area, topic, stem (text/LaTeX), options, correct answer, solution, visualisation specification (type, parameters), and grouping information. \|  
\| FR‑C‑02 \| The visualisation specification shall be sufficiently detailed to render the required graphic without hard‑coding each item. \|

\#\#\# 3.2 External Interface Requirements

\| Interface \| Description \|  
\|-----------\|-------------\|  
\| \*\*User Interface\*\* \| Responsive web UI in Spanish (es‑CR). Clean, exam‑like layout with accessible contrast. Timer always visible. Question navigator sidebar. \|  
\| \*\*Hardware Interfaces\*\* \| None specific; standard input devices (mouse, keyboard, touch). \|  
\| \*\*Software Interfaces\*\* \| Modern web browser; backend REST API (JSON over HTTPS) for user data and content; local storage or IndexedDB for offline caching (optional). \|  
\| \*\*Communication Interfaces\*\* \| HTTPS for all client‑server communication. \|

\#\#\# 3.3 Non‑Functional Requirements

\#\#\#\# 3.3.1 Performance  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| NFR‑P‑01 \| The system shall load the welcome page within 2 seconds on a standard broadband connection. \|  
\| NFR‑P‑02 \| Question rendering (including graphics) shall complete within 1 second per item. \|  
\| NFR‑P‑03 \| Timer accuracy shall be ±1 second over a 3‑hour period. \|  
\| NFR‑P‑04 \| The system shall support at least 100 concurrent users without degradation. \|

\#\#\#\# 3.3.2 Reliability  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| NFR‑R‑01 \| The system shall auto‑save answers locally (e.g., every 10 seconds) to prevent data loss on connection interruption. \|  
\| NFR‑R‑02 \| Upon reconnection, the system shall restore the session state. \|  
\| NFR‑R‑03 \| The system shall have 99.5% uptime during pilot usage. \|

\#\#\#\# 3.3.3 Usability  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| NFR‑U‑01 \| The interface shall be usable by students with basic computer skills without prior training. \|  
\| NFR‑U‑02 \| All interactive visualisations shall include tooltips or legends explaining their controls. \|  
\| NFR‑U‑03 \| The system shall comply with WCAG 2.1 AA accessibility guidelines (colour contrast, keyboard navigation, screen‑reader labels for graphs). \|

\#\#\#\# 3.3.4 Security  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| NFR‑S‑01 \| User passwords shall be hashed using bcrypt (or equivalent). \|  
\| NFR‑S‑02 \| All user data shall be transmitted over HTTPS. \|  
\| NFR‑S‑03 \| The system shall prevent unauthorised access to other users’ attempt data. \|

\#\#\#\# 3.3.5 Maintainability  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| NFR‑M‑01 \| The question bank shall be versioned and stored separately from application code. \|  
\| NFR‑M‑02 \| Visualisation components shall be modular and reusable across items. \|  
\| NFR‑M‑03 \| The system shall log errors and render failures for debugging. \|

\#\#\#\# 3.3.6 Portability  
\| ID \| Requirement \|  
\|----\|-------------\|  
\| NFR‑PO‑01 \| The frontend shall support the latest two versions of Chrome, Edge, Firefox, and Safari. \|  
\| NFR‑PO‑02 \| The backend shall be deployable on any cloud provider supporting Docker. \|

\#\#\# 3.4 Design and Implementation Constraints  
\- \*\*Language:\*\* Spanish (es‑CR) for all UI text and content.  
\- \*\*Content fidelity:\*\* The 60 practice items and solucionario provided in the reference PDF must be used as the initial question pool.  
\- \*\*Specification alignment:\*\* The distribution of items, topics, and evidence statements must match the \*Tabla de especificaciones\*.  
\- \*\*Approximations:\*\* Use π \= 3.14, e \= 2.72, trigonometric values to 4 decimals as instructed in the practice document.  
\- \*\*Statistical formulas:\*\* Use population variance and standard deviation.  
\- \*\*Graphics:\*\* Vector‑based (SVG/Canvas) for scalability; 3D visualisations may use WebGL if necessary but must degrade gracefully.

\---

\#\# 4\. System Architecture (Preliminary)

\- \*\*Frontend:\*\* React (or Vue) SPA with a component library for visualisations (D3.js for 2D charts, Three.js for 3D, KaTeX for LaTeX, custom SVG components).  
\- \*\*Backend:\*\* Node.js/Express or similar REST API.  
\- \*\*Database:\*\* PostgreSQL (or SQLite for prototype) for user data and attempts; question bank stored as JSON files served statically.  
\- \*\*Hosting:\*\* Cloud‑based (e.g., Vercel/Netlify for frontend, Render/Railway for backend).

\---

\#\# 5\. Verification and Validation

\- \*\*Content validation:\*\* Each of the 60 items must be reviewed against the official solucionario and specification table.  
\- \*\*Visual accuracy:\*\* Visual components shall be inspected by a subject‑matter expert for correctness (e.g., circle equations, function graphs, 3D cross‑sections).  
\- \*\*Usability testing:\*\* At least 5 students will complete a simulation and provide feedback.  
\- \*\*Performance testing:\*\* Load testing with 100 simulated concurrent users.  
\- \*\*Security review:\*\* Basic penetration test on authentication and data access.

\---

\#\# 6\. Appendices

\#\#\# Appendix A – Question Distribution (derived from the specification table)  
\| Area \| Topics \| Approx. items \|  
\|------\|--------\|---------------\|  
\| Geometry \| Analytic geometry (circle, line), polygons, spatial geometry (sphere/cylinder), symmetry, transformations \| 18 \|  
\| Functions & Algebra \| Functions (linear, quadratic, inverse, exponential, logarithmic), systems of equations, models \| 24 \|  
\| Statistics & Probability \| Position measures, variability, probability, Venn diagrams, conditional probability \| 18 \|  
\| \*\*Total\*\* \| \| \*\*60\*\* \|

\*(Exact counts will be refined based on the official item‑by‑item mapping in the specification table.)\*

\#\#\# Appendix B – Visualisation Components Priority  
1\. 2D Cartesian plane (circles, lines, polygons, points, labels) – \*highest priority\*  
2\. Function plotter (linear, quadratic, piecewise) – \*high\*  
3\. Statistical charts (box plots, distribution curves, Venn diagrams) – \*high\*  
4\. 3D solids (sphere, cylinder with cross‑sections) – \*medium\*  
5\. Transformation animations – \*medium\*  
6\. Interactive parameter sliders and inspectors – \*low‑medium (for learning mode)\*

\---

\*\*End of SRS\*\*    
\*This document supersedes all previous drafting documentation for MEP‑EA‑01.\*  
