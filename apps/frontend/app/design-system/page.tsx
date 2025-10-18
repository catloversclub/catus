"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn("font-sans min-h-screen p-4 transition-colors", isDark ? "dark" : "light")}>
      <div className="max-w-[336px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Design System</h1>
              <p className="text-sm text-text-secondary">커스텀 디자인 시스템 가이드</p>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="sm">
              {isDark ? "☀️" : "🌙"}
            </Button>
          </div>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Color Palette</h2>
          
          <div className="space-y-6">
            {/* Light Mode Colors */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">Light Mode</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background border border-border rounded-lg">
                  <div className="w-full h-6 bg-background rounded mb-1"></div>
                  <p className="text-xs text-foreground">Background Primary</p>
                  <p className="text-xs text-text-tertiary">#FDFDFD</p>
                </div>
                <div className="p-3 bg-background-secondary border border-border rounded-lg">
                  <div className="w-full h-6 bg-background-secondary rounded mb-1"></div>
                  <p className="text-xs text-foreground">Background Secondary</p>
                  <p className="text-xs text-text-tertiary">#F6F6F6</p>
                </div>
                <div className="p-3 bg-primary border border-border rounded-lg">
                  <div className="w-full h-6 bg-primary rounded mb-1"></div>
                  <p className="text-xs text-primary-foreground">Primary</p>
                  <p className="text-xs text-primary-foreground/70">#FECF16</p>
                </div>
                <div className="p-3 bg-destructive border border-border rounded-lg">
                  <div className="w-full h-6 bg-destructive rounded mb-1"></div>
                  <p className="text-xs text-destructive-foreground">Destructive</p>
                  <p className="text-xs text-destructive-foreground/70">#EA0137</p>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">Text Colors</h3>
              <div className="space-y-2">
                <div className="p-2 border border-border rounded">
                  <p className="text-sm text-text-primary font-medium">Primary Text</p>
                  <p className="text-xs text-text-tertiary">#1B1B1B</p>
                </div>
                <div className="p-2 border border-border rounded">
                  <p className="text-sm text-text-secondary">Secondary Text</p>
                  <p className="text-xs text-text-tertiary">#444444</p>
                </div>
                <div className="p-2 border border-border rounded">
                  <p className="text-sm text-text-tertiary">Tertiary Text</p>
                  <p className="text-xs text-text-tertiary">#595959</p>
                </div>
                <div className="p-2 border border-border rounded">
                  <p className="text-sm text-text-success">Success Text</p>
                  <p className="text-xs text-text-tertiary">#0274B6</p>
                </div>
                <div className="p-2 border border-border rounded">
                  <p className="text-sm text-text-error">Error Text</p>
                  <p className="text-xs text-text-tertiary">#EA0137</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Buttons</h2>
          
          <div className="space-y-6">
            {/* Button Variants */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Button Variants</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="default" className="w-full">Primary</Button>
                <Button variant="secondary" className="w-full">Secondary</Button>
                <Button variant="outline" className="w-full">Outline</Button>
                <Button variant="ghost" className="w-full">Ghost</Button>
                <Button variant="destructive" className="w-full">Destructive</Button>
                <Button variant="link" className="w-full">Link</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Button Sizes</h3>
              <div className="space-y-2">
                <Button size="sm" className="w-full">Small</Button>
                <Button size="default" className="w-full">Default</Button>
                <Button size="lg" className="w-full">Large</Button>
                <div className="flex gap-2">
                  <Button size="icon">🎨</Button>
                  <Button size="icon-sm">📝</Button>
                  <Button size="icon-lg">⚙️</Button>
                </div>
              </div>
            </div>

            {/* Button States */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Button States</h3>
              <div className="space-y-2">
                <Button className="w-full">Normal</Button>
                <Button disabled className="w-full">Disabled</Button>
                <Button variant="outline" className="w-full">Normal Outline</Button>
                <Button variant="outline" disabled className="w-full">Disabled Outline</Button>
                <Button variant="ghost" className="w-full">Normal Ghost</Button>
                <Button variant="ghost" disabled className="w-full">Disabled Ghost</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Typography</h2>
          
          <div className="space-y-3">
            <div className="p-3 border border-border rounded">
              <h1 className="text-2xl font-bold text-foreground mb-1">Heading 1</h1>
              <p className="text-xs text-text-tertiary">2xl / Bold</p>
            </div>
            <div className="p-3 border border-border rounded">
              <h2 className="text-xl font-semibold text-foreground mb-1">Heading 2</h2>
              <p className="text-xs text-text-tertiary">xl / Semibold</p>
            </div>
            <div className="p-3 border border-border rounded">
              <h3 className="text-lg font-medium text-foreground mb-1">Heading 3</h3>
              <p className="text-xs text-text-tertiary">lg / Medium</p>
            </div>
            <div className="p-3 border border-border rounded">
              <p className="text-base text-foreground mb-1">Body Regular</p>
              <p className="text-xs text-text-tertiary">base / Regular</p>
            </div>
            <div className="p-3 border border-border rounded">
              <p className="text-sm text-foreground mb-1">Body Small</p>
              <p className="text-xs text-text-tertiary">sm / Regular</p>
            </div>
            <div className="p-3 border border-border rounded">
              <p className="text-xs text-foreground mb-1">Caption</p>
              <p className="text-xs text-text-tertiary">xs / Regular</p>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Cards</h2>
          
          <div className="space-y-3">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="text-base font-semibold text-card-foreground mb-2">Card Title</h3>
              <p className="text-sm text-text-secondary">Basic card component with default styling.</p>
            </div>
            <div className="p-4 bg-background-secondary border border-border rounded-lg">
              <h3 className="text-base font-semibold text-foreground mb-2">Secondary Card</h3>
              <p className="text-sm text-text-secondary">Card with secondary background color.</p>
            </div>
            <div className="p-4 bg-primary border border-border rounded-lg">
              <h3 className="text-base font-semibold text-primary-foreground mb-2">Primary Card</h3>
              <p className="text-sm text-primary-foreground/80">Card with primary background color.</p>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Border Radius</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-border rounded-sm">
              <div className="w-full h-12 bg-primary rounded-sm mb-2"></div>
              <p className="text-xs text-foreground">Small</p>
              <p className="text-xs text-text-tertiary">2px</p>
            </div>
            <div className="p-3 border border-border rounded-md">
              <div className="w-full h-12 bg-primary rounded-md mb-2"></div>
              <p className="text-xs text-foreground">Medium</p>
              <p className="text-xs text-text-tertiary">6px</p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <div className="w-full h-12 bg-primary rounded-lg mb-2"></div>
              <p className="text-xs text-foreground">Large</p>
              <p className="text-xs text-text-tertiary">10px</p>
            </div>
            <div className="p-3 border border-border rounded-xl">
              <div className="w-full h-12 bg-primary rounded-xl mb-2"></div>
              <p className="text-xs text-foreground">Extra Large</p>
              <p className="text-xs text-text-tertiary">14px</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
