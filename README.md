# CityCare | Public Infrastructure Issue Reporter

CityCare is a modern web application designed to bridge the gap between citizens and local authorities. It allows residents to report public infrastructure issues (like broken roads, faulty streetlights, or drainage problems) while providing a robust dashboard for staff and admins to manage and resolve these reports.

# Live Deployment
Live Website: https://public-issue.web.app

Backend API: public-infrastructure-issue-server.vercel.app

# Core Features
# Citizen Dashboard
Report Issues: Submit reports with titles, detailed descriptions, category selection, and image uploads.

Real-time Tracking: Monitor the progress of submitted reports (Pending ➔ In Progress ➔ Resolved).

Community Engagement: Upvote reports from other citizens to highlight urgent community needs.

Premium Subscription: Integrated Stripe payments for premium memberships, allowing unlimited reports.

Invoices: Securely download PDF invoices for all transactions (subscriptions or issue boosts).

# Staff Dashboard
Task Management: View and manage infrastructure issues assigned by administrators.

Progress Updates: Update the status of reports and add official notes regarding the resolution process.

# Admin Dashboard:
User Oversight: Manage user roles (Admin/Staff/Citizen) and block/unblock users.

Staff Coordination: Create and manage official staff accounts via Firebase Admin.

System Analytics: Comprehensive overview of total reports, revenue generation, and category-wise statistics.

# Technology Stack
# Frontend:

1. React.js 

2. Tailwind CSS & DaisyUI 

3. TanStack Query (React Query): 

4. Firebase Authentication: 

5. Axios: 

6. React Hook Form: 

# Backend & Database:

1. Node.js & Express.js

2. MongoDB: 

3. Stripe API: 

4. PDFKit: 