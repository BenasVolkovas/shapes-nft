import Install from "./components/Install";
import Home from "./components/Home";
import "./styles/App.css";

function App() {
    return (
        <div
            style={{
                height: "100vh",
                backgroundColor: "#0d1116",
                color: "white",
            }}
        >
            {window.ethereum ? <Home /> : <Install />}
        </div>
    );
}

export default App;
