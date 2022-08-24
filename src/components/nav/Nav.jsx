import icone from '../../__assets/pngwing.com.png';
import { Link } from "react-router-dom";
import './nav.css';
import { useState } from 'react';

export function Nav () {
    const [menu, setMenu] = useState(false);

    function menuHamburguer () {
        setMenu(!menu)
    };

    return(
        <div className='Nav__container'>
            <div className='Nav__firstcontent'>
                <section >
                    <img src={icone} alt="logo.png" />
                    <h1>Dashboard</h1>
                </section>
                <ul className='Nav__ul' >
                    <Link to="/"><li>Caminhões</li></Link>
                    <Link to="/localidades"><li>Localidades</li></Link>
                    <Link to="/orcamentos"><li>Orçamentos</li></Link>
                </ul>
                <div className="item" onClick={menuHamburguer}>
                    <a href="/#" className="container-menu-burger">
                    <i className="menu-burger"></i>
                    </a>
                </div>
            </div>
            <ul className={menu ? 'Nav__ul active' : '--Disable'}>
                    <Link to="/"><li>Caminhões</li></Link>
                    <Link to="/localidades"><li>Localidades</li></Link>
                    <Link to="/orcamentos"><li>Orçamentos</li></Link>
            </ul>
        </div>
    );
       
};