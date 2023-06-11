import { Box } from "@mui/material";
import { TitleBar } from "./components/TitleBar";
import BodyUi from "./components/bodyUI/BodyUi";


function App() {
  return (
    <Box sx={{ width: "100%", m: 1, p: 1 }} height="100vh">
      <TitleBar title="Vertex cover" />
      <BodyUi />
    </Box>
  );
}

export default App;
