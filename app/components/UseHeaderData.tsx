import { useEffect, useState } from "react";
import { getHeaderData } from "../lib/actions";
import { HeaderData } from "../lib/definitions";

export default function useHeaderData() {
  const [headerData, setHeaderData] = useState<HeaderData>();
  const [headerLoading, setHeaderLoading] = useState(false);

  useEffect(() => {
    const fetchHeaderData = async () => {
      setHeaderLoading(true);
      try {
        const response = await getHeaderData();
        if (response && response.length > 0) {
          setHeaderData(response[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setHeaderLoading(false);
      }
    };
    fetchHeaderData();
  }, []);

  return { headerData, headerLoading };
}
