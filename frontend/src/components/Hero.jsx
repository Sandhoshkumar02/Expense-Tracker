import "./Hero.css"
import {Link} from 'react-router-dom'
export default function Hero(){
    return (
        <div className="hero">
            <h1>Track Your Expenses Like Never Before</h1>
            <p>Take control of your finances with our powerful Expense Tracker application. </p>
            <Link className="button" to="/signup">Sign Up Now</Link>
        </div>
    );
}