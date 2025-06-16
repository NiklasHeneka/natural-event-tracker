import { FadeLoader } from "react-spinners";

function Loader() {

    return (
        <div className="loader">
            <FadeLoader height={30} width={10} radius={10} margin={10}/>
            <h2>Fetching Data</h2>
        </div>
    );
}

export default Loader;