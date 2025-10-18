"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Design System Data
const designSystemData = {
  colors: {
    light: [
      { name: "Background Primary", value: "#FDFDFD", bg: "bg-background" },
      { name: "Background Secondary", value: "#F6F6F6", bg: "bg-background-secondary" },
      { name: "Primary", value: "#FECF16", bg: "bg-primary", text: "text-primary-foreground" },
      { name: "Destructive", value: "#EA0137", bg: "bg-destructive", text: "text-destructive-foreground" },
    ],
    text: [
      { name: "Primary Text", value: "#1B1B1B", text: "text-text-primary" },
      { name: "Secondary Text", value: "#444444", text: "text-text-secondary" },
      { name: "Tertiary Text", value: "#595959", text: "text-text-tertiary" },
      { name: "Success Text", value: "#0274B6", text: "text-text-success" },
      { name: "Error Text", value: "#EA0137", text: "text-text-error" },
    ]
  },
  buttons: {
    variants: [
      { name: "Primary", variant: "default" },
      { name: "Secondary", variant: "secondary" },
      { name: "Outline", variant: "outline" },
      { name: "Ghost", variant: "ghost" },
      { name: "Destructive", variant: "destructive" },
      { name: "Link", variant: "link" },
    ],
    sizes: [
      { name: "Small", size: "sm" },
      { name: "Default", size: "default" },
      { name: "Large", size: "lg" },
    ],
    states: [
      { name: "Normal", disabled: false },
      { name: "Disabled", disabled: true },
    ]
  },
  cards: [
    { title: "Card Title", description: "Basic card component with default styling.", bg: "bg-card", text: "text-card-foreground" },
    { title: "Secondary Card", description: "Card with secondary background color.", bg: "bg-background-secondary", text: "text-foreground" },
    { title: "Primary Card", description: "Card with primary background color.", bg: "bg-primary", text: "text-primary-foreground" },
  ],
  radius: [
    { name: "Small", className: "rounded-sm", value: "2px" },
    { name: "Medium", className: "rounded-md", value: "6px" },
    { name: "Large", className: "rounded-lg", value: "10px" },
    { name: "Extra Large", className: "rounded-xl", value: "14px" },
  ]
};

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
              <p className="text-sm text-text-secondary">디자인 시스템</p>
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
                {designSystemData.colors.light.map((color, index) => (
                  <div key={index} className={cn("p-3 border border-border rounded-lg", color.bg)}>
                    <div className={cn("w-full h-6 rounded mb-1", color.bg)}></div>
                    <p className={cn("text-xs", color.text || "text-foreground")}>{color.name}</p>
                    <p className={cn("text-xs text-text-tertiary", color.text && "opacity-70")}>{color.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">Text Colors</h3>
              <div className="space-y-2">
                {designSystemData.colors.text.map((color, index) => (
                  <div key={index} className="p-2 border border-border rounded">
                    <p className={cn("text-sm font-medium", color.text)}>{color.name}</p>
                    <p className="text-xs text-text-tertiary">{color.value}</p>
                  </div>
                ))}
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
                {designSystemData.buttons.variants.map((button, index) => (
                  <Button key={index} variant={button.variant as any} className="w-full">
                    {button.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Button Sizes</h3>
              <div className="space-y-2">
                {designSystemData.buttons.sizes.map((button, index) => (
                  <Button key={index} size={button.size as any} className="w-full">
                    {button.name}
                  </Button>
                ))}
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
                {designSystemData.buttons.states.map((state, index) => (
                  <Button key={index} disabled={state.disabled} className="w-full">
                    {state.name}
                  </Button>
                ))}
                <Button variant="outline" disabled className="w-full">Disabled Outline</Button>
                <Button variant="ghost" disabled className="w-full">Disabled Ghost</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Cards</h2>
          
          <div className="space-y-3">
            {designSystemData.cards.map((card, index) => (
              <div key={index} className={cn("p-4 border border-border rounded-lg", card.bg)}>
                <h3 className={cn("text-base font-semibold mb-2", card.text)}>{card.title}</h3>
                <p className={cn("text-sm", card.text === "text-primary-foreground" ? "text-primary-foreground/80" : "text-text-secondary")}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Border Radius</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {designSystemData.radius.map((radius, index) => (
              <div key={index} className="p-3 border border-border rounded-sm">
                <div className={cn("w-full h-12 bg-primary mb-2", radius.className)}></div>
                <p className="text-xs text-foreground">{radius.name}</p>
                <p className="text-xs text-text-tertiary">{radius.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
