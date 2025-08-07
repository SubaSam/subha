import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "@/components/LandingPage"
import "@/App.css"
import Page from "./dashboard/Page"
import Pipeline from "./dashboard/Devxcelerate/pipelinegenerator/pipeline"
import PipelineConverter from "./dashboard/Devxcelerate/pipelineconverter/pipelineconverter"
import Refiner from "./dashboard/Devxcelerate/PipelineRefiner/pipeRefiner"
import CodeGenie from "./dashboard/CodeGenie/document"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page />} >
          <Route path="DevXcelerateGenerator" element={<Pipeline/>}/>
          <Route path="DevXcelerateConverter" element={<PipelineConverter/>}/>
          <Route path="DevXcelerateRefiner" element={<Refiner/>}/>
          <Route path="/codegenie" element={<CodeGenie />} />

          </Route>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/:tool" element={<Page />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App