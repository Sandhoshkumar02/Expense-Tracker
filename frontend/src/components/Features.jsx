import { AiOutlineFile } from "react-icons/ai";
import { FaChartLine, FaMobileAlt, FaWallet } from 'react-icons/fa';
import "./Features.css";

function Features() {
  return (
    <div className="features">
        <Feature
            icon={<FaWallet/>}
            title="Manage Your Budget"
            desc = "Easily create and customize budgets to stay on top of your spending."
        />

        <Feature
            icon={<FaChartLine/>}
            title="Analyze Your Expenses"
            desc = "Visualize your expenses with interactive charts and insightful reports."
        />

        <Feature
            icon={<FaMobileAlt/>}
            title="Access Anywhere"
            desc = "Track your expenses on the go with our mobile-friendly app."
        />

        <Feature
            icon={<AiOutlineFile/>}
            title="Detailed Reports"
            desc = "Download monthly and yearly expense reports in PDF or Excel format."
        />
    </div>
  )
}

function Feature({ icon, title, desc}){
    return(
        <div className="feature-card">
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    )
}

export default Features