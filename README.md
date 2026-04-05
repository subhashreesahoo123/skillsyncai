# SkillSync AI

This is a Next.js starter project for **SkillSync AI**, an intelligent platform that helps users create job-specific, ATS-optimized resumes using the power of Large Language Models.

To get started, take a look at `src/app/page.tsx`.

## Technology Stack

This project is built with a modern, scalable, and secure tech stack. Here’s a step-by-step breakdown of the technologies and APIs used:

### 1. Frontend Framework

-   **Next.js & React:** The core of our application is built with Next.js, a powerful React framework that enables server-side rendering, static site generation, and a seamless developer experience. We use the App Router for modern, flexible routing.
-   **TypeScript:** We use TypeScript for static typing, which helps catch errors early and improves code quality and maintainability.

### 2. User Interface (UI)

-   **Tailwind CSS:** For styling, we use Tailwind CSS, a utility-first CSS framework that allows for rapid UI development and highly customizable designs.
-   **ShadCN UI:** Our component library is built with ShadCN UI, which provides a set of beautifully designed, accessible, and reusable components.
-   **Lucide React:** We use `lucide-react` for a clean and consistent icon set throughout the application.
-   **Recharts:** For data visualization on the profile page, we use Recharts to create beautiful and interactive charts.

### 3. Backend & Database

-   **Firebase:** We leverage the Firebase platform for our backend services:
    -   **Firebase Authentication:** Handles user sign-up and login securely using email/password.
        -   **Firestore:** A NoSQL, cloud-hosted database where we store all user data, including profiles, resume history, and analytics. Real-time listeners keep the UI in sync with the database.
            -   **Firebase Storage:** Used for storing user-uploaded files, such as resumes and profile pictures.

            ### 4. Generative AI

            -   **Genkit & Gemini:** The AI-powered resume tailoring is driven by Google's Genkit, an open-source framework for building production-ready AI applications. It connects to thepowerful **Gemini** family of models via the Google AI API to analyze resumes and job descriptions.

            ### 5. Key APIs & Libraries

            -   **React Hook Form & Zod:** For robust and type-safe form handling and validation.
            -   **pdf-parse:** A server-side library used to extract text content from uploaded PDF resumes.
            -   **jsPDF:** Used on the client-side to generate downloadable PDF documents of the tailored resumes.
            