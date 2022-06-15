import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const useFetch = (url, headers?: Object) => {
    const cache = useRef({});
    const [status, setStatus] = useState("idle");
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!url) return;
        const fetchData = async () => {
            setStatus("fetching");
            if (cache.current[url]) {
                const data = cache.current[url];
                setData(data);
                setStatus("fetched");
            } else {
                const response = await axios.get(url, headers);
                const data = response.data;
                cache.current[url] = data; // set response in cache;
                setData(data);
                setStatus("fetched");
            }
        };

        fetchData();
    }, [url]);

    return { status, data };
};
