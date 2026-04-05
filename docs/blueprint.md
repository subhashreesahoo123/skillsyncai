# **App Name**: SkillSync AI

## Core Features:

- User Authentication & Profile: Secure user registration, login (Google & Email), and storage of user profile data using Firebase Auth and Firestore.
- Resume & Job Description Input: Allows users to upload PDF/DOCX resumes (with automated text extraction) and provide job descriptions via text input or file upload. Original files are stored in Firebase Storage, with metadata in Firestore.
- AI-Powered Tailoring Tool: Utilizes a GPT model via OpenAI API to intelligently analyze the uploaded resume and job description. This tool generates an ATS-optimized, keyword-matched resume draft with improved bullet points and skills alignment, facilitated by Firebase Functions.
- Tailored Resume Preview & Export: Presents an interactive preview of the AI-generated resume and enables users to download the tailored version as a PDF or DOCX file.
- Version History Management: Stores multiple tailored resume versions in Firestore, allowing users to revisit, manage, and download their previous iterations easily.

## Style Guidelines:

- Primary color: A sophisticated medium blue (#225DD0), chosen for professionalism and trust. The hue, informed by concepts of precision and aspiration, conveys a modern, yet reliable feel. This bold shade will stand out against lighter backgrounds.
- Background color: A very light, almost off-white gray-blue (#F2F5F8), visibly sharing the primary's hue but heavily desaturated to create a clean, expansive canvas suitable for a light theme, promoting clarity and readability, especially for text-heavy content like resumes.
- Accent color: A vibrant sky blue (#4CB2DB), analogous to the primary hue, providing a fresh contrast in both saturation and brightness. This color will be strategically used for calls-to-action, highlights, and interactive elements to draw attention.
- Headlines font: 'Space Grotesk' (sans-serif), for a modern, slightly technical, and attention-grabbing feel. Body text font: 'Inter' (sans-serif), for its excellent readability and neutral, professional appearance, ensuring clear communication of resume content.
- Clean, crisp, and modern vector icons. Focus on clarity and ease of understanding for actions like upload, download, editing, and profile management. Icons should align with the contemporary and professional aesthetic.
- A clean, intuitive dashboard layout emphasizing user-friendly navigation. Implement a responsive design ensuring seamless experience across all devices and integrate drag-and-drop functionality for file uploads where appropriate.
- Subtle and purposeful loading animations to indicate AI processing and file operations, providing visual feedback to the user without being distracting. Implement smooth transitions for state changes and view navigation.