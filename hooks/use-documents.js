import useSWR from "swr";
import { listDocuments } from "@/lib/appwrite/server/appwrite";


const fetcher = async ([db_id, collection_id, query]) => {
    try {
        const response = await listDocuments(db_id, collection_id, query);
        return response.documents;
    } catch (error) {
        console.log("Error fetching documents:", error);
        throw error;
    }
};

export function useDocuments(db_id, collection_id, query, customFetcher) {
    const { data, error, isLoading, mutate } = useSWR(
        [db_id, collection_id, query],
        customFetcher || fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            dedupingInterval: 60000, 
            keepPreviousData: true
        }
    );

    return {
        documents: data,
        isLoading,
        isError: error,
        mutate,
    };
}
