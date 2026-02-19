import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import GreetingScreen from './components/GreetingScreen';
import ProjectScreen from './components/ProjectScreen';
import AdditionalQuestionsScreen from './components/AdditionalQuestionsScreen';
import DreamHouseFloorPlan from './components/DreamHouseFloorPlan';
import RentalFloorPlan from './components/RentalFloorPlan';
import PlanDetailsScreen from './components/PlanDetailsScreen';
import UpgradeScreen from './components/UpgradeScreen';
import SavedFilesScreen from './components/SavedFilesScreen';
import InteriorScreen from './components/InteriorScreen';
import OrderSummaryScreen from './components/OrderSummaryScreen';
import SummaryScreen from './components/SummaryScreen';
import EstimateScreen from './components/EstimateScreen';
import DetailedBreakdownScreen from './components/DetailedBreakdownScreen';
import SelectedTierDetail from './components/SelectedTierDetail';
import AnalysisLoadingScreen from './components/AnalysisLoadingScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('greeting');
  const [previousScreen, setPreviousScreen] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [estimateData, setEstimateData] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [projectStep, setProjectStep] = useState('project-selection');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPlotSize, setSelectedPlotSize] = useState(null);
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [customLength, setCustomLength] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [showDimensions, setShowDimensions] = useState(false);
  const [provisionalEstimate, setProvisionalEstimate] = useState(null);

  const handleAdditionalQuestions = (data) => {
    setSelectedData(data);
    setProjectStep('dimension-selection');
    setCurrentScreen('additional-questions');
  };

  const handleComplete = (finalData) => {
    console.log('Final data:', finalData);
    setSelectedData(finalData);
    setCurrentScreen('floor-plan');
  };

  const handleAdditionalQuestionsBack = () => {
    setCurrentScreen('project');
    setProjectStep('dimension-selection');
  };

  const handleEstimate = (finalData) => {
    console.log('Project Specification Complete:', finalData);
    setSelectedData(finalData);
    setPreviousScreen('summary');
    setCurrentScreen('estimate');
  };

  const handleViewBreakdown = (data) => {
    setEstimateData(data);
    setCurrentScreen('breakdown');
  };

  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState(null);

  const handleUpgradeSelect = (upgradeData, tier) => {
    // Store the upgrade result provisionally
    setProvisionalEstimate(upgradeData);
    setSelectedUpgradeTier(tier);
    setCurrentScreen('analysis-loading');
  };



  const handleViewProject = (project) => {

    const restoredData = {
      projectType: project.project_type,
      plotSize: project.plot_size,
      dimensions: project.plot_size,
      floors: project.floors,
      plan: project.plan,
      answers: project.answers,
      upgrades: project.upgrades,
      interior: project.interior,
      additionalRequirements: project.additionalRequirements,
      signature: project.signature,
      client_name: project.client_name,
      upgrades_cost: project.upgrades_cost,
      total_cost: project.total_cost,
      breakdown: project.breakdown,
      explanation: project.explanation,
      active_upgrade_features: project.active_upgrade_features,
      project_id: project.project_id
    };

    setSelectedData(restoredData);
    setPreviousScreen('saved');
    setIsReadOnly(true);
    setCurrentScreen('estimate');
  };

  const resetApp = () => {
    setSelectedData(null);
    setEstimateData(null);
    setIsReadOnly(false);
    setSelectedProject(null);
    setSelectedPlotSize(null);
    setSelectedDimension(null);
    setCustomLength('');
    setCustomWidth('');
    setShowDimensions(false);
    setProvisionalEstimate(null);
    setCurrentScreen('greeting');
  };

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'greeting' && (
        <GreetingScreen
          key="greeting"
          userName="Abhishek"
          onYes={() => {
            setIsReadOnly(false);
            setCurrentScreen('project');
          }}
          onNo={() => setCurrentScreen('saved')}
        />
      )}

      {currentScreen === 'project' && (
        <ProjectScreen
          key="project"
          onBack={() => setCurrentScreen('greeting')}
          onAdditionalQuestions={handleAdditionalQuestions}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedPlotSize={selectedPlotSize}
          setSelectedPlotSize={setSelectedPlotSize}
          selectedDimension={selectedDimension}
          setSelectedDimension={setSelectedDimension}
          currentStep={projectStep}
          setCurrentStep={setProjectStep}
          customLength={customLength}
          setCustomLength={setCustomLength}
          customWidth={customWidth}
          setCustomWidth={setCustomWidth}
          showDimensions={showDimensions}
          setShowDimensions={setShowDimensions}
        />
      )}

      {currentScreen === 'additional-questions' && (
        <AdditionalQuestionsScreen
          key="additional-questions"
          onBack={handleAdditionalQuestionsBack}
          selectedData={selectedData}
          onComplete={handleComplete}
        />
      )}

      {currentScreen === 'floor-plan' && (
        <>
          {selectedData?.projectType === 'dream-house' ? (
            <DreamHouseFloorPlan
              key="dream-floor-plan"
              onBack={() => setCurrentScreen('additional-questions')}
              selectedData={selectedData}
              onNext={(finalData) => {
                console.log('Final data:', finalData);
                setSelectedData(finalData);
                setCurrentScreen('plan-details');
              }}
            />
          ) : (
            <RentalFloorPlan
              key="rental-floor-plan"
              onBack={() => setCurrentScreen('additional-questions')}
              selectedData={selectedData}
              onNext={(finalData) => {
                console.log('Final data:', finalData);
                setSelectedData(finalData);
                setCurrentScreen('plan-details');
              }}
            />
          )}
        </>
      )}

      {currentScreen === 'plan-details' && (
        <PlanDetailsScreen
          key="plan-details"
          onBack={() => setCurrentScreen('floor-plan')}
          selectedData={selectedData}
          onProceed={(finalData) => {
            console.log('Final data with plan:', finalData);
            setSelectedData(finalData);
            setCurrentScreen('interior');
          }}
        />
      )}

      {currentScreen === 'upgrade' && (
        <UpgradeScreen
          key="upgrade"
          onBack={() => setCurrentScreen('plan-details')}
          selectedData={selectedData}
          onProceed={(finalData) => {
            console.log('Final data with upgrades:', finalData);
            setSelectedData(finalData);
            setCurrentScreen('interior');
          }}
        />
      )}

      {currentScreen === 'interior' && (
        <InteriorScreen
          key="interior"
          onBack={() => setCurrentScreen('plan-details')}
          selectedData={selectedData}
          onProceed={(finalData) => {
            console.log('Final Estimate Data:', finalData);
            setSelectedData(finalData);
            setCurrentScreen('summary');
          }}
        />
      )}

      {currentScreen === 'summary' && (
        <SummaryScreen
          key="summary"
          onBack={() => setCurrentScreen('interior')}
          selectedData={selectedData}
          onProceed={handleEstimate}
        />
      )}

      {currentScreen === 'estimate' && (
        <EstimateScreen
          key="estimate"
          onBack={() => setCurrentScreen(previousScreen === 'saved' ? 'saved' : 'summary')}
          selectedData={selectedData}
          onUpgradeSelect={handleUpgradeSelect}
          onViewBreakdown={handleViewBreakdown}
          onSave={resetApp}
          onHome={resetApp}
          isReadOnly={isReadOnly}
        />
      )}

      {currentScreen === 'breakdown' && (
        <DetailedBreakdownScreen
          key="breakdown"
          onBack={() => setCurrentScreen('estimate')}
          tier={selectedData?.plan || 'Classic'}
          estimateData={estimateData}
          selectedData={selectedData}
        />
      )}

      {currentScreen === 'analysis-loading' && (
        <AnalysisLoadingScreen
          key="analysis-loading"
          tier={selectedUpgradeTier}
          onComplete={() => setCurrentScreen('tier-detail')}
        />
      )}

      {currentScreen === 'tier-detail' && (
        <SelectedTierDetail
          key="tier-detail"
          onBack={() => {
            setProvisionalEstimate(null);
            setSelectedUpgradeTier('Base');
            setCurrentScreen('estimate');
          }}
          tier={selectedUpgradeTier}
          baseEstimateData={estimateData}
          estimateData={provisionalEstimate || estimateData}
          onProceed={(newEstimateOutput) => {
            console.log('Finalizing Upgrade To:', selectedUpgradeTier);
            setCurrentScreen('order-summary');
            setProvisionalEstimate(newEstimateOutput);
          }}
        />
      )}

      {currentScreen === 'order-summary' && (
        <OrderSummaryScreen
          key="order-summary"
          onBack={() => {
            // Traverse back to upgrade detail page instead of home
            setCurrentScreen('tier-detail');
          }}
          estimateData={provisionalEstimate || estimateData} // Use provisional data if available
          selectedData={selectedData}
          selectedTier={provisionalEstimate?.selected_tier || selectedData?.plan || selectedUpgradeTier || 'Base'}
          upgradeCost={provisionalEstimate?.upgrades_cost || selectedData?.upgrades_cost || 0}
          onSave={() => {
            // Commit the provisional data only when saved
            if (provisionalEstimate) {
              setEstimateData(provisionalEstimate);
              setSelectedData(prev => ({
                ...prev,
                plan: provisionalEstimate.selected_tier,
                total_cost: provisionalEstimate.total_cost,
                upgrades_cost: provisionalEstimate.upgrades_cost,
                breakdown: provisionalEstimate.breakdown,
                explanation: provisionalEstimate.explanation
              }));
            }
            setCurrentScreen('saved');
          }}
        />
      )}

      {currentScreen === 'saved' && (
        <SavedFilesScreen
          key="saved"
          onBack={() => setCurrentScreen('greeting')}
          onViewProject={handleViewProject}
        />
      )}
    </AnimatePresence>
  );
}

export default App;

