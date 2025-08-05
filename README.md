# FormAI - AI-Powered Form Builder SaaS

A comprehensive Next.js SaaS application that functions as an AI-driven form builder with drag-and-drop functionality, real-time collaboration, and secure user authentication.

## 🚀 Features

- **AI-Powered Form Building**: Intelligent form suggestions and automated field generation
- **Drag & Drop Interface**: Intuitive form builder with sortable elements
- **User Authentication**: Secure sign-in/sign-up with Clerk
- **Real-time Collaboration**: Live cursors and instant updates (ready for implementation)
- **Responsive Design**: Modern UI with TailwindCSS and shadcn/ui components
- **Form Templates**: Customizable templates for common use cases
- **Analytics Dashboard**: Form performance insights and metrics
- **Theme Support**: Light/dark mode with system preference detection

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **Authentication**: Clerk
- **Drag & Drop**: @dnd-kit
- **State Management**: React hooks and context
- **Database**: Ready for integration (currently using mock data)
- **AI Integration**: Ready for Gemini API integration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-form-builder-saas
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Add your Clerk keys to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Setup

This application uses Clerk for authentication. To set it up:

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable and secret keys
4. Add them to your `.env.local` file
5. Configure your sign-in/sign-up URLs in the Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard routes
│   ├── sign-in/          # Authentication pages
│   ├── sign-up/          
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🎨 Key Components

- **Dashboard**: Main user interface with form management
- **FormBuilder**: Drag-and-drop form creation interface
- **AIAssistant**: AI-powered form suggestions and improvements
- **FormElementPalette**: Draggable form elements
- **UserProfile**: User account management
- **ErrorBoundary**: Error handling and recovery

## 🔧 Configuration

### Next.js Configuration
- React Strict Mode enabled
- SWC minification for better performance
- Clerk image domains configured
- Server actions enabled

### TailwindCSS
- Custom color scheme with CSS variables
- Dark mode support
- Custom animations and components
- Responsive design utilities

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - Railway
   - AWS Amplify

3. **Set environment variables** in your deployment platform

## 🔮 Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Gemini AI integration for advanced form suggestions
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Form analytics and reporting
- [ ] Advanced form validation rules
- [ ] Custom themes and branding
- [ ] Form templates marketplace
- [ ] API for form submissions
- [ ] Webhook integrations
- [ ] Multi-language support

## 🐛 Known Issues

- None currently identified

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
