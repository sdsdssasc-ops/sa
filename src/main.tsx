@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 45 33% 98%;
    --foreground: 180 22% 12%;
    --card: 0 0% 100%;
    --card-foreground: 180 22% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 180 22% 12%;
    --primary: 172 66% 26%;
    --primary-foreground: 0 0% 100%;
    --secondary: 168 32% 93%;
    --secondary-foreground: 172 60% 16%;
    --muted: 168 20% 94%;
    --muted-foreground: 175 12% 40%;
    --accent: 43 85% 92%;
    --accent-foreground: 35 65% 24%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
    --border: 168 16% 88%;
    --input: 168 16% 84%;
    --ring: 172 66% 26%;
    --radius: 0.875rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 180 18% 8%;
    --foreground: 45 30% 96%;
    --card: 180 16% 11%;
    --card-foreground: 45 30% 96%;
    --popover: 180 16% 11%;
    --popover-foreground: 45 30% 96%;
    --primary: 172 55% 45%;
    --primary-foreground: 180 30% 8%;
    --secondary: 175 20% 18%;
    --secondary-foreground: 168 30% 90%;
    --muted: 175 15% 16%;
    --muted-foreground: 168 12% 65%;
    --accent: 43 40% 20%;
    --accent-foreground: 43 80% 85%;
    --destructive: 0 62% 45%;
    --destructive-foreground: 0 0% 98%;
    --border: 175 15% 20%;
    --input: 175 15% 24%;
    --ring: 172 55% 45%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Tajawal', system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .hero-gradient {
    background:
      radial-gradient(ellipse 80% 60% at 70% 10%, hsl(168 45% 88% / 0.9), transparent),
      radial-gradient(ellipse 60% 50% at 20% 80%, hsl(43 80% 90% / 0.7), transparent),
      linear-gradient(180deg, hsl(45 33% 98%), hsl(168 32% 95%));
  }
  .text-gradient {
    background: linear-gradient(120deg, hsl(172 66% 26%), hsl(188 70% 32%));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
