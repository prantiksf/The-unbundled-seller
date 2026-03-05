<div align="center">
  <br />
    <a href="https://github.com/samarth-kamble" target="_blank">
       <img src="https://ubwp.buffalo.edu/happe/wp-content/uploads/sites/92/2019/12/slack_logo.png" alt="logo" width="200" height="auto" />
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_._JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-ShadCN_UI-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcnui" />
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=%2361DAFB&logo=react&color=20232a" alt="react" />
  </div>

<h3 align="center">Slack Clone</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)


## <a name="introduction">🤖 Introduction</a>
In this Project create an end-to-end fullstack and real-time slack clone, all with workspaces, channels, 1:1 conversations, threads, reactions, editing and deleting messages as well as member roles.

## <a name="tech-stack">⚙️ Tech Stack</a>
- Next.js
- TypeScript
- Tailwind CSS
- Convex
- Convex Auth
- React.js
- Next Auth
- Vercel

## <a name="features">🔋 Features</a>
- 📡 Real time communication
- 👍 Reactions to messages
- 🧵 Threads / Replies system
- ✏️ Editing messages
- 🗑️ Deleting messages
- 🔐 Role based access control
- 🖼️ Image attachments
- 🔒 Authentication with Next auth v5
- 📺 Channel creation
- 🏢 Workspace creation
- ✉️ Invite system / Invite codes
- 💬 Direct messaging
- 👥 User profiles
- ⚛️ Framework Next.js 14
- 🚀 Deployment on Vercel
- 🎨 ShadCN UI & Tailwind CSS

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

For Salesforce employees (using Soma GitLab):
```bash
git clone https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator.git
cd slack-vibeface-simulator
```

For external contributors (using GitHub):
```bash
git clone https://github.com/prantiksf/slack-vibeface-simulator.git
cd slack-vibeface-simulator
```
**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env.local
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```
Replace the placeholder values with your actual Convex,Github & google cloud credentials. You can obtain these credentials by signing up on the [Convex](https://www.convex.dev/), [Github](https://www.github.com) and [Google](https://console.cloud.google.com) websites.

**Running the Project**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## 👥 For Designers

**New to this project?** Check out:
- **[DESIGNER_SETUP.md](./DESIGNER_SETUP.md)** - Quick setup guide for designers
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Collaboration guidelines and workflow

**Key points:**
- Always create a feature branch (never commit to `main`)
- Pull latest changes before starting work: `git pull soma main`
- Test locally before pushing: `npm run dev`
- Create a Merge Request for review before merging

## 🔒 Protected Workflow

This repository uses protected branches to prevent breaking changes:
- `main` branch is protected - requires Merge Request approval
- Always work in feature branches: `designer/your-name/feature-name`
- Changes are reviewed before merging to `main`
