import NavBar from '../NavBar';
import Content from './Content';
import Footer from '../Footer';

const style = {
  homeContainer : {
    height : '100%',
    backgroundColor : '#e9ebee'
  }
}

function Home() {
  return (
    <div style = {style.homeContainer}>
        <NavBar/>
        <Content/>
        <Footer/>
    </div>
  )
}

export default Home
