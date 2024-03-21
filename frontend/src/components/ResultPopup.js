import {Link} from "react-router-dom";


export default function ResultPopup({gameResult}) {

    const HeaderText = () => {
        let text = ""
        switch (gameResult) {
            case "won":
                text = "WINNER"
                break
            case "lost":
                text = "LOSER"
                break
            default:
                text = "Draw"
                break
        }

        return (
            <div className="text-xl mt-5">
                {text}
            </div>
        )
    }

    return (
        <div
            className="bg-orange-500 w-[25vw] h-[30vh] rounded-xl flex flex-col items-center justify-around text-white absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <HeaderText/>
            <Link to="/" className="mt-2 rounded-xl">
                Back to home
            </Link>
        </div>
    )

}