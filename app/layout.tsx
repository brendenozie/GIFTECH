import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-context";
import { PhoneCheckWrapper } from "@/components/phone-check-wrapper";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import ClientSessionProvider from "@/components/client-session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GIFTECH",
    template: "%s | GIFTECH",
  },
  description:
    "Online learning platform offering coding courses, expert mentorship, and a supportive community to help you master programming skills and advance your tech career.",
  keywords: [
    "Coding",
    "Programming",
    "Web Development",
    "Software Engineering",
    "Tech Education",
    "Online Courses",
    "Programming Bootcamp",
    "Developer Training",
    "Coding Tutorials",
  ],
  authors: [{ name: "GIFTECHTeam" }],
  creator: "GIFTECH",
  publisher: "GIFTECH",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://giftech.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://giftech.com",
    title: "GIFTECH",
    description:
      "Online learning platform offering coding courses, expert mentorship, and a supportive community to help you master programming skills and advance your tech career.",
    siteName: "GIFTECH",
    images: [
      {
        url: "/giftech_ico.png",
        width: 1200,
        height: 630,
        alt: "GIFTECH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GIFTECH",
    description:
      "",
    images: ["/giftech_ico.png"],
    creator: "@giftech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: "/giftech_ico.png",
    shortcut: "/giftech_ico.png",
    apple: "/giftech_ico.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <script src="https://s3.tradingview.com/tv.js" async /> */}
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" async />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"
          async
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent autofill extension conflicts
              (function() {
                // Disable problematic autofill overlays
                const disableAutofillOverlays = () => {
                  const overlays = document.querySelectorAll('[data-autofill-overlay]');
                  overlays.forEach(overlay => {
                    if (overlay.parentNode) {
                      overlay.parentNode.removeChild(overlay);
                    }
                  });
                };

                // Run on DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', disableAutofillOverlays);
                } else {
                  disableAutofillOverlays();
                }

                // Run on dynamic content changes
                const observer = new MutationObserver(disableAutofillOverlays);
                if (document.body) {
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                }

                // Prevent insertBefore errors from autofill extensions
                const originalInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, referenceNode) {
                  try {
                    return originalInsertBefore.call(this, newNode, referenceNode);
                  } catch (error) {
                    if (error.name === 'NotFoundError' && error.message.includes('insertBefore')) {
                      console.warn('Autofill extension conflict prevented:', error.message);
                      return newNode;
                    }
                    throw error;
                  }
                };
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientSessionProvider>
            <AuthProvider>
                {children}
                <Toaster />
            </AuthProvider>
          </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
