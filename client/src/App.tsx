import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import TextInput from "./pages/TextInput";
import DrawingInput from "./pages/DrawingInput";
import Results from "./pages/Results";
import { useState } from "react";
import { DrawingState } from "./lib/types";

function Router() {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    inputType: "text",
    steps: [],
    isLoading: false,
  });

  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/text-input">
        <TextInput setDrawingState={setDrawingState} />
      </Route>
      <Route path="/drawing-input">
        <DrawingInput setDrawingState={setDrawingState} />
      </Route>
      <Route path="/results">
        <Results drawingState={drawingState} />
      </Route>
      <Route><NotFound /></Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="pb-24"> {/* Add padding at bottom for the navbar */}
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
