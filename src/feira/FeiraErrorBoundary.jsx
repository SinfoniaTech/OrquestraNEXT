import {modeHref} from '../modes.js';
import {Component} from 'react';
export default class FeiraErrorBoundary extends Component {
 state={error:false};
 static getDerivedStateFromError(){return {error:true};}
 render(){return this.state.error?<main style={{padding:'3rem',maxWidth:700,margin:'auto'}}><h1>Não foi possível carregar o Modo Feira</h1><p>Confira a conexão e tente carregar novamente. A simulação não avançará com dados incompletos.</p><button onClick={()=>window.location.reload()}>Tentar novamente</button> <a href={modeHref('legado')}>Abrir apresentação original</a></main>:this.props.children;}
}
