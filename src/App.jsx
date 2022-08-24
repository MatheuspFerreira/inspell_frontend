import { Routes, Route} from "react-router-dom";
import { Nav } from './components/nav';
import { Footer } from './components/footer';
import { Localidades } from './routes/localidades';
import { Caminhoes } from './routes/caminhoes';
import { Editar } from './routes/editar/Editar';
import { Cadastrar } from "./routes/cadastrar";
import { Orcamento } from "./routes/orcamento";







function App() {
  return (
    <>

      <Nav />
      <Routes>
        
        <Route path="/" element={<Caminhoes />} />
        <Route path="/orcamentos" element={<Orcamento/>} />
        <Route path="/localidades" element={<Localidades />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/editar/:id" element={<Editar />} />
        
      </Routes>
      <Footer />
      
    </>
  );
};

export default App;
