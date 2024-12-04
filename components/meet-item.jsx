import { Calendar, Clock, AlarmClock, FileText, Trash2, SquarePen } from "lucide-react";
import { Button } from "./ui/button";

const MeetItem = ({ meet }) => {
    return (
        <div className="w-full p-4 flex items-center rounded border border-zinc-200 shadow-shadow-soft">
            <div className="flex items-stretch flex-1">
                <div className="px-4 flex flex-col justify-center bg-indigo-100 rounded font-semibold text-center">
                    <span className="block">15</span>
                    <span>Marraskuuta</span>
                </div>
                <div className="ml-6 self-start text-sm space-y-2">
                    <h3 className="text-indigo-500 font-semibold">Projektin "Pois Tieltä" ideointi ja keskustelu</h3>
                    <p className="flex items-center">
                        <Clock size={17} className="mr-2 text-indigo-500" />
                        <span className="text-sm">10:00 - 12:00</span>
                    </p>
                    <div className="flex items-center">
                        <img src="/blank_profile.png" alt="" className="w-[35px] h-[35px] mr-2 rounded object-cover" />
                        <p className="font-medium">Semen Meliachenko</p>
                    </div>

                </div>
                <div className="self-start max-w-[40%] ml-6">
                    <FileText size={17} className="text-indigo-500" />
                    <p className="text-xs self-start inline-block mt-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt temporibus, sapiente voluptas blanditiis alias suscipit delectus nulla, voluptatum quasi amet numquam minus quidem a magnam pariatur rem autem debitis provident?</p>
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <Button variant="icon" className="hover:bg-red-50" title="Poista tapaaminen">
                    <Trash2 className="text-red-500" />
                </Button>
                <Button variant="icon" className="hover:bg-zinc-100" title="Muokkaa tapaaminen">
                    <SquarePen />
                </Button>
            </div>
        </div>
    );
}

export default MeetItem;