#!/usr/bin/env node

/**
 * Comprehensive Test Script for Spacetime Maps Implementation
 * Tests all Phase 1-3 features including animation controls and multi-city comparison
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  log(message, color = "reset") {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    this.log("\n🧪 Starting Spacetime Maps Implementation Tests\n", "cyan");

    for (const { name, testFn } of this.tests) {
      try {
        const result = await testFn();
        if (result === true) {
          this.log(`✅ ${name}`, "green");
          this.passed++;
        } else if (result === "warning") {
          this.log(`⚠️  ${name}`, "yellow");
          this.warnings++;
        } else {
          this.log(`❌ ${name}: ${result}`, "red");
          this.failed++;
        }
      } catch (error) {
        this.log(`❌ ${name}: ${error.message}`, "red");
        this.failed++;
      }
    }

    this.printSummary();
  }

  printSummary() {
    this.log("\n📊 Test Summary:", "cyan");
    this.log(`✅ Passed: ${this.passed}`, "green");
    this.log(`⚠️  Warnings: ${this.warnings}`, "yellow");
    this.log(`❌ Failed: ${this.failed}`, "red");
    this.log(`📈 Total: ${this.tests.length}`, "blue");

    const successRate = (
      ((this.passed + this.warnings) / this.tests.length) *
      100
    ).toFixed(1);
    this.log(
      `🎯 Success Rate: ${successRate}%`,
      successRate >= 90 ? "green" : successRate >= 70 ? "yellow" : "red"
    );
  }

  fileExists(filePath) {
    return fs.existsSync(path.join(__dirname, filePath));
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(path.join(__dirname, filePath), "utf8");
    } catch (error) {
      throw new Error(`Cannot read file: ${filePath}`);
    }
  }

  hasImport(fileContent, importName) {
    return fileContent.includes(`import`) && fileContent.includes(importName);
  }

  hasExport(fileContent, exportName) {
    return fileContent.includes(`export`) && fileContent.includes(exportName);
  }

  hasFunction(fileContent, functionName) {
    return (
      fileContent.includes(functionName) &&
      (fileContent.includes(`function ${functionName}`) ||
        fileContent.includes(`const ${functionName}`) ||
        fileContent.includes(`${functionName} =`) ||
        fileContent.includes(`${functionName}:`))
    );
  }

  hasInterface(fileContent, interfaceName) {
    return (
      fileContent.includes(`interface ${interfaceName}`) ||
      fileContent.includes(`type ${interfaceName}`)
    );
  }
}

const runner = new TestRunner();

// ===== PHASE 1 TESTS: Foundation & Quick Wins =====

runner.test("Backend API Caching System", () => {
  if (!runner.fileExists("../backend/backend/cache.py")) {
    return "warning"; // Backend is optional for frontend testing
  }

  const content = runner.readFile("../backend/backend/cache.py");
  if (!content.includes("class FileBasedCache")) {
    return "FileBasedCache class not found";
  }

  if (!content.includes("def get") || !content.includes("def set")) {
    return "Cache get/set methods missing";
  }

  return true;
});

runner.test("Backend Cache Integration", () => {
  if (!runner.fileExists("../backend/backend/gmaps.py")) {
    return "warning"; // Backend is optional for frontend testing
  }

  const content = runner.readFile("../backend/backend/gmaps.py");
  if (!content.includes("cache") || !content.includes("FileBasedCache")) {
    return "Cache integration not found in gmaps.py";
  }

  return true;
});

runner.test("Modern Color Theme System", () => {
  if (!runner.fileExists("src/theme/colors.ts")) {
    return "Color theme file missing";
  }

  const content = runner.readFile("src/theme/colors.ts");
  if (!content.includes("primary") || !content.includes("accent")) {
    return "Primary/accent colors not defined";
  }

  return true;
});

runner.test("UI Component Library - Button", () => {
  if (!runner.fileExists("src/components/ui/Button.tsx")) {
    return "Button component missing";
  }

  const content = runner.readFile("src/components/ui/Button.tsx");
  if (!runner.hasInterface(content, "ButtonProps")) {
    return "ButtonProps interface missing";
  }

  if (!content.includes("variant") || !content.includes("size")) {
    return "Button variants/sizes not implemented";
  }

  return true;
});

runner.test("UI Component Library - Card", () => {
  if (!runner.fileExists("src/components/ui/Card.tsx")) {
    return "Card component missing";
  }

  const content = runner.readFile("src/components/ui/Card.tsx");
  if (!content.includes("CardHeader") || !content.includes("CardContent")) {
    return "Card subcomponents missing";
  }

  return true;
});

runner.test("UI Component Library - Input", () => {
  if (!runner.fileExists("src/components/ui/Input.tsx")) {
    return "Input component missing";
  }

  const content = runner.readFile("src/components/ui/Input.tsx");
  if (!runner.hasInterface(content, "InputProps")) {
    return "InputProps interface missing";
  }

  return true;
});

runner.test("UI Component Library - LoadingSpinner", () => {
  if (!runner.fileExists("src/components/ui/LoadingSpinner.tsx")) {
    return "LoadingSpinner component missing";
  }

  const content = runner.readFile("src/components/ui/LoadingSpinner.tsx");
  if (!content.includes("size") || !content.includes("animate-spin")) {
    return "LoadingSpinner functionality missing";
  }

  return true;
});

// ===== PHASE 2 TESTS: Enhanced Interactivity =====

runner.test("Enhanced Menu System - ModernMenu", () => {
  if (!runner.fileExists("src/components/ModernMenu.tsx")) {
    return "ModernMenu component missing";
  }

  const content = runner.readFile("src/components/ModernMenu.tsx");
  if (!runner.hasInterface(content, "ModernMenuProps")) {
    return "ModernMenuProps interface missing";
  }

  if (
    !content.includes("SpaceTimeProgressBar") ||
    !content.includes("ModernViewSettingsPanel")
  ) {
    return "Modern menu subcomponents missing";
  }

  return true;
});

runner.test("Interactive Controls - Dropdown", () => {
  if (!runner.fileExists("src/components/ui/Dropdown.tsx")) {
    return "Dropdown component missing";
  }

  const content = runner.readFile("src/components/ui/Dropdown.tsx");
  if (!runner.hasInterface(content, "DropdownProps")) {
    return "DropdownProps interface missing";
  }

  if (!content.includes("onSelect") || !content.includes("options")) {
    return "Dropdown functionality missing";
  }

  return true;
});

runner.test("Interactive Controls - Slider", () => {
  if (!runner.fileExists("src/components/ui/Slider.tsx")) {
    return "Slider component missing";
  }

  const content = runner.readFile("src/components/ui/Slider.tsx");
  if (!content.includes("onChange") || !content.includes("value")) {
    return "Slider functionality missing";
  }

  return true;
});

runner.test("Interactive Controls - Toggle", () => {
  if (!runner.fileExists("src/components/ui/Toggle.tsx")) {
    return "Toggle component missing";
  }

  const content = runner.readFile("src/components/ui/Toggle.tsx");
  if (!content.includes("checked") || !content.includes("onChange")) {
    return "Toggle functionality missing";
  }

  return true;
});

runner.test("Keyboard Shortcuts System", () => {
  if (!runner.fileExists("src/hooks/useKeyboardShortcuts.ts")) {
    return "Keyboard shortcuts hook missing";
  }

  const content = runner.readFile("src/hooks/useKeyboardShortcuts.ts");
  if (!content.includes("useEffect") || !content.includes("addEventListener")) {
    return "Keyboard event handling missing";
  }

  return true;
});

runner.test("Keyboard Shortcuts Modal", () => {
  if (!runner.fileExists("src/components/KeyboardShortcutsModal.tsx")) {
    return "Keyboard shortcuts modal missing";
  }

  const content = runner.readFile("src/components/KeyboardShortcutsModal.tsx");
  if (!content.includes("shortcuts") || !content.includes("category")) {
    return "Shortcuts display functionality missing";
  }

  return true;
});

runner.test("Touch Gestures System", () => {
  if (!runner.fileExists("src/hooks/useTouchGestures.ts")) {
    return "Touch gestures hook missing";
  }

  const content = runner.readFile("src/hooks/useTouchGestures.ts");
  if (!content.includes("onSwipe") || !content.includes("onDoubleTap")) {
    return "Touch gesture handlers missing";
  }

  return true;
});

runner.test("Floating Action Button", () => {
  if (!runner.fileExists("src/components/ui/FloatingActionButton.tsx")) {
    return "FloatingActionButton component missing";
  }

  const content = runner.readFile("src/components/ui/FloatingActionButton.tsx");
  if (!content.includes("actions") || !content.includes("position")) {
    return "FloatingActionButton functionality missing";
  }

  return true;
});

// ===== PHASE 3 TESTS: Advanced Features =====

runner.test("Animation Controls Hook", () => {
  if (!runner.fileExists("src/hooks/useAnimationControls.ts")) {
    return "Animation controls hook missing";
  }

  const content = runner.readFile("src/hooks/useAnimationControls.ts");
  if (
    !runner.hasInterface(content, "AnimationState") ||
    !runner.hasInterface(content, "AnimationControls")
  ) {
    return "Animation interfaces missing";
  }

  if (
    !content.includes("play") ||
    !content.includes("pause") ||
    !content.includes("setSpeed")
  ) {
    return "Animation control methods missing";
  }

  return true;
});

runner.test("Animation Controls Panel", () => {
  if (!runner.fileExists("src/components/AnimationControlsPanel.tsx")) {
    return "Animation controls panel missing";
  }

  const content = runner.readFile("src/components/AnimationControlsPanel.tsx");
  if (!runner.hasInterface(content, "AnimationControlsPanelProps")) {
    return "AnimationControlsPanelProps interface missing";
  }

  if (
    !content.includes("speedPresets") ||
    !content.includes("directionOptions")
  ) {
    return "Animation control options missing";
  }

  return true;
});

runner.test("Multi-City Comparison Hook", () => {
  if (!runner.fileExists("src/hooks/useMultiCityComparison.ts")) {
    return "Multi-city comparison hook missing";
  }

  const content = runner.readFile("src/hooks/useMultiCityComparison.ts");
  if (
    !runner.hasInterface(content, "CitySlot") ||
    !runner.hasInterface(content, "MultiCityState")
  ) {
    return "Multi-city interfaces missing";
  }

  if (!content.includes("addCity") || !content.includes("removeCity")) {
    return "Multi-city control methods missing";
  }

  return true;
});

runner.test("Multi-City Comparison Component", () => {
  if (!runner.fileExists("src/components/MultiCityComparison.tsx")) {
    return "Multi-city comparison component missing";
  }

  const content = runner.readFile("src/components/MultiCityComparison.tsx");
  if (!content.includes("CityMapSlot") || !content.includes("getGridClasses")) {
    return "Multi-city layout functionality missing";
  }

  return true;
});

// ===== INTEGRATION TESTS =====

runner.test("App Component Integration", () => {
  if (!runner.fileExists("src/components/App.tsx")) {
    return "App component missing";
  }

  const content = runner.readFile("src/components/App.tsx");
  if (
    !runner.hasImport(content, "useAnimationControls") ||
    !runner.hasImport(content, "MultiCityComparison")
  ) {
    return "New features not integrated in App component";
  }

  if (
    !content.includes("showMultiCity") ||
    !content.includes("animationControls")
  ) {
    return "Animation and multi-city state missing in App";
  }

  return true;
});

runner.test("ModernMenu Integration", () => {
  const content = runner.readFile("src/components/ModernMenu.tsx");
  if (
    !runner.hasImport(content, "AnimationControlsPanel") ||
    !runner.hasImport(content, "useAnimationControls")
  ) {
    return "Animation controls not integrated in ModernMenu";
  }

  if (!content.includes("onShowMultiCity")) {
    return "Multi-city callback missing in ModernMenu";
  }

  return true;
});

runner.test("UI Components Index Export", () => {
  if (!runner.fileExists("src/components/ui/index.ts")) {
    return "UI components index file missing";
  }

  const content = runner.readFile("src/components/ui/index.ts");
  const requiredExports = [
    "Button",
    "Card",
    "Input",
    "Dropdown",
    "Slider",
    "Toggle",
    "LoadingSpinner",
    "FloatingActionButton",
  ];

  for (const exportName of requiredExports) {
    if (!content.includes(exportName)) {
      return `Missing export: ${exportName}`;
    }
  }

  return true;
});

// ===== BUILD & DEPENDENCY TESTS =====

runner.test("Package.json Dependencies", () => {
  if (!runner.fileExists("package.json")) {
    return "package.json missing";
  }

  const content = runner.readFile("package.json");
  const packageJson = JSON.parse(content);

  const requiredDeps = ["@pixi/react", "react", "typescript"];
  for (const dep of requiredDeps) {
    if (
      !packageJson.dependencies?.[dep] &&
      !packageJson.devDependencies?.[dep]
    ) {
      return `Missing dependency: ${dep}`;
    }
  }

  return true;
});

runner.test("TypeScript Configuration", () => {
  if (!runner.fileExists("tsconfig.json")) {
    return "tsconfig.json missing";
  }

  const content = runner.readFile("tsconfig.json");
  if (!content.includes("strict") || !content.includes("jsx")) {
    return "TypeScript configuration incomplete";
  }

  return true;
});

runner.test("Tailwind Configuration", () => {
  if (!runner.fileExists("tailwind.config.js")) {
    return "tailwind.config.js missing";
  }

  const content = runner.readFile("tailwind.config.js");
  if (!content.includes("theme") || !content.includes("extend")) {
    return "Tailwind theme configuration missing";
  }

  return true;
});

runner.test("Git Hooks Setup", () => {
  if (!runner.fileExists("../.husky/pre-commit")) {
    return "warning"; // Not critical but recommended
  }

  return true;
});

// ===== PERFORMANCE & QUALITY TESTS =====

runner.test("Code Quality - Utility Functions", () => {
  if (!runner.fileExists("src/utils/cn.ts")) {
    return "Utility functions missing";
  }

  const content = runner.readFile("src/utils/cn.ts");
  if (!content.includes("function cn") && !content.includes("const cn")) {
    return "Class name utility function missing";
  }

  if (!content.includes("ClassValue") || !content.includes("join")) {
    return "Class name utility function incomplete";
  }

  return true;
});

runner.test("Theme System Completeness", () => {
  if (!runner.fileExists("src/theme/index.ts")) {
    return "Theme index file missing";
  }

  const content = runner.readFile("src/theme/index.ts");
  if (!content.includes("colors")) {
    return "Theme exports incomplete";
  }

  return true;
});

runner.test("Component Props Type Safety", () => {
  const components = [
    "src/components/ui/Button.tsx",
    "src/components/ui/Card.tsx",
    "src/components/ui/Dropdown.tsx",
    "src/components/AnimationControlsPanel.tsx",
    "src/components/MultiCityComparison.tsx",
  ];

  for (const component of components) {
    if (!runner.fileExists(component)) {
      return `Component missing: ${component}`;
    }

    const content = runner.readFile(component);
    if (!content.includes("interface") && !content.includes("type")) {
      return `Props interface missing in: ${component}`;
    }
  }

  return true;
});

// ===== ACCESSIBILITY TESTS =====

runner.test("Accessibility - ARIA Labels", () => {
  const components = [
    "src/components/ui/Button.tsx",
    "src/components/ui/Dropdown.tsx",
    "src/components/ui/Slider.tsx",
  ];

  let hasAriaLabels = false;
  for (const component of components) {
    if (runner.fileExists(component)) {
      const content = runner.readFile(component);
      if (content.includes("aria-") || content.includes("role=")) {
        hasAriaLabels = true;
        break;
      }
    }
  }

  return hasAriaLabels ? true : "warning";
});

runner.test("Keyboard Navigation Support", () => {
  const keyboardContent = runner.readFile("src/hooks/useKeyboardShortcuts.ts");
  if (
    !keyboardContent.includes("keydown") ||
    !keyboardContent.includes("preventDefault")
  ) {
    return "Keyboard navigation incomplete";
  }

  return true;
});

// Run all tests
runner.run().then(() => {
  process.exit(runner.failed > 0 ? 1 : 0);
});
