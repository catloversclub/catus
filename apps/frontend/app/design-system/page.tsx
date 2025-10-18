"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 transition-colors ${
      isDark ? "dark" : ""
    }`}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Design System</h1>
            <p className="text-text-secondary mt-2">커스텀 디자인 시스템 컴포넌트 가이드</p>
          </div>
          <Button onClick={toggleTheme} variant="outline" size="lg">
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Button>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Light Mode Colors */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">Light Mode</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-background border border-border rounded-lg">
                  <div className="w-full h-8 bg-background rounded mb-2"></div>
                  <p className="text-sm text-foreground">Background Primary</p>
                  <p className="text-xs text-text-tertiary">#FDFDFD</p>
                </div>
                <div className="p-4 bg-background-secondary border border-border rounded-lg">
                  <div className="w-full h-8 bg-background-secondary rounded mb-2"></div>
                  <p className="text-sm text-foreground">Background Secondary</p>
                  <p className="text-xs text-text-tertiary">#F6F6F6</p>
                </div>
                <div className="p-4 bg-primary border border-border rounded-lg">
                  <div className="w-full h-8 bg-primary rounded mb-2"></div>
                  <p className="text-sm text-primary-foreground">Primary</p>
                  <p className="text-xs text-primary-foreground/70">#FECF16</p>
                </div>
                <div className="p-4 bg-destructive border border-border rounded-lg">
                  <div className="w-full h-8 bg-destructive rounded mb-2"></div>
                  <p className="text-sm text-destructive-foreground">Destructive</p>
                  <p className="text-xs text-destructive-foreground/70">#EA0137</p>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">Text Colors</h3>
              <div className="space-y-3">
                <div className="p-3 border border-border rounded-lg">
                  <p className="text-text-primary font-medium">Primary Text</p>
                  <p className="text-xs text-text-tertiary">#1B1B1B</p>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <p className="text-text-secondary">Secondary Text</p>
                  <p className="text-xs text-text-tertiary">#444444</p>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <p className="text-text-tertiary">Tertiary Text</p>
                  <p className="text-xs text-text-tertiary">#595959</p>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <p className="text-text-success">Success Text</p>
                  <p className="text-xs text-text-tertiary">#0274B6</p>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <p className="text-text-error">Error Text</p>
                  <p className="text-xs text-text-tertiary">#EA0137</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Buttons</h2>
          
          <div className="space-y-8">
            {/* Button Variants */}
            <div>
              <h3 className="text-xl font-medium text-foreground mb-4">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="text-xl font-medium text-foreground mb-4">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🎨</Button>
                <Button size="icon-sm">📝</Button>
                <Button size="icon-lg">⚙️</Button>
              </div>
            </div>

            {/* Button States */}
            <div>
              <h3 className="text-xl font-medium text-foreground mb-4">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline">Normal Outline</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
                <Button variant="ghost">Normal Ghost</Button>
                <Button variant="ghost" disabled>Disabled Ghost</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Typography</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h1 className="text-4xl font-bold text-foreground mb-2">Heading 1</h1>
              <p className="text-text-tertiary">4xl / Bold</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h2 className="text-3xl font-semibold text-foreground mb-2">Heading 2</h2>
              <p className="text-text-tertiary">3xl / Semibold</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-2xl font-medium text-foreground mb-2">Heading 3</h3>
              <p className="text-text-tertiary">2xl / Medium</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-lg text-foreground mb-2">Body Large</p>
              <p className="text-text-tertiary">lg / Regular</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-base text-foreground mb-2">Body Regular</p>
              <p className="text-text-tertiary">base / Regular</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-foreground mb-2">Body Small</p>
              <p className="text-text-tertiary">sm / Regular</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-xs text-foreground mb-2">Caption</p>
              <p className="text-text-tertiary">xs / Regular</p>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Card Title</h3>
              <p className="text-text-secondary">This is a basic card component with default styling.</p>
            </div>
            <div className="p-6 bg-background-secondary border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-2">Secondary Card</h3>
              <p className="text-text-secondary">This card uses the secondary background color.</p>
            </div>
            <div className="p-6 bg-primary border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Primary Card</h3>
              <p className="text-primary-foreground/80">This card uses the primary background color.</p>
            </div>
          </div>
        </section>

        {/* Spacing & Layout */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Spacing & Layout</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-lg font-medium text-foreground mb-4">Spacing Scale</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">2px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">4px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">8px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">16px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">24px</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-3xl font-semibold text-foreground mb-6">Border Radius</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-border rounded-sm">
              <div className="w-full h-16 bg-primary rounded-sm mb-2"></div>
              <p className="text-sm text-foreground">Small</p>
              <p className="text-xs text-text-tertiary">2px</p>
            </div>
            <div className="p-4 border border-border rounded-md">
              <div className="w-full h-16 bg-primary rounded-md mb-2"></div>
              <p className="text-sm text-foreground">Medium</p>
              <p className="text-xs text-text-tertiary">6px</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="w-full h-16 bg-primary rounded-lg mb-2"></div>
              <p className="text-sm text-foreground">Large</p>
              <p className="text-xs text-text-tertiary">10px</p>
            </div>
            <div className="p-4 border border-border rounded-xl">
              <div className="w-full h-16 bg-primary rounded-xl mb-2"></div>
              <p className="text-sm text-foreground">Extra Large</p>
              <p className="text-xs text-text-tertiary">14px</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
