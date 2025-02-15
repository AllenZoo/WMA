import { PaperProvider, Portal } from "react-native-paper";
import ThemeProvider from "./contexts/ThemeProvider";
import RootNavigator from "./routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExperimentalPage from "./utils/experiments/experimentalPage";
import DragAndDropScreen from "./utils/experiments/DragAndDropScreenExperiment";
import Toast from "react-native-toast-message";
import GlobalDraggableItem from "./components/interactive_ui/drag_drop_system/GlobalDraggableItem";
import Plate from "./components/dynamic_assets/Plate";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <ThemeProvider>
          <Portal.Host>
            <RootNavigator />
          </Portal.Host>

          {/* <ExperimentalPage /> */}
          {/* <DragAndDropScreen /> */}
        </ThemeProvider>
      </PaperProvider>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;
