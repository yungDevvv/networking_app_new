import useSWR from "swr";
import { listDocuments } from "@/lib/appwrite/server/appwrite";


const fetcher = async ([db_id, collection_id, query]) => {
    try {
        const response = await listDocuments(db_id, collection_id, query);
        return response.documents;
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
};

export function useDocuments(db_id, collection_id, query) {
    const { data, error, isLoading, mutate } = useSWR(
        [db_id, collection_id, query],
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
        }
    );

    return {
        documents: data,
        isLoading,
        isError: error,
        mutate,
    };
}
