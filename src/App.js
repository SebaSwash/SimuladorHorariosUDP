//import logo from './logo.svg';
import './App.css';
import MainPage from './pages';
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importación de datos
import sections from './data/sections.json';

export const SubjectsContext = React.createContext();
export const HelperClassesContext = React.createContext();
export const AvailableSectionsContext = React.createContext();

function App() {
  const [availableSections, setAvailableSections] = useState(sections.sections);
  const [selectedSubjects, setSelectedSubjects] = useState({
    0: [], // inicio 08:30
    1: [], // inicio 10:00
    2: [], // inicio 11:30
    3: [], // inicio 13:00
    4: [], // inicio 14:30
    5: [], // inicio 15:50
    6: [], // inicio 16:00
    7: [] // inicio 17:30
  });

  const [selectedHelperClasses, setSelectedHelperClasses] = useState({
    0: [], // inicio 08:30
    1: [], // inicio 10:00
    2: [], // inicio 11:30
    3: [], // inicio 13:00
    4: [], // inicio 14:30
    5: [], // inicio 15:50
    6: [], // inicio 16:00
    7: [] // inicio 17:30
  });

  return (
    <div className="App">
      <SubjectsContext.Provider value={{
        data: selectedSubjects,
        updater: setSelectedSubjects
        }}>
          <HelperClassesContext.Provider
            value = {{
              data: selectedHelperClasses,
              updater: setSelectedHelperClasses
            }}
          >
            <AvailableSectionsContext.Provider value={{data: availableSections, updater: setAvailableSections}}>
              <header className="App-header">
                <MainPage />
              </header>
            </AvailableSectionsContext.Provider>
            
          </HelperClassesContext.Provider>
      </SubjectsContext.Provider>
    </div>
  );    
}

export default App;
