import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f4f4f4' }}>
      <Link to="/">Home</Link> | 
      <Link to="/demo"> Demo </Link> | 
      <Link to="/sessions"> Sessions </Link> | 
      <Link to="/anchors"> Anchors </Link> | 
      <Link to="/progress"> Progress </Link>
    </nav>
  )
}

export default Navbar
