
import ProgressBar from "@/components/ProgressBar"
import { useCollections } from "@/context/CollectionsContext"
const UserCollectionStatus = ({index}) => {
    if(index==undefined){console.error("index must provide")}
    const {collections}= useCollections();
    const {word_cnt,not_memorized_cnt}=collections[index];
    return (
        <>
            <div className="flex justify-between  space-y-4">
                <span className="text-sm text-gray-500">{word_cnt == 0 ? "Empty" : "Memorized"}</span>
                {word_cnt != 0 && <span className="text-sm text-gray-500">{word_cnt - not_memorized_cnt}/{word_cnt}</span>}
            </div>

            {/* Status Bar */}
            <ProgressBar percentage={((word_cnt - not_memorized_cnt) / word_cnt) * 100} />
        </>
    )
}

export default UserCollectionStatus;
