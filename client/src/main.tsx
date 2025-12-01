import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Network diagnostics
console.log("=== CartCircle Application Starting ===");
console.log("Current URL:", window.location.href);
console.log("Origin:", window.location.origin);
console.log("Navigator online:", navigator.onLine);

// Check if we can reach the backend
const checkBackendConnection = async () => {
  try {
    console.log("Checking backend connection...");
    const response = await fetch('/api/health', { 
      method: 'GET'
    });
    console.log("Backend health check response:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("Backend is reachable:", data);
    }
  } catch (error) {
    console.error("Backend connection failed:", error);
    console.error("This might cause authentication and data loading issues");
  }
};

// Network status monitoring
window.addEventListener('online', () => {
  console.log("Network connection restored");
});

window.addEventListener('offline', () => {
  console.error("Network connection lost");
});

const container = document.getElementById("root");
if (!container) {
  console.error("CRITICAL: Root element not found in DOM");
  console.error("HTML structure:", document.documentElement.innerHTML);
  
  // Create a fallback error display
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <div>
        <h1 style="color: #ef4444; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 16px;">Unable to find application container</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
  throw new Error("Root element not found");
}

console.log("Root element found, initializing React...");

// Check backend connection before starting React
checkBackendConnection();

try {
  const root = createRoot(container);
  root.render(<App />);
  console.log("✅ React app rendered successfully");
} catch (error) {
  console.error("❌ Critical error rendering React app:", error);
  
  // Display user-friendly error
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  container.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <div>
        <h1 style="color: #ef4444; margin-bottom: 16px;">Loading Error</h1>
        <p style="color: #6b7280; margin-bottom: 16px;">Unable to start the application</p>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">${errorMessage}</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
          Try Again
        </button>
      </div>
    </div>
  `;
  throw error;
}
